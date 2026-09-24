# Todo List Web App
## Next.js + Firebase + Google Authentication + Deadline Reminder
## 0. install anti slop
tolong install paclkage ini pada project saya, 
https://github.com/miqdadbadjuber/anti-slop.git

## 0.1 Firebase config
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB8CU3VZnLYIFHTO2xqAyi1skwDFqPhnVg",
  authDomain: "todolist-56af2.firebaseapp.com",
  projectId: "todolist-56af2",
  storageBucket: "todolist-56af2.firebasestorage.app",
  messagingSenderId: "988929984438",
  appId: "1:988929984438:web:347d8b7986112bbfb9e317",
  measurementId: "G-2YH5NBK5BQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

## 1. Deskripsi Project

Buat aplikasi web **Todo List** modern, clean, minimalis, dan responsif menggunakan:

- Next.js dengan App Router
- TypeScript
- Firebase Authentication
- Firebase Firestore
- Firebase Cloud Messaging (FCM)
- Google Authentication
- Tailwind CSS
- Lucide React
- Vercel

Aplikasi memungkinkan pengguna login menggunakan Google, membuat dan mengelola Todo List, serta menerima notifikasi ketika deadline Todo sudah dekat atau tercapai.

Setiap pengguna hanya boleh melihat dan mengelola Todo miliknya sendiri.

---

# 2. Fitur Utama

- Login menggunakan Google
- Logout
- Route protection
- Membuat Todo
- Mengedit Todo
- Menghapus Todo
- Menandai Todo selesai
- Mengembalikan Todo menjadi aktif
- Priority Todo
- Due date
- Due time
- Deadline reminder
- Browser push notification
- Firebase Cloud Messaging
- Upcoming deadlines
- Notification center
- Filter Todo
- Sorting Todo
- Statistik Todo
- Status Active / Completed / Overdue
- Realtime update menggunakan Firestore
- Responsive desktop, tablet, dan mobile

---

# 3. Teknologi

```text
Next.js
TypeScript
Firebase Authentication
Firebase Firestore
Firebase Cloud Messaging
Tailwind CSS
Lucide React
Vercel
```

Gunakan:

```text
Next.js App Router
```

Jangan menggunakan Pages Router.

---

# 4. Struktur Project

```text
todo-app/
│
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   │
│   ├── login/
│   │   └── page.tsx
│   │
│   └── dashboard/
│       └── page.tsx
│
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── modal.tsx
│   │   └── dropdown.tsx
│   │
│   ├── auth/
│   │   └── google-login-button.tsx
│   │
│   ├── todo/
│   │   ├── todo-form.tsx
│   │   ├── todo-item.tsx
│   │   ├── todo-list.tsx
│   │   ├── todo-filter.tsx
│   │   └── todo-statistics.tsx
│   │
│   ├── notification/
│   │   └── notification-center.tsx
│   │
│   └── navbar.tsx
│
├── hooks/
│   ├── use-auth.ts
│   ├── use-todos.ts
│   └── use-notifications.ts
│
├── lib/
│   ├── firebase.ts
│   ├── auth.ts
│   ├── firestore.ts
│   └── messaging.ts
│
├── types/
│   ├── user.ts
│   ├── todo.ts
│   └── notification.ts
│
├── public/
│   └── firebase-messaging-sw.js
│
├── .env.local
├── .gitignore
├── package.json
└── README.md
```

---

# 5. Firebase Configuration

Gunakan Firebase sebagai backend.

Firebase services:

```text
Firebase Authentication
Firebase Firestore
Firebase Cloud Messaging
```

## Authentication

Aktifkan:

```text
Google Sign-In
```

Tidak perlu membuat sistem username/password.

User cukup menekan:

```text
Continue with Google
```

---

# 6. Environment Variables

Gunakan:

```text
.env.local
```

Contoh:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_VAPID_KEY=
```

Jangan menyimpan Firebase Admin credentials di `NEXT_PUBLIC_*`.

Firebase Admin SDK hanya boleh digunakan di server.

---

# 7. Firebase Initialization

Buat:

```text
lib/firebase.ts
```

File tersebut bertugas menginisialisasi:

```text
Firebase App
Firebase Auth
Firestore
```

Gunakan singleton agar Firebase tidak diinisialisasi berulang kali.

---

# 8. Google Authentication

Gunakan:

```text
GoogleAuthProvider
signInWithPopup()
```

Flow:

```text
User membuka aplikasi
        ↓
