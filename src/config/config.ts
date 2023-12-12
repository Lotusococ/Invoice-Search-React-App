import { sendCustomTraceLog } from "src/interface/Axiom Log/sendCustomTraceLog";
import { requestEnvValue } from "src/interface/requestEnvValue";

interface FirebaseConfig {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId: string;
};

var firebaseConfig: FirebaseConfig | undefined;

export const getEnv = async () => {
    try {
        const response = await requestEnvValue();
        firebaseConfig = {
            apiKey: response.FIREBASE_APIKEY,
            authDomain: response.FIREBASE_AUTHDOMAIN,
            projectId: response.FIREBASE_PROJECTID,
            storageBucket: response.FIREBASE_STORAGEBUCKET,
            messagingSenderId: response.FIREBASE_MESSAGINGSENDERID,
            appId: response.FIREBASE_APPID,
            measurementId: response.FIREBASE_MEASUREMENTID
        };
    } catch (error) {
        console.error("There was an error while requesting environment variables: " + error);
    };
};

export const getFirebaseConfig = (): FirebaseConfig | undefined => {
    return firebaseConfig;
};