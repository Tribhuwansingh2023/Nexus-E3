import { X, Bus, Clock, AlertTriangle } from "lucide-react";

interface NotificationSheetProps {
  open: boolean;
  onClose: () => void;
}

const notifications = [
  {
    id: 1,
    type: "arriving",
    title: "Bus Arriving Soon",
    message: "Your bus will arrive at Saidapet in 5 minutes",
    time: "2 min ago",
    icon: Bus,
  },
  {
    id: 2,
    type: "delay",
    title: "Delay Update",
    message: "Route 1 is delayed by 10 minutes due to traffic",
    time: "15 min ago",
    icon: Clock,
  },
  {
    id: 3,
    type: "route",
    title: "Route Change",
    message: "Tomorrow's route will take Velachery bypass",
    time: "1 hour ago",
    icon: AlertTriangle,
  },
];

const NotificationSheet = ({ open, onClose }: NotificationSheetProps) => {
  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-foreground/20 z-30"
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div className="fixed right-0 top-0 bottom-0 w-80 bg-background z-40 shadow-xl animate-in slide-in-from-right duration-300">
        <div className="p-6 pt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">Notifications</h2>
            <button onClick={onClose} className="p-2 hover:bg-muted rounded-full">
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          <div className="space-y-4">
            {notifications.map((notification) => (
              <div 
                key={notification.id}
                className="p-4 bg-muted rounded-2xl"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <notification.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground text-sm">{notification.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationSheet;