Login dengan Google
        ↓
Firebase Authentication
        ↓
Login berhasil
        ↓
Redirect ke /dashboard
```

Jika user belum login dan membuka:

```text
/dashboard
```

redirect ke:

```text
/login
```

---

# 9. User Data

Gunakan Firebase Authentication sebagai sumber identitas user.

Data yang tersedia:

```text
uid
displayName
email
photoURL
```

Opsional simpan data tambahan:

```text
users/{uid}
```

Contoh:

```json
{
  "uid": "firebase-user-id",
  "name": "John Doe",
  "email": "john@gmail.com",
  "photoURL": "https://...",
  "timezone": "Asia/Jakarta",
  "createdAt": "timestamp"
}
```

---

# 10. Firestore Database Structure

Gunakan struktur:

```text
users
└── {uid}
    ├── devices
    │   └── {deviceId}
    │
    ├── notifications
    │   └── {notificationId}
    │
    └── todos
        └── {todoId}
```

Dengan struktur ini, Todo setiap user terisolasi.

User A tidak boleh membaca Todo User B.

---

# 11. Todo Data Structure

Gunakan interface:

```typescript
interface Todo {
  id: string;
  title: string;
  description?: string;

  completed: boolean;

  priority: "low" | "medium" | "high";

  dueDate?: Timestamp | null;
  dueTime?: string | null;

