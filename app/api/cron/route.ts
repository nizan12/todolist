import { NextResponse } from 'next/server';
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  try {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    
    if (projectId && clientEmail && privateKey) {
      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    } else {
      console.warn("Firebase admin environment variables are missing.");
    }
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

export async function GET(request: Request) {
  try {
    // Basic authorization for cron (Optional: check for Vercel Cron secret)
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!getApps().length) {
       return new NextResponse('Firebase Admin not initialized', { status: 500 });
    }

    const db = getFirestore();
    const messaging = getMessaging();
    const now = new Date();

    // In a real production app, we would query cross-collection group or iterate users.
    // For simplicity in this demo, let's get all users
    const usersSnapshot = await db.collection('users').get();
    
    let processedReminders = 0;

    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      
      // Get incomplete todos for this user
      const todosSnapshot = await db.collection(`users/${userId}/todos`)
        .where('completed', '==', false)
        .get();

      for (const todoDoc of todosSnapshot.docs) {
        const todo = todoDoc.data();
        if (!todo.dueDate || !todo.reminder?.enabled || !todo.reminder.reminders) continue;

        // Calculate actual deadline time
        const dueDateTime = todo.dueDate.toDate();
        if (todo.dueTime) {
          const [hours, minutes] = todo.dueTime.split(':');
          dueDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        } else {
          dueDateTime.setHours(23, 59, 59, 999);
        }

        let updatedReminders = [...todo.reminder.reminders];
        let needsUpdate = false;

        for (let i = 0; i < updatedReminders.length; i++) {
          const reminder = updatedReminders[i];
          if (reminder.sent) continue; // Already sent

          const reminderTime = new Date(dueDateTime.getTime() - reminder.minutesBefore * 60000);
          
          // If the current time has passed the scheduled reminder time
          if (now >= reminderTime) {
            // Get user devices (FCM Tokens)
            const devicesSnapshot = await db.collection(`users/${userId}/devices`).get();
            const tokens = devicesSnapshot.docs.map(doc => doc.data().token);

            let message = "";
            let title = "";
            let type = "reminder";

            if (reminder.minutesBefore === 0) {
              title = "Todo Deadline";
              message = `Task "${todo.title}" sudah mencapai deadline!`;
              type = "deadline";
            } else if (now > dueDateTime) {
              title = "Todo Overdue";
              message = `Task "${todo.title}" telah melewati deadline!`;
              type = "overdue";
            } else {
              title = "Todo Reminder";
              const timeText = reminder.minutesBefore >= 60 
                ? `${Math.floor(reminder.minutesBefore / 60)} hour(s)` 
                : `${reminder.minutesBefore} minutes`;
              message = `Task "${todo.title}" akan berakhir dalam ${timeText}.`;
            }

            if (tokens.length > 0) {
              // Send push notifications
              await messaging.sendEachForMulticast({
                tokens: tokens,
                notification: {
                  title: title,
                  body: message,
                },
                data: {
                  todoId: todoDoc.id
                }
              });
            }

            // Save notification to Firestore
            await db.collection(`users/${userId}/notifications`).add({
              todoId: todoDoc.id,
              title: title,
              message: message,
              type: type,
              read: false,
              createdAt: FieldValue.serverTimestamp(),
            });

            // Mark as sent
            updatedReminders[i].sent = true;
            needsUpdate = true;
            processedReminders++;
          }
        }

        if (needsUpdate) {
          await todoDoc.ref.update({
            'reminder.reminders': updatedReminders,
            updatedAt: FieldValue.serverTimestamp()
          });
        }
      }
    }

    return NextResponse.json({ success: true, processed: processedReminders });
  } catch (error: any) {
    console.error('Error running cron:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
