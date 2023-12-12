import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { setUserInfo } from '../requestSessionStorage';

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            setUserInfo(firebaseUser);
            setLoading(false);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return { user, loading };
};  