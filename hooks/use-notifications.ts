import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, writeBatch } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Notification } from '../types/notification';
import { useAuth } from './use-auth';
import { requestNotificationPermission } from '../lib/messaging';

export function useNotifications() {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!currentUser) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    const q = query(
      collection(db, 'users', currentUser.uid, 'notifications'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Notification[];
      
      setNotifications(notifsData);
      setUnreadCount(notifsData.filter(n => !n.read).length);
    });

    return unsubscribe;
  }, [currentUser]);

  const markAsRead = async (notificationId: string) => {
    if (!currentUser) return;
    const notifRef = doc(db, 'users', currentUser.uid, 'notifications', notificationId);
    const batch = writeBatch(db);
    batch.update(notifRef, { read: true });
    await batch.commit();
  };

  const markAllAsRead = async () => {
    if (!currentUser || notifications.length === 0) return;
    
    const batch = writeBatch(db);
    const unreadNotifs = notifications.filter(n => !n.read);
    
    unreadNotifs.forEach(n => {
      const notifRef = doc(db, 'users', currentUser.uid, 'notifications', n.id);
      batch.update(notifRef, { read: true });
    });

    if (unreadNotifs.length > 0) {
      await batch.commit();
    }
  };

  const requestPermission = async () => {
    if (currentUser) {
      await requestNotificationPermission(currentUser.uid);
    }
  };

  return { notifications, unreadCount, markAsRead, markAllAsRead, requestPermission };
}
