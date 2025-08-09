import { userService, notificationService, realtimeService } from './firestore';
import { auth } from './firebase';
import { CreateUserData, User } from '../models/firestoreSchemas';
import { notificationServiceInstance } from './notifications';

// UI Integration Service for automatic Firestore operations
export class UIIntegrationService {
  
  // Initialize user in Firestore after successful registration
  static async initializeUserInFirestore(
    userData: CreateUserData,
    authUserId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Create user document in Firestore
      const userId = await userService.createUser(userData);

      // Create initial notification for welcome message
      await notificationService.createNotification({
        userId: authUserId,
        title: 'Welcome to Catchy!',
        message: `Welcome ${userData.name}! Your account has been created successfully.`,
        type: 'system',
        read: false,
        actionUrl: '/dashboard'
      });

      console.log('User initialized in Firestore:', userId);
      return { success: true };

    } catch (error) {
      console.error('Error initializing user in Firestore:', error);
      return { success: false, error: 'Failed to initialize user data' };
    }
  }

  // Setup real-time listeners for user data
  static setupRealtimeListeners(userId: string, callbacks: {
    onNotificationsUpdate?: (notifications: any[]) => void;
    onOrdersUpdate?: (orders: any[]) => void;
    onUserUpdate?: (user: User | null) => void;
  }) {
    const unsubscribeFunctions: (() => void)[] = [];

    // Listen to user notifications
    if (callbacks.onNotificationsUpdate) {
      const unsubscribeNotifications = realtimeService.onUserNotifications(
        userId,
        callbacks.onNotificationsUpdate
      );
      unsubscribeFunctions.push(unsubscribeNotifications);
    }

    // Listen to user orders
    if (callbacks.onOrdersUpdate) {
      const unsubscribeOrders = realtimeService.onUserOrders(
        userId,
        callbacks.onOrdersUpdate
      );
      unsubscribeFunctions.push(unsubscribeOrders);
    }

    // Return cleanup function
    return () => {
      unsubscribeFunctions.forEach(unsubscribe => unsubscribe());
    };
  }

  // Initialize notification service for the app
  static async initializeNotificationService(): Promise<void> {
    try {
      await notificationServiceInstance.initialize();
      console.log('Notification service initialized');
    } catch (error) {
      console.error('Error initializing notification service:', error);
    }
  }

  // Handle user logout cleanup
  static async handleUserLogout(): Promise<void> {
    try {
      // Clear any cached data
      localStorage.removeItem('userNotifications');
      localStorage.removeItem('userOrders');
      
      // Clear any real-time listeners
      // (These should be cleaned up by the components using them)
      
      console.log('User logout cleanup completed');
    } catch (error) {
      console.error('Error during logout cleanup:', error);
    }
  }

  // Sync user data from Auth to Firestore
  static async syncUserDataFromAuth(): Promise<{ success: boolean; error?: string }> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        return { success: false, error: 'No authenticated user' };
      }

      // Check if user exists in Firestore
      const existingUser = await userService.getUserById(currentUser.uid);
      
      if (!existingUser) {
        // Create user in Firestore if doesn't exist
        const userData: CreateUserData = {
          name: currentUser.displayName || 'User',
          email: currentUser.email || '',
          role: 'buyer' // Default role
        };

        await this.initializeUserInFirestore(userData, currentUser.uid);
      }

      return { success: true };

    } catch (error) {
      console.error('Error syncing user data:', error);
      return { success: false, error: 'Failed to sync user data' };
    }
  }

  // Update user profile in Firestore
  static async updateUserProfile(
    userId: string,
    profileData: Partial<User>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await userService.updateUser(userId, profileData);
      
      // Create notification about profile update
      await notificationService.createNotification({
        userId,
        title: 'Profile Updated',
        message: 'Your profile has been updated successfully.',
        type: 'system',
        read: false
      });

      return { success: true };

    } catch (error) {
      console.error('Error updating user profile:', error);
      return { success: false, error: 'Failed to update profile' };
    }
  }

  // Get user's unread notification count
  static async getUnreadNotificationCount(userId: string): Promise<number> {
    try {
      const unreadNotifications = await notificationService.getUnreadNotificationsByUser(userId);
      return unreadNotifications.length;
    } catch (error) {
      console.error('Error getting unread notification count:', error);
      return 0;
    }
  }

  // Mark all notifications as read for user
  static async markAllNotificationsAsRead(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      await notificationService.markAllNotificationsAsRead(userId);
      return { success: true };
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      return { success: false, error: 'Failed to mark notifications as read' };
    }
  }

  // Setup global notification event listeners
  static setupGlobalNotificationListeners(): void {
    // Listen for notification received events
    window.addEventListener('notificationReceived', () => {
      // Update notification count in UI
      this.updateNotificationBadge();
    });

    // Listen for auth state changes
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        // User signed in - sync data and setup listeners
        await this.syncUserDataFromAuth();
        await this.initializeNotificationService();
      } else {
        // User signed out - cleanup
        await this.handleUserLogout();
      }
    });
  }

  // Update notification badge in UI
  private static async updateNotificationBadge(): Promise<void> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const unreadCount = await this.getUnreadNotificationCount(currentUser.uid);
      
      // Dispatch custom event to update notification badge
      const event = new CustomEvent('updateNotificationBadge', {
        detail: { count: unreadCount }
      });
      window.dispatchEvent(event);

    } catch (error) {
      console.error('Error updating notification badge:', error);
    }
  }

  // Initialize the entire UI integration system
  static async initialize(): Promise<void> {
    try {
      // Setup global listeners
      this.setupGlobalNotificationListeners();

      // Initialize notification service
      await this.initializeNotificationService();

      // Sync current user data if authenticated
      const currentUser = auth.currentUser;
      if (currentUser) {
        await this.syncUserDataFromAuth();
      }

      console.log('UI Integration service initialized successfully');

    } catch (error) {
      console.error('Error initializing UI Integration service:', error);
    }
  }
}

// Export singleton instance
export const uiIntegrationService = UIIntegrationService; 