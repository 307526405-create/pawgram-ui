import { Capacitor } from '@capacitor/core';
import { PushNotifications, Token, PushNotificationSchema, ActionPerformed } from '@capacitor/push-notifications';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

let initialized = false;

/**
 * Initialize push notifications and register device token with backend.
 * Call this once when the app is ready (user is logged in).
 * @param userId - Current user ID
 * @param token - JWT token for authentication
 */
export async function initPushNotifications(userId?: number, token?: string) {
  if (initialized) return;
  initialized = true;

  // Only run on native platforms
  if (!Capacitor.isNativePlatform()) {
    console.log('[Push] Not on native platform, skipping push notification init');
    return;
  }

  try {
    // Request permission
    const permStatus = await PushNotifications.requestPermissions();
    if (permStatus.receive !== 'granted') {
      console.log('[Push] Push notification permission denied');
      return;
    }

    // Register with Apple/Google
    await PushNotifications.register();

    // Listen for registration token
    PushNotifications.addListener('registration', async (t: Token) => {
      console.log('[Push] Registration token:', t.value);
      await registerDeviceToken(t.value, userId, token);
    });

    // Listen for registration errors
    PushNotifications.addListener('registrationError', (err: any) => {
      console.error('[Push] Registration error:', err);
    });

    // Handle incoming push when app is in foreground
    PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
      console.log('[Push] Received:', notification.title, notification.body);
    });

    // Handle notification tap (app opened from notification)
    PushNotifications.addListener('pushNotificationActionPerformed', (action: ActionPerformed) => {
      console.log('[Push] Action performed:', action.notification);
    });

    console.log('[Push] Push notifications initialized');
  } catch (err) {
    console.error('[Push] Failed to initialize push notifications:', err);
  }
}

/**
 * Send device token to backend for registration.
 */
async function registerDeviceToken(deviceToken: string, userId?: number, authToken?: string) {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const body: Record<string, unknown> = {
      deviceToken,
      platform: Capacitor.getPlatform(),
    };
    if (userId) {
      body.userId = userId;
    }

    const resp = await fetch(`${API_BASE}/api/auth/register-device`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const data = await resp.json();
    if (data.code === 0) {
      console.log('[Push] Device token registered with server');
    } else {
      console.error('[Push] Failed to register device token:', data.msg);
    }
  } catch (err) {
    console.error('[Push] Error registering device token:', err);
  }
}
