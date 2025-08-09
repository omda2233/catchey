import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export interface OperationLog {
  operation: string;
  timestamp: Date;
  userRole: string;
  userId: string;
  status: 'success' | 'error' | 'pending';
  details: any;
  errorMessage?: string;
  debugTrace?: string;
  transactionId?: string;
  deviceInfo?: {
    platform: string;
    version: string;
    userAgent: string;
  };
}

export interface PaymentLog extends OperationLog {
  paymentMethod: string;
  amount: number;
  orderId?: string;
}

export interface UserLog extends OperationLog {
  action: 'registration' | 'login' | 'logout' | 'profile_update';
  email?: string;
}

export interface OrderLog extends OperationLog {
  orderId: string;
  action: 'create' | 'update' | 'cancel' | 'ship';
  orderStatus: string;
  totalAmount: number;
}

class LoggingService {
  private logsCollection = collection(db, 'logs');

  /**
   * Log any operation with comprehensive details
   */
  async logOperation(log: OperationLog): Promise<void> {
    try {
      const logData = {
        user_id: log.userId,
        action_type: log.operation,
        status: log.status,
        timestamp: serverTimestamp(),
        deviceInfo: log.deviceInfo || this.getDeviceInfo(),
        errorMessage: log.errorMessage || null,
        details: {
          ...log.details,
          debugTrace: log.debugTrace,
          transactionId: log.transactionId,
          userRole: log.userRole
        }
      };

      await addDoc(this.logsCollection, logData);
      console.log('Operation logged:', log.operation, log.status);
    } catch (error) {
      console.error('Failed to log operation:', error);
    }
  }

  /**
   * Log payment operations
   */
  async logPayment(log: PaymentLog): Promise<void> {
    const operationLog: OperationLog = {
      operation: 'payment_processing',
      timestamp: log.timestamp,
      userRole: log.userRole,
      userId: log.userId,
      status: log.status,
      details: {
        paymentMethod: log.paymentMethod,
        amount: log.amount,
        orderId: log.orderId,
        ...log.details
      },
      errorMessage: log.errorMessage,
      debugTrace: log.debugTrace,
      transactionId: log.transactionId,
      deviceInfo: log.deviceInfo
    };

    await this.logOperation(operationLog);
  }

  /**
   * Log user authentication operations
   */
  async logUserAction(log: UserLog): Promise<void> {
    const operationLog: OperationLog = {
      operation: `user_${log.action}`,
      timestamp: log.timestamp,
      userRole: log.userRole,
      userId: log.userId,
      status: log.status,
      details: {
        action: log.action,
        email: log.email,
        ...log.details
      },
      errorMessage: log.errorMessage,
      debugTrace: log.debugTrace,
      deviceInfo: log.deviceInfo
    };

    await this.logOperation(operationLog);
  }

  /**
   * Log order operations
   */
  async logOrderAction(log: OrderLog): Promise<void> {
    const operationLog: OperationLog = {
      operation: `order_${log.action}`,
      timestamp: log.timestamp,
      userRole: log.userRole,
      userId: log.userId,
      status: log.status,
      details: {
        orderId: log.orderId,
        action: log.action,
        orderStatus: log.orderStatus,
        totalAmount: log.totalAmount,
        ...log.details
      },
      errorMessage: log.errorMessage,
      debugTrace: log.debugTrace,
      deviceInfo: log.deviceInfo
    };

    await this.logOperation(operationLog);
  }

  /**
   * Log admin operations
   */
  async logAdminAction(
    adminId: string,
    action: string,
    details: any,
    status: 'success' | 'error' = 'success'
  ): Promise<void> {
    const log: OperationLog = {
      operation: `admin_${action}`,
      timestamp: new Date(),
      userRole: 'admin',
      userId: adminId,
      status,
      details,
      debugTrace: `Admin action: ${action}`,
      deviceInfo: this.getDeviceInfo()
    };

    await this.logOperation(log);
  }

  /**
   * Log product operations
   */
  async logProductAction(
    userId: string,
    userRole: string,
    action: 'create' | 'update' | 'delete',
    productId: string,
    details: any,
    status: 'success' | 'error' = 'success'
  ): Promise<void> {
    const log: OperationLog = {
      operation: `product_${action}`,
      timestamp: new Date(),
      userRole,
      userId,
      status,
      details: {
        productId,
        action,
        ...details
      },
      debugTrace: `Product ${action}: ${productId}`,
      deviceInfo: this.getDeviceInfo()
    };

    await this.logOperation(log);
  }

  /**
   * Log shipping operations
   */
  async logShippingAction(
    userId: string,
    userRole: string,
    action: 'assign' | 'update_status' | 'complete',
    orderId: string,
    details: any,
    status: 'success' | 'error' = 'success'
  ): Promise<void> {
    const log: OperationLog = {
      operation: `shipping_${action}`,
      timestamp: new Date(),
      userRole,
      userId,
      status,
      details: {
        orderId,
        action,
        ...details
      },
      debugTrace: `Shipping ${action} for order: ${orderId}`,
      deviceInfo: this.getDeviceInfo()
    };

    await this.logOperation(log);
  }

  /**
   * Get device information
   */
  private getDeviceInfo() {
    return {
      platform: this.getPlatform(),
      version: this.getAppVersion(),
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
  }

  /**
   * Get platform information
   */
  private getPlatform(): string {
    if ((window as any).Capacitor) {
      return (window as any).Capacitor.getPlatform();
    }
    return 'web';
  }

  /**
   * Get app version
   */
  private getAppVersion(): string {
    // This would be replaced with actual app version from package.json or Capacitor config
    return '1.0.0-staging';
  }

  /**
   * Create debug trace for operations
   */
  createDebugTrace(operation: string, details: any): string {
    const timestamp = new Date().toISOString();
    const traceId = Math.random().toString(36).substring(2, 15);
    return `${operation}_${timestamp}_${traceId}`;
  }

  /**
   * Log error with full context
   */
  async logError(
    userId: string,
    userRole: string,
    operation: string,
    error: Error,
    details: any = {}
  ): Promise<void> {
    const log: OperationLog = {
      operation,
      timestamp: new Date(),
      userRole,
      userId,
      status: 'error',
      details,
      errorMessage: error.message,
      debugTrace: this.createDebugTrace(operation, details),
      deviceInfo: this.getDeviceInfo()
    };

    await this.logOperation(log);
  }

  /**
   * Log successful operation
   */
  async logSuccess(
    userId: string,
    userRole: string,
    operation: string,
    details: any = {}
  ): Promise<void> {
    const log: OperationLog = {
      operation,
      timestamp: new Date(),
      userRole,
      userId,
      status: 'success',
      details,
      debugTrace: this.createDebugTrace(operation, details),
      deviceInfo: this.getDeviceInfo()
    };

    await this.logOperation(log);
  }
}

export const loggingService = new LoggingService();
export default loggingService; 