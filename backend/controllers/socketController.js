const ROUTES = require("../data/routes.json");
const { busState } = require("../models/busState");
const { calculateStopWiseETA } = require("../utils/eta");

const TIMEOUT = 10000;
const PROXIMITY_RADIUS_M = 500; // meters for "bus near stop" alert

// Haversine distance in meters
function haversineM(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function socketHandler(io) {
  io.on("connection", (socket) => {
    console.log(`[Socket] Connected: ${socket.id}`);

    // ── Student / generic join ──────────────────────────────────
    socket.on("join-bus", ({ busId }) => {
      socket.join(busId);

      if (!busState[busId]) {
        busState[busId] = {
          broadcaster: socket.id,
          users: new Set([socket.id]),
          lastPing: Date.now(),
          visitedStops: new Set(),
        };
        socket.emit("broadcaster-status", { isBroadcaster: true });
      } else {
        busState[busId].users.add(socket.id);
        socket.emit("broadcaster-status", { isBroadcaster: false });
      }
    });

    // ── Legacy send-location (kept for backward compat) ────────
    socket.on("send-location", async ({ busId, lat, lng }) => {
      const bus = busState[busId];
      if (!bus || bus.broadcaster !== socket.id) return;

      bus.lastPing = Date.now();
      io.to(busId).emit("driver-location-update", { routeId: busId, lat, lng });

      const route = ROUTES.find((r) => r.busNumber === busId);
      if (!route) return;

      const stopETAs = await calculateStopWiseETA({ lat, lng }, route.stoppages);
      io.to(busId).emit("bus-stop-eta", stopETAs);
    });

    // ── Driver location broadcast ──────────────────────────────
    socket.on("driver-send-location", async ({ busId, lat, lng }) => {
      // CRITICAL FIX: ensure driver socket is IN the room
      socket.join(busId);

      const route = ROUTES.find((r) => r.busNumber === busId);
      if (!route) return;

      const isNewSession =
        !busState[busId] || busState[busId].broadcaster !== socket.id;

      // Initialise / update bus state
      if (!busState[busId]) {
        busState[busId] = {
          broadcaster: socket.id,
          users: new Set([socket.id]),
          lastPing: Date.now(),
          visitedStops: new Set(),
        };
      } else {
        busState[busId].users.add(socket.id);
        busState[busId].broadcaster = socket.id;
        busState[busId].lastPing = Date.now();
      }

      // ── Trip-started notification (only on first location of new session)
      if (isNewSession) {
        io.to(busId).emit("trip-started", {
          routeId: busId,
          routeName: route.routeName || route.busName,
          message: `${route.busName} has started its trip`,
          timestamp: Date.now(),
        });
      }

      // ── Broadcast live position to all listeners ──
      io.to(busId).emit("driver-location-update", { routeId: busId, lat, lng });

      // ── Proximity check — bus near a stop ──
      const bus = busState[busId];
      for (const stop of route.stoppages) {
        if (bus.visitedStops && bus.visitedStops.has(stop.name)) continue;

        const dist = haversineM(lat, lng, stop.coordinates.lat, stop.coordinates.lng);
        if (dist < PROXIMITY_RADIUS_M) {
          io.to(busId).emit("bus-near-stop", {
            routeId: busId,
            stopName: stop.name,
            distanceMeters: Math.round(dist),
            message: `Bus approaching ${stop.name}`,
            timestamp: Date.now(),
          });

          if (!bus.visitedStops) bus.visitedStops = new Set();
          bus.visitedStops.add(stop.name);
        }
      }

      // ── Calculate and broadcast ETAs ──
      try {
        const stopETAs = await calculateStopWiseETA({ lat, lng }, route.stoppages);
        io.to(busId).emit("bus-stop-eta", stopETAs);
      } catch (err) {
        console.error("[Socket] ETA calculation error:", err.message);
      }
    });

    // ── Driver goes offline ────────────────────────────────────
    socket.on("driver-offline", ({ busId }) => {
      const route = ROUTES.find((r) => r.busNumber === busId);

      io.to(busId).emit("bus-offline", { routeId: busId });
      io.to(busId).emit("trip-ended", {
        routeId: busId,
        routeName: route ? route.busName : busId,
        message: `${route ? route.busName : busId} has ended its trip`,
        timestamp: Date.now(),
      });

      if (busState[busId]) {
        delete busState[busId];
      }
    });

    // ── Disconnect cleanup ─────────────────────────────────────
    socket.on("disconnect", () => {
      console.log(`[Socket] Disconnected: ${socket.id}`);
      for (const id in busState) {
        const bus = busState[id];
        if (!bus.users.has(socket.id)) continue;

        bus.users.delete(socket.id);

        if (bus.broadcaster === socket.id) {
          promote(io, id);
        }

        if (bus.users.size === 0) {
          delete busState[id];
        }
      }
    });
  });

  // Stale broadcaster promotion interval
  setInterval(() => {
    const now = Date.now();
    for (const id in busState) {
      if (now - busState[id].lastPing > TIMEOUT) {
        promote(io, id);
      }
    }
  }, 5000);
}

function promote(io, busId) {
  const bus = busState[busId];
  if (!bus || bus.users.size === 0) return;

  const next = bus.users.values().next().value;
  bus.broadcaster = next;
  bus.lastPing = Date.now();

  io.to(next).emit("broadcaster-status", { isBroadcaster: true });
  io.to(busId).emit("handover");
}

module.exports = { socketHandler };
