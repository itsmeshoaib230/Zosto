
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBE1U-hhT_h7cZn6PaW8w2BYZhAAG8-HRI",
  authDomain: "zosto-492c8.firebaseapp.com",
  projectId: "zosto-492c8",
  storageBucket: "zosto-492c8.firebasestorage.app",
  messagingSenderId: "228329505669",
  appId: "1:228329505669:web:7459731fa2c287c374baec",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
