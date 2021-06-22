import { useState, useEffect } from 'react';
import { createContext, ReactNode } from 'react';
import { auth, firebase } from '../services/firebase';

interface AuthProviderProps {
	children: ReactNode;
}

interface User {
	id: string;
	name: string;
	avatar: string;
}

interface AuthContextType {
	user?: User;
	signInWithGoogle: () => Promise<void>;
}

export const AuthContext = createContext({} as AuthContextType);

export const AuthProvider = ({children}: AuthProviderProps) => {
	const [user, setUser] = useState<User>();

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged(
			(user) => user && handleSetUser(user)
		)

		return () => {
			unsubscribe();
		}
	}, []);

	const handleSetUser = (user: firebase.User) => {
		const { displayName, photoURL, uid } = user;

		if (!displayName || !photoURL) {
			throw new Error('Missing information from Google Account');
		}

		setUser({
			id: uid,
			name: displayName,
			avatar: photoURL
		})
	};

	const signInWithGoogle = async () => {
		const provider = new firebase.auth.GoogleAuthProvider();	
		const result = await auth.signInWithPopup(provider);
		result.user && handleSetUser(result.user);
	}
	
	return (
		<AuthContext.Provider value={{user, signInWithGoogle}}>
			{children}
		</AuthContext.Provider>
	)
}

