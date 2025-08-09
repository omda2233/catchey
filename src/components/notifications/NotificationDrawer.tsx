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
import { Bell, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNotifications } from '@/contexts/NotificationContext';

export type Notification = {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: 'order' | 'system' | 'payment' | 'shipping';
  relatedId?: string; // Order ID, product ID, etc.
};

export default function NotificationDrawer() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    unreadCount
  } = useNotifications();

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
                  className={`p-3 rounded-md relative ${notification.read ? 'bg-background' : 'bg-muted'}`}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">{notification.title}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {formatTimeAgo(notification.timestamp)}
                      </span>
                      <button
                        className="ml-2 text-muted-foreground hover:text-red-500"
                        onClick={() => dismissNotification(notification.id)}
                        aria-label="Dismiss"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
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
