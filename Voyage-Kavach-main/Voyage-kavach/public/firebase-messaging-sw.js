// importScripts('https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js');
// importScripts('https://www.gstatic.com/firebasejs/9.21.0/firebase-messaging.js');

// // Initialize Firebase in the service worker
// const firebaseConfig = {
//   apiKey: "AIzaSyDlFUT2jMfhapDD7NrCOeUC-UMOh6sigWI",
//   authDomain: "voyage-kavach.firebaseapp.com",
//   databaseURL: "https://voyage-kavach-default-rtdb.firebaseio.com",
//   projectId: "voyage-kavach",
//   storageBucket: "voyage-kavach.appspot.com",
//   messagingSenderId: "947840261682",
//   appId: "1:947840261682:web:05d9e26840fa507db8a62b"
// };

// firebase.initializeApp(firebaseConfig);

// const messaging = firebase.messaging();

// // Handle background messages
// messaging.onBackgroundMessage((payload) => {
//   console.log('Received background message:', payload);
//   // Customize notification here
//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//     icon: '/firebase-logo.png'
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });
