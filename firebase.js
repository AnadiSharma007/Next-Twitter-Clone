// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import { initializeApp, getApp, hetApps, getApps} from 'firebase/app';
import {getFirestore} from 'firebase/firestore'
import  { getStorage } from 'firebase/storage'


const firebaseConfig = {
    apiKey: "AIzaSyCd9Iaq5Faa-mqpbchOQ0D7O5fRNifcQMo",
    authDomain: "twitter-clone-1e7f0.firebaseapp.com",
    projectId: "twitter-clone-1e7f0",
    storageBucket: "twitter-clone-1e7f0.appspot.com",
    messagingSenderId: "551115790311",
    appId: "1:551115790311:web:00aa6302761364fa640f42",
    measurementId: "G-66TTJQ09RV"
  };

  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  const db = getFirestore();
  const storage = getStorage();

  export default app;
  export { db, storage };