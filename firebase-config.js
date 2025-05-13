
const firebaseConfig = {
  apiKey: "AIzaSyCCBHayicu__lR3mgl_XCI9wHnWkJFu6yA",
  authDomain: "todo-list-a3b97.firebaseapp.com",
  projectId: "todo-list-a3b97",
  storageBucket: "todo-list-a3b97.firebasestorage.app",
  messagingSenderId: "111574086625",
  appId: "1:111574086625:web:07af20a93ad86b371a58a0"
};





firebase.initializeApp(firebaseConfig);


window.auth = firebase.auth();
window.db = firebase.firestore();

