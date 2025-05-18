
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

export type Notification = {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: 'order' | 'system' | 'payment' | 'shipping';
  relatedId?: string; // Order ID, product ID, etc.
};

// Mock notifications - in a real app these would come from a context or server
const mockNotifications: Notification[] = [
  {
    id: "n1",
    title: "Order Approved",
    message: "Your order #ORD-001 has been approved by the seller.",
    timestamp: new Date("2023-05-15T10:30:00"),
    read: false,
    type: "order",
    relatedId: "ORD-001"
  },
  {
    id: "n2",
    title: "Payment Received",
    message: "We have received your payment for order #ORD-002.",
    timestamp: new Date("2023-05-14T14:45:00"),
    read: true,
    type: "payment",
    relatedId: "ORD-002"
  },
  {
    id: "n3",
    title: "Shipping Update",
    message: "Your order #ORD-003 is out for delivery.",
    timestamp: new Date("2023-05-13T09:15:00"),
    read: false,
    type: "shipping",
    relatedId: "ORD-003"
  }
];

export default function NotificationDrawer() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return language === 'en' ? 'just now' : 'الآن';
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} ${language === 'en' ? 'min ago' : 'دقيقة مضت'}`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} ${language === 'en' ? 'hours ago' : 'ساعة مضت'}`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} ${language === 'en' ? 'days ago' : 'يوم مضى'}`;
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="flex justify-between items-center">
          <DrawerTitle>
            {language === 'en' ? 'Notifications' : 'الإشعارات'}
          </DrawerTitle>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
              className="text-sm"
            >
              {language === 'en' ? 'Mark all as read' : 'تعيين الكل كمقروء'}
            </Button>
          )}
        </DrawerHeader>
        <div className="py-2 px-4">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Bell className="h-12 w-12 mb-2 opacity-20" />
              <p>{language === 'en' ? 'No notifications yet' : 'لا توجد إشعارات بعد'}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-3 rounded-md ${notification.read ? 'bg-background' : 'bg-muted'}`}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">{notification.title}</h4>
                    <span className="text-xs text-muted-foreground">
                      {formatTimeAgo(notification.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                  {!notification.read && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mt-2 text-xs" 
                      onClick={() => markAsRead(notification.id)}
                    >
                      {language === 'en' ? 'Mark as read' : 'تعيين كمقروء'}
                    </Button>
                  )}
                  <Separator className="mt-2" />
                </div>
              ))}
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
