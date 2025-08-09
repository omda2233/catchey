// Biometric Authentication Service
// Supports fingerprint (Android) and Face ID (iOS) authentication

export interface BiometricAuthResult {
  success: boolean;
  error?: string;
  credentials?: {
    email: string;
    password: string;
  };
}

export interface BiometricConfig {
  title: string;
  subtitle: string;
  description: string;
  negativeButtonText: string;
}

class BiometricAuthService {
  private isAvailable: boolean = false;
  private biometricType: 'fingerprint' | 'face' | 'none' = 'none';

  // Initialize biometric authentication
  async initialize(): Promise<boolean> {
    try {
      // Check if running in Capacitor environment
      if (typeof window !== 'undefined' && 'Capacitor' in window) {
        // Check if biometric authentication is available
        const result = await this.checkBiometricAvailability();
        this.isAvailable = result.available;
        this.biometricType = result.type;
        
        console.log('Biometric authentication initialized:', {
          available: this.isAvailable,
          type: this.biometricType
        });
        
        return this.isAvailable;
      }
      
      // Web fallback - check for WebAuthn support
      if ('credentials' in navigator && 'preventSilentAccess' in navigator.credentials) {
        this.isAvailable = true;
        this.biometricType = 'fingerprint'; // WebAuthn supports fingerprint
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error initializing biometric authentication:', error);
      return false;
    }
  }

  // Check if biometric authentication is available
  private async checkBiometricAvailability(): Promise<{
    available: boolean;
    type: 'fingerprint' | 'face' | 'none';
  }> {
    try {
      // For Capacitor apps, we would use the actual biometric plugin
      // This is a placeholder implementation
      if (typeof window !== 'undefined' && 'Capacitor' in window) {
        // In a real implementation, you would:
        // 1. Import and use @capacitor/local-authentication
        // 2. Check available biometric types
        // 3. Return the appropriate type
        
        // Placeholder logic
        const isAndroid = /Android/i.test(navigator.userAgent);
        const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
        
        if (isAndroid) {
          return { available: true, type: 'fingerprint' };
        } else if (isIOS) {
          return { available: true, type: 'face' };
        }
      }
      
      return { available: false, type: 'none' };
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      return { available: false, type: 'none' };
    }
  }

  // Authenticate using biometrics
  async authenticate(config?: Partial<BiometricConfig>): Promise<BiometricAuthResult> {
    if (!this.isAvailable) {
      return {
        success: false,
        error: 'Biometric authentication is not available'
      };
    }

    try {
      const defaultConfig: BiometricConfig = {
        title: 'Biometric Authentication',
        subtitle: 'Please authenticate to continue',
        description: 'Use your fingerprint or face to sign in',
        negativeButtonText: 'Cancel'
      };

      const authConfig = { ...defaultConfig, ...config };

      if (typeof window !== 'undefined' && 'Capacitor' in window) {
        // Capacitor implementation
        return await this.authenticateWithCapacitor(authConfig);
      } else {
        // Web implementation
        return await this.authenticateWithWebAuthn(authConfig);
      }
    } catch (error) {
      console.error('Biometric authentication failed:', error);
      return {
        success: false,
        error: 'Authentication failed'
      };
    }
  }

  // Capacitor-specific authentication
  private async authenticateWithCapacitor(config: BiometricConfig): Promise<BiometricAuthResult> {
    try {
      // In a real implementation, you would use @capacitor/local-authentication
      // This is a placeholder that simulates the authentication flow
      
      console.log('Capacitor biometric authentication:', config);
      
      // Simulate authentication delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate success (in real implementation, this would be the actual result)
      const success = Math.random() > 0.1; // 90% success rate for demo
      
      if (success) {
        // Retrieve stored credentials
        const storedCredentials = this.getStoredCredentials();
        
        if (storedCredentials) {
          return {
            success: true,
            credentials: storedCredentials
          };
        } else {
          return {
            success: false,
            error: 'No stored credentials found'
          };
        }
      } else {
        return {
          success: false,
          error: 'Authentication failed'
        };
      }
    } catch (error) {
      console.error('Capacitor authentication error:', error);
      return {
        success: false,
        error: 'Authentication failed'
      };
    }
  }

  // WebAuthn implementation for web browsers
  private async authenticateWithWebAuthn(config: BiometricConfig): Promise<BiometricAuthResult> {
    try {
      // Check if WebAuthn is supported
      if (!('credentials' in navigator)) {
        return {
          success: false,
          error: 'WebAuthn is not supported'
        };
      }

      // In a real implementation, you would:
      // 1. Create a PublicKeyCredential
      // 2. Request user authentication
      // 3. Handle the authentication result
      
      console.log('WebAuthn authentication:', config);
      
      // Simulate authentication
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const storedCredentials = this.getStoredCredentials();
      
      if (storedCredentials) {
        return {
          success: true,
          credentials: storedCredentials
        };
      } else {
        return {
          success: false,
          error: 'No stored credentials found'
        };
      }
    } catch (error) {
      console.error('WebAuthn authentication error:', error);
      return {
        success: false,
        error: 'Authentication failed'
      };
    }
  }

  // Store credentials for biometric authentication
  async storeCredentials(email: string, password: string): Promise<boolean> {
    try {
      // In a real implementation, you would:
      // 1. Encrypt the credentials
      // 2. Store them securely (Keychain on iOS, Keystore on Android)
      // 3. Associate them with biometric authentication
      
      const credentials = { email, password };
      
      // For demo purposes, store in localStorage (NOT secure for production)
      localStorage.setItem('biometric_credentials', JSON.stringify(credentials));
      
      console.log('Credentials stored for biometric authentication');
      return true;
    } catch (error) {
      console.error('Error storing credentials:', error);
      return false;
    }
  }

  // Retrieve stored credentials
  private getStoredCredentials(): { email: string; password: string } | null {
    try {
      const stored = localStorage.getItem('biometric_credentials');
      if (stored) {
        return JSON.parse(stored);
      }
      return null;
    } catch (error) {
      console.error('Error retrieving stored credentials:', error);
      return null;
    }
  }

  // Clear stored credentials
  async clearStoredCredentials(): Promise<boolean> {
    try {
      localStorage.removeItem('biometric_credentials');
      console.log('Stored credentials cleared');
      return true;
    } catch (error) {
      console.error('Error clearing stored credentials:', error);
      return false;
    }
  }

  // Check if biometric authentication is available
  isBiometricAvailable(): boolean {
    return this.isAvailable;
  }

  // Get biometric type
  getBiometricType(): 'fingerprint' | 'face' | 'none' {
    return this.biometricType;
  }

  // Get user-friendly biometric type name
  getBiometricTypeName(): string {
    switch (this.biometricType) {
      case 'fingerprint':
        return 'Fingerprint';
      case 'face':
        return 'Face ID';
      default:
        return 'Biometric';
    }
  }
}

// Export singleton instance
export const biometricAuthService = new BiometricAuthService(); 