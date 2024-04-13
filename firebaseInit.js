// firebaseInit.js
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database"; // or "firebase/firestore" if you're using Firestore
import { firebaseConfig } from "./firebaseConfig";

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const database = firebase.database(); // or firebase.firestore() if you're using Firestore
