// src/firebaseConfig.ts
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getEnv, getFirebaseConfig } from 'src/config/config';
import { sendCustomTraceLog } from '../Axiom Log/sendCustomTraceLog';

export let firebaseAuth: FirebaseApp;

export const initializeFirebase = async () => {
    await getEnv();
    const config = getFirebaseConfig();
    if (!config) {
        sendCustomTraceLog(null, "Firebase configuration could not be loaded", "error", "firebaseConfig.ts");
        console.error("Firebase configuration could not be loaded");
        return;
    };
    firebaseAuth = initializeApp(config);
};
