import { getToken } from "firebase/messaging";
import { getMessaging } from "./firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export const requestNotificationPermission = async (userId: string) => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const messaging = getMessaging();
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY // You will need to add VAPID key in .env.local if you want real push notifications
      });

      if (token) {
        // Save token to Firestore under user's devices
        const deviceRef = doc(db, 'users', userId, 'devices', token);
        await setDoc(deviceRef, {
          token,
          platform: 'web',
          browser: navigator.userAgent,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        return token;
      }
    } else {
      console.log('Notification permission denied.');
    }
  } catch (error) {
    console.error('An error occurred while retrieving token. ', error);
  }
  return null;
};
