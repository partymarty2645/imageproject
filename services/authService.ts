

// Import the functions you need from the SDKs you need
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { User } from '../types';
import { ALLOWED_USERS } from '../constants';
import { AppError, ERROR_CODES } from '../utils/errorHandling';

/**
 * Logt een gebruiker in met e-mail en wachtwoord en koppelt de UID aan een profiel.
 * @param email Het e-mailadres van de gebruiker.
 * @param password Het wachtwoord van de gebruiker.
 * @returns Een User object of null als de gebruiker niet is toegestaan of de inloggegevens onjuist zijn.
 */
export const signInUser = async (email: string, password: string): Promise<User> => {
  const userConfig = ALLOWED_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!userConfig) {
    throw new AppError(ERROR_CODES.UNAUTHORIZED_EMAIL, 'E-mailadres niet toegestaan');
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    if (firebaseUser) {
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        const newUserProfile: Omit<User, 'uid'> = {
          id: userConfig.id,
          username: userConfig.username,
          partnerId: userConfig.partnerId,
          email: userConfig.email,
        };
        await setDoc(userDocRef, newUserProfile);
      }

      const profile = await getUserProfile(firebaseUser.uid);
      if (!profile) {
        throw new AppError(ERROR_CODES.GENERIC_LOGIN_ERROR, 'Kon gebruikersprofiel niet laden');
      }
      return profile;
    }
    throw new AppError(ERROR_CODES.INVALID_CREDENTIALS, 'E-mail of wachtwoord onjuist');
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    console.error("Firebase sign-in error:", error);
    throw new AppError(ERROR_CODES.GENERIC_LOGIN_ERROR, 'Inloggen mislukt', error as Error);
  }
};

/**
 * Logt de huidige gebruiker uit.
 */
export const signOutUser = async (): Promise<void> => {
  // Firebase v9: signOut is now a standalone function
  await signOut(auth);
};

/**
 * Haalt het gebruikersprofiel op uit Firestore op basis van UID.
 * @param uid De Firebase Authentication User ID.
 * @returns Een User object of null als het niet wordt gevonden.
 */
export const getUserProfile = async (uid: string): Promise<User> => {
  try {
    const userDocRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return { uid, ...userDoc.data() } as User;
    }
    throw new AppError(ERROR_CODES.GENERIC_LOGIN_ERROR, 'Gebruikersprofiel niet gevonden');
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    console.error('Error fetching user profile:', error);
    throw new AppError(ERROR_CODES.GENERIC_LOGIN_ERROR, 'Kon gebruikersprofiel niet laden', error as Error);
  }
};