  reminder?: {
    enabled: boolean;
    reminders: {
      minutesBefore: number;
      sent: boolean;
    }[];
  };

  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

Contoh:

```json
{
  "title": "Meeting dengan tim",
  "description": "Membahas progress project",
  "completed": false,
  "priority": "high",
  "dueDate": "2026-09-30",
  "dueTime": "18:00",
  "reminder": {
    "enabled": true,
    "reminders": [
      {
        "minutesBefore": 1440,
        "sent": false
      },
      {
        "minutesBefore": 60,
        "sent": false
      },
      {
        "minutesBefore": 15,
        "sent": false
      }
    ]
  },
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

---

# 12. Dashboard

Setelah login:

```text
/dashboard
```

Dashboard terdiri dari:

```text
Navbar
Greeting
Statistics
Upcoming Deadlines
Todo Form
Todo Filter
Todo List
```

---

# 13. Navbar

Navbar berisi:

```text
Todo App
```

Sebelah kanan:

```text
Notification
Profile
User Name
Logout
```

Notification menggunakan icon Bell.

Jika terdapat notification yang belum dibaca:

```text
Bell + badge jumlah notification
```

Navbar harus sticky.

---

# 14. Greeting

Tampilkan berdasarkan waktu:

```text
Good morning, Sahrul
Good afternoon, Sahrul
Good evening, Sahrul
```

Nama user diambil dari Firebase Authentication.

Subheading:

```text
Manage your tasks and stay productive.
```

---

# 15. Todo Statistics

Tampilkan:

```text
Total Tasks
Completed
Pending
High Priority
Overdue
```

Statistik harus otomatis berubah ketika Todo berubah.

---

# 16. Add Todo

Form berisi:

```text
Title
Description
Priority
Due Date
Due Time
Reminder
Add Todo
```

Contoh:

```text
What needs to be done?

Description

Priority
[Medium]

Due Date
[30 Sep 2026]

Due Time
[18:00]

Reminder
[15 minutes before]

Add Todo
```

Title wajib diisi.

Description optional.

Priority:

```text
Low
Medium
High
```

---

# 17. Deadline Reminder

User dapat menentukan reminder saat membuat atau mengedit Todo.

Pilihan:

```text
No reminder
At deadline
5 minutes before
15 minutes before
30 minutes before
1 hour before
1 day before
```

User juga dapat menggunakan multiple reminders.

Contoh:

```text
1 day before
1 hour before
15 minutes before
```

---

# 18. Reminder Calculation

Contoh:

```text
Deadline: 18:00
Reminder: 15 minutes before
```

Maka:

```text
18:00 - 15 minutes
= 17:45
```

Pada pukul 17:45 sistem mengirim:

```text
Todo Reminder

Meeting dengan tim akan berakhir dalam 15 menit.
```

Setelah notification berhasil dikirim:

```text
sent = true
```

Aplikasi harus mencegah reminder yang sama dikirim dua kali.

---

# 19. Browser Notification Permission

Saat user mengaktifkan reminder, minta permission:

```text
Allow notifications?
```

Jika diizinkan:

```text
Notification Permission
        ↓
FCM Token
        ↓
Firestore
```

Jika ditolak, reminder tetap disimpan tetapi browser push notification tidak dapat dikirim.

Tampilkan:

```text
Notifications are disabled.

Enable browser notifications to receive deadline reminders.
```

---

# 20. Firebase Cloud Messaging

Gunakan:

```text
Firebase Cloud Messaging (FCM)
```

FCM digunakan untuk push notification.

Flow:

```text
Todo
 ↓
Deadline
 ↓
Reminder Scheduler
 ↓
FCM
 ↓
Browser
 ↓
Notification
```

Notification harus dapat diterima ketika tab website tidak aktif, selama browser dan permission mendukung push notification.

---

# 21. FCM Token

Simpan token:

```text
users/{uid}/devices/{deviceId}
```

Contoh:

```json
{
  "token": "FCM_TOKEN",
  "platform": "web",
  "browser": "Chrome",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

Satu user dapat memiliki beberapa device/browser.

---

# 22. Firebase Messaging Service Worker

Buat:

```text
public/firebase-messaging-sw.js
```

Service worker digunakan untuk menerima notification ketika website tidak sedang aktif.

Flow:

```text
Browser / tab tidak aktif
        ↓
FCM
        ↓
Service Worker
        ↓
Browser Notification
```

---

# 23. Notification Content

Notification reminder:

```text
Todo Reminder

Meeting dengan tim akan berakhir dalam 15 menit.
```

Notification deadline:

```text
Todo Deadline

Meeting dengan tim sudah mencapai deadline.
```

Notification overdue:

```text
Todo Overdue

Meeting dengan tim telah melewati deadline.
```

---

# 24. Notification Click

Ketika user mengklik notification:

```text
Notification
      ↓
Click
      ↓
Open Todo App
      ↓
Dashboard
      ↓
Todo terkait ditampilkan
```

Jika memungkinkan gunakan:

```text
/dashboard?todo={todoId}
```

Todo terkait diberi highlight sementara.

---

# 25. Reminder Scheduler

Jangan mengandalkan:

```text
setTimeout()
setInterval()
```

di browser untuk reminder utama.

Alasannya:

- Tab dapat ditutup
- Browser dapat melakukan throttling
- Laptop dapat sleep
- Mobile browser dapat menghentikan JavaScript
- Reminder dapat terlewat

Gunakan server-side scheduler.

Pilihan:

```text
Firebase Cloud Functions
```

atau:

```text
Vercel Cron
```

Untuk arsitektur Firebase, Firebase Cloud Functions sangat cocok untuk proses reminder.

---

# 26. Scheduler Flow

```text
Firestore
   ↓
Todo deadline
   ↓
Scheduler
   ↓
Check reminder time
   ↓
Find pending reminders
   ↓
Send FCM
   ↓
Create notification history
   ↓
Mark reminder as sent
```

---

# 27. Multiple Reminder

Struktur:

```typescript
interface TodoReminder {
  enabled: boolean;

  reminders: {
    minutesBefore: number;
    sent: boolean;
  }[];
}
```

Contoh:

```json
{
  "reminder": {
    "enabled": true,
    "reminders": [
      {
        "minutesBefore": 1440,
        "sent": false
      },
      {
        "minutesBefore": 60,
        "sent": false
      },
      {
        "minutesBefore": 15,
        "sent": false
      }
    ]
  }
}
```

---

# 28. Overdue Detection

Jika:

```text
currentTime > dueDateTime
```

dan:

```text
completed == false
```

Todo dianggap:

```text
Overdue
```

Status Todo:

```text
Active
Completed
Overdue
```

Logic:

```text
completed === true
        ↓
Completed

completed === false
AND currentTime < dueDateTime
        ↓
Active

completed === false
AND currentTime > dueDateTime
        ↓
Overdue
```

---

# 29. Upcoming Deadlines

Tambahkan section:

```text
Upcoming Deadlines
```

Contoh:

```text
Upcoming Deadlines

Today
────────────────────
Meeting dengan tim
18:00
In 2 hours

Tomorrow
────────────────────
Submit laporan
09:00
Tomorrow
```

Urutkan berdasarkan deadline terdekat.

---

# 30. Notification Center

Navbar:

```text
Todo App                         [Bell]
```

Ketika diklik:

```text
Notifications

Meeting dengan tim
Due in 15 minutes

Submit laporan
Due tomorrow

Project presentation
Overdue
```

Notification yang belum dibaca memiliki visual berbeda.

---

# 31. Notification Data

Collection:

```text
users/{uid}/notifications/{notificationId}
```

Interface:

```typescript
interface Notification {
  id: string;
  todoId: string;
  title: string;
  message: string;
  type: "reminder" | "deadline" | "overdue";
  read: boolean;
  createdAt: Timestamp;
}
```

---

# 32. Mark Notification as Read

Ketika notification dibuka:

```text
read = true
```

Tambahkan action:

```text
Mark all as read
```

---

# 33. Todo List

Todo ditampilkan dalam card.

Contoh:

```text
┌──────────────────────────────────────────┐
│ ○ Menyelesaikan laporan           HIGH   │
│                                          │
│ Menyelesaikan laporan project            │
│                                          │
│ Due: 30 Sep 2026, 18:00                  │
│ Reminder: 15 minutes before              │
│                                          │
│                     Edit   Delete        │
└──────────────────────────────────────────┘
```

Todo selesai:

```text
✓ Menyelesaikan laporan
```

Gunakan:

```text
text-decoration: line-through
```

dan visual muted.

---

# 34. Todo Actions

Setiap Todo memiliki:

```text
Complete
Edit
Delete
```

Complete:

```text
completed = true
```

Jika ditekan lagi:

```text
completed = false
```

Jika Todo sudah completed, reminder berikutnya tidak boleh dikirim.

---

# 35. Edit Todo

Modal:

```text
Edit Todo

Title
Description
Priority
Due Date
Due Time
Reminder

Cancel
Save Changes
```

Ketika deadline atau reminder diubah, status reminder lama harus disesuaikan agar tidak terjadi duplicate notification.

---

# 36. Delete Todo

Delete wajib menggunakan confirmation modal.

```text
Delete Todo?

Are you sure you want to delete this task?
This action cannot be undone.

Cancel
Delete
```

Jangan langsung menghapus tanpa konfirmasi.

---

# 37. Filter

Filter status:

```text
All
Active
Completed
Overdue
```

Filter priority:

```text
All Priority
Low
Medium
High
```

Filter dapat digabung.

Contoh:

```text
Status: Active
Priority: High
```

---

# 38. Sorting

Pilihan:

```text
Newest
Oldest
Due Date
Priority
```

Default:

```text
Newest
```

---

# 39. Empty State

Jika tidak ada Todo:

```text
No tasks yet

Create your first task and start getting things done.

+ Add your first task
```

Jika filter tidak menemukan Todo:

```text
No tasks found

Try changing your filters.
```

---

# 40. Loading State

Ketika mengambil data Firebase:

```text
Loading your tasks...
```

Gunakan skeleton loading jika memungkinkan.

---

# 41. Error Handling

Gunakan toast.

Success:

```text
Todo created successfully
Todo updated successfully
Todo deleted successfully
Task marked as completed
Reminder created successfully
```

Error:

```text
Failed to create todo
Failed to update todo
Failed to delete todo
Failed to create reminder
Failed to send notification
```

---

# 42. Realtime Todo Updates

Gunakan:

```text
onSnapshot()
```

Flow:

```text
Firestore
   ↓
onSnapshot
   ↓
React State
   ↓
UI otomatis berubah
```

Pastikan listener di-unsubscribe ketika component unmount.

---

# 43. Authentication Hook

Buat:

```text
hooks/use-auth.ts
```

Hook menyediakan:

```typescript
currentUser
loading
login()
logout()
```

Gunakan:

```text
onAuthStateChanged()
```

---

# 44. Todo Hook

Buat:

```text
hooks/use-todos.ts
```

Menyediakan:

```typescript
todos
loading
createTodo()
updateTodo()
deleteTodo()
toggleTodo()
```

Semua operasi menggunakan UID user yang sedang login.

---

# 45. Notification Hook

Buat:

```text
hooks/use-notifications.ts
```

Menyediakan:

```typescript
notifications
unreadCount
markAsRead()
markAllAsRead()
requestNotificationPermission()
```

---

# 46. Firestore Functions

Buat:

```text
lib/firestore.ts
```

Fungsi:

```typescript
getTodos()
createTodo()
updateTodo()
deleteTodo()
toggleTodo()

getNotifications()
markNotificationAsRead()
markAllNotificationsAsRead()
```

Semua query harus dibatasi berdasarkan UID.

---

# 47. Route Protection

Flow:

```text
User membuka /dashboard
        ↓
Cek Firebase Auth
        ↓
Authenticated?
   ┌────┴────┐
  YES       NO
   ↓         ↓
Dashboard   /login
```

---

# 48. Login Page

URL:

```text
/login
```

Desain:

```text
┌─────────────────────────────┐
│                             │
│          Todo App           │
│                             │
│   Organize your tasks.      │
│   Stay productive.          │
│                             │
│ ┌─────────────────────────┐ │
│ │  G  Continue with Google│ │
│ └─────────────────────────┘ │
│                             │
│ By continuing, you agree... │
│                             │
└─────────────────────────────┘
```

Tidak perlu email/password.

---

# 49. Responsive Design

Desktop:

```text
Wide dashboard
```

Tablet:

```text
Responsive grid
```

Mobile:

```text
Single column
```

Todo card harus nyaman digunakan melalui touchscreen.

---

# 50. Design Style

Gunakan:

```text
Clean
Minimalist
Modern
Premium
Professional
```

Hindari:

```text
Gradient berlebihan
Animasi berlebihan
UI terlalu ramai
Emoji
Warna terlalu banyak
```

Gunakan whitespace yang cukup.

---

# 51. Color System

```text
Primary: #111827
Background: #F8FAFC
Card: #FFFFFF
Border: #E5E7EB
Text: #111827
Muted: #6B7280
Success: #16A34A
Warning: #F59E0B
Danger: #DC2626
```

Priority:

```text
Low    → muted
Medium → warning
High   → danger
```

---

# 52. Icons

Gunakan:

```text
Lucide React
```

Contoh:

```text
Plus
Check
Trash2
Pencil
Calendar
Clock
Bell
Filter
ChevronDown
LogOut
User
```

Jangan menggunakan emoji sebagai icon.

---

# 53. Accessibility

Gunakan:

```text
Semantic HTML
Label
ARIA
Keyboard navigation
Focus state
```

Button icon-only harus memiliki:

```html
aria-label="Delete todo"
```

---

# 54. Timezone

Deadline harus memperhitungkan timezone user.

Default Indonesia:

```text
Asia/Jakarta
```

Namun deteksi timezone browser jika memungkinkan:

```javascript
Intl.DateTimeFormat().resolvedOptions().timeZone
```

Simpan:

```text
users/{uid}.timezone
```

Contoh:

```json
{
  "timezone": "Asia/Jakarta"
}
```

Scheduler harus mengonversi deadline dan reminder berdasarkan timezone user.

---

# 55. Security Rules

Firestore Security Rules harus memastikan:

```text
request.auth != null
```

dan:

```text
request.auth.uid == userId
```

Contoh konsep:

```text
users/{userId}/todos/{todoId}
```

hanya boleh diakses jika:

```text
request.auth.uid == userId
```

User tidak boleh membaca atau mengubah Todo user lain.

---

# 56. FCM Security

FCM server credentials tidak boleh berada di client.

Jangan menggunakan:

```text
NEXT_PUBLIC_FIREBASE_ADMIN_PRIVATE_KEY
```

Gunakan Firebase Admin SDK hanya pada server-side function/API.

---

# 57. Recommended Notification Architecture

```text
                 ┌──────────────────┐
                 │     Next.js      │
                 │       Web        │
                 └────────┬─────────┘
                          │
              ┌───────────┴───────────┐
              │                       │
              ↓                       ↓
      Firebase Auth             Firestore
              │                       │
              │                  Todo Data
              │                       │
              │                       ↓
              │              Deadline / Reminder
              │                       │
              │                       ↓
              │               Cloud Scheduler
              │                       │
              │                       ↓
              │                      FCM
              │                       │
              │                       ↓
              │              Browser Notification
              │
              └───────────────┐
                              ↓
                         Google Login
```

---

# 58. Todo Creation Flow

```text
User mengisi form
        ↓
Validation
        ↓
Firebase Auth check
        ↓
Create Firestore document
        ↓
Success
        ↓
Form reset
        ↓
Toast
```

---

# 59. Reminder Flow

```text
User membuat Todo
        ↓
Menentukan deadline
        ↓
Menentukan reminder
        ↓
Todo disimpan Firestore
        ↓
Scheduler memeriksa deadline
        ↓
Reminder time tercapai
        ↓
FCM mengirim notification
        ↓
Browser menerima notification
        ↓
User klik notification
        ↓
Dashboard Todo terbuka
```

---

# 60. Overdue Flow

```text
Deadline terlewati
        ↓
completed === false
        ↓
Todo menjadi Overdue
        ↓
Dashboard menampilkan status Overdue
        ↓
Scheduler dapat mengirim notification overdue
```

Todo yang sudah completed tidak boleh ditandai overdue.

---

# 61. Deployment

Deploy menggunakan:

```text
Vercel
```

Environment variables ditambahkan melalui:

```text
Vercel
→ Project Settings
→ Environment Variables
```

Jangan commit:

```text
.env.local
```

---

# 62. Package

Install:

```bash
npm install firebase lucide-react
```

Jika menggunakan Firebase Admin pada server:

```bash
npm install firebase-admin
```

---

# 63. Development

Install:

```bash
npm install
```

Run:

```bash
npm run dev
```

Aplikasi:

```text
http://localhost:3000
```

---

# 64. Acceptance Criteria

Project dianggap selesai jika:

- [ ] User dapat login menggunakan Google
- [ ] User dapat logout
- [ ] User yang belum login tidak dapat membuka dashboard
- [ ] User dapat membuat Todo
- [ ] User dapat mengedit Todo
- [ ] User dapat menghapus Todo
- [ ] User dapat menandai Todo selesai
- [ ] User dapat mengembalikan Todo menjadi aktif
- [ ] User dapat menentukan priority
- [ ] User dapat menentukan due date
- [ ] User dapat menentukan due time
- [ ] User dapat mengaktifkan/nonaktifkan reminder
- [ ] User dapat memilih waktu reminder
- [ ] User dapat menggunakan multiple reminder
- [ ] Browser meminta notification permission
- [ ] FCM token dapat dibuat
- [ ] FCM token tersimpan berdasarkan user
- [ ] Reminder dikirim sesuai waktu
- [ ] Notification dapat diterima ketika tab tidak aktif jika browser mendukung
- [ ] Notification dapat diklik
- [ ] Klik notification membuka Todo terkait
- [ ] Todo overdue terdeteksi
- [ ] Todo completed tidak mengirim reminder berikutnya
- [ ] Reminder yang sama tidak dikirim dua kali
- [ ] Multiple device/browser didukung
- [ ] Timezone diperhitungkan
- [ ] Notification history tersedia
- [ ] Notification dapat ditandai sebagai read
- [ ] Todo realtime menggunakan Firestore
- [ ] User tidak dapat membaca Todo user lain
- [ ] Firestore Security Rules diterapkan
- [ ] Firebase Admin credentials tidak terekspos
- [ ] Responsive desktop/tablet/mobile
- [ ] Loading state tersedia
- [ ] Error handling tersedia
- [ ] Delete menggunakan confirmation modal
- [ ] Toast notification tersedia
- [ ] Tidak menggunakan emoji
- [ ] UI clean dan minimalis
- [ ] `npm run build` berhasil
- [ ] Project dapat di-deploy ke Vercel

---

# 65. Prinsip Pengembangan

Prioritaskan:

```text
Security
↓
Correctness
↓
User Experience
↓
Performance
↓
Clean Code
```

Jangan membuat sistem authentication sendiri.

Gunakan Firebase Authentication.

Jangan menyimpan password user.

Jangan menggunakan satu collection global yang memungkinkan user membaca Todo user lain.

Gunakan:

```text
users/{uid}/todos/{todoId}
```

sebagai struktur utama data Todo.

Untuk reminder, jangan hanya mengandalkan JavaScript timer di browser. Gunakan server-side scheduler + Firebase Cloud Messaging agar sistem reminder tetap dapat berjalan ketika tab website tidak aktif.
