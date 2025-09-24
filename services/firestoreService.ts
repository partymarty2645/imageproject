// Firebase v9 imports
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  arrayUnion,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { DailyData, ChatMessage } from '../types';
import { AppError, ERROR_CODES } from '../utils/errorHandling';

const DAILY_COLLECTION = 'dailyMoments';
const CHAT_SUBCOLLECTION = 'chat';

/**
 * Haalt de ID's op van alle dagen waarvoor data bestaat.
 * @returns Een array van datum-strings (YYYY-MM-DD).
 */
export const getAvailableDates = async (): Promise<string[]> => {
    const snapshot = await getDocs(collection(db, DAILY_COLLECTION));
    return snapshot.docs.map(doc => doc.id);
};

/**
 * Haalt de gegevens voor een specifieke dag op.
 * @param dateString De datum in YYYY-MM-DD formaat.
 * @returns Een DailyData object of null als het niet bestaat.
 */
export const getDailyData = async (dateString: string): Promise<DailyData | null> => {
  const docRef = doc(db, DAILY_COLLECTION, dateString);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data() as DailyData;
  }
  return null;
};

/**
 * Maakt een nieuw document aan voor de dagelijkse gegevens.
 * @param dateString De datum in YYYY-MM-DD formaat.
 * @param data De initiële DailyData.
 */
export const createDailyData = async (dateString: string, data: Omit<DailyData, 'chat'>): Promise<void> => {
  const docRef = doc(db, DAILY_COLLECTION, dateString);
  await setDoc(docRef, data);
};

/**
 * Slaat het antwoord van een gebruiker op voor een specifieke dag.
 * @param dateString De datum in YYYY-MM-DD formaat.
 * @param userId De ID van de gebruiker.
 * @param answer Het antwoord van de gebruiker.
 */
export const saveAnswer = async (dateString: string, userId: string, answer: string): Promise<void> => {
  const docRef = doc(db, DAILY_COLLECTION, dateString);
  const docData = await getDoc(docRef);

  if (docData.exists()) {
    const existingAnswers = docData.data()?.answers || [];
    const userHasAnswered = existingAnswers.some((a: { userId: string; }) => a.userId === userId);

    if (userHasAnswered) {
      // Update het bestaande antwoord
      const newAnswers = existingAnswers.map((a: { userId: string; answer: string; }) =>
        a.userId === userId ? { userId, answer } : a
      );
      await updateDoc(docRef, { answers: newAnswers });
    } else {
      // Voeg een nieuw antwoord toe
      await updateDoc(docRef, {
        answers: arrayUnion({ userId, answer })
      });
    }
  }
};

/**
 * Voegt een nieuw chatbericht toe aan de subcollectie van een dag.
 * @param dateString De datum in YYYY-MM-DD formaat.
 * @param message Het chatbericht object (zonder id en timestamp).
 */
export const addChatMessage = async (dateString: string, message: Omit<ChatMessage, 'id' | 'timestamp'>): Promise<void> => {
  const chatCollectionRef = collection(db, DAILY_COLLECTION, dateString, CHAT_SUBCOLLECTION);
  await addDoc(chatCollectionRef, {
    ...message,
    timestamp: serverTimestamp(),
  });
};

/**
 * Zet een real-time listener op voor de gegevens van een specifieke dag.
 * @param dateString De datum in YYYY-MM-DD formaat.
 * @param callback De functie die wordt aangeroepen met de nieuwe gegevens.
 * @param onError Optionele foutafhandelingsfunctie.
 * @returns Een unsubscribe functie.
 */
export const listenToDailyData = (
  dateString: string,
  callback: (data: DailyData | null) => void,
  onError?: (error: Error) => void
): (() => void) => {
  const docRef = doc(db, DAILY_COLLECTION, dateString);
  return onSnapshot(docRef,
    (docSnap) => {
      callback(docSnap.exists() ? (docSnap.data() as DailyData) : null);
    },
    (error) => {
      console.error('Firestore listener error:', error);
      onError?.(error);
    }
  );
};

/**
 * Zet een real-time listener op voor de chat van een specifieke dag.
 * @param dateString De datum in YYYY-MM-DD formaat.
 * @param callback De functie die wordt aangeroepen met de nieuwe lijst van berichten.
 * @param onError Optionele foutafhandelingsfunctie.
 * @returns Een unsubscribe functie.
 */
export const listenToChat = (
  dateString: string,
  callback: (messages: ChatMessage[]) => void,
  onError?: (error: Error) => void
): (() => void) => {
  const chatCollectionRef = collection(db, DAILY_COLLECTION, dateString, CHAT_SUBCOLLECTION);
  const q = query(chatCollectionRef, orderBy('timestamp', 'asc'));

  return onSnapshot(q,
    (querySnapshot) => {
      const messages = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as ChatMessage));
      callback(messages);
    },
    (error) => {
      console.error('Chat listener error:', error);
      onError?.(error);
    }
  );
};

/**
 * Uploadt een afbeelding naar GitHub repository en retourneert de raw URL.
 * Gebruikt WebP format en 768x768 resolutie voor optimale kwaliteit.
 * Ondersteunt zowel AI-gegenereerde als fallback afbeeldingen.
 * @param imageBlob De afbeeldingsblob om te uploaden.
 * @returns Een Promise die wordt omgezet in de GitHub raw URL van de afbeelding.
 */
export const uploadImage = async (imageBlob: Blob): Promise<string> => {
    const token = import.meta.env.VITE_GITHUB_TOKEN;
    const owner = import.meta.env.VITE_GITHUB_OWNER;
    const repo = import.meta.env.VITE_GITHUB_REPO;
    const branch = import.meta.env.VITE_GITHUB_BRANCH || 'main';
    const imagesPath = import.meta.env.VITE_GITHUB_IMAGES_PATH || 'images';

    if (!token || !owner || !repo) {
        throw new AppError(ERROR_CODES.UPLOAD_FAILED, 'GitHub configuratie ontbreekt. Controleer environment variables.');
    }

    // Converteer blob naar base64
    const base64Content = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            // Verwijder de data URL prefix (data:image/webp;base64,)
            const base64 = result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(imageBlob);
    });

    // Genereer unieke bestandsnaam - gebruik een eenvoudigere format
    const timestamp = Date.now();
    const fileName = `daily-image-${timestamp}.webp`;
    const filePath = `${imagesPath}/${fileName}`;

    try {
        // Check of bestand al bestaat
        const checkResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        let sha = null;
        if (checkResponse.ok) {
            const existingFile = await checkResponse.json();
            sha = existingFile.sha;
        }

        // Upload/create bestand
        const uploadResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: `Add daily image: ${fileName}`,
                content: base64Content,
                branch: branch,
                ...(sha && { sha }) // Alleen SHA toevoegen als bestand bestaat
            })
        });

        if (!uploadResponse.ok) {
            const error = await uploadResponse.json();
            throw new Error(`GitHub upload failed: ${error.message}`);
        }

        // Get the response to extract the correct download URL
        const uploadResult = await uploadResponse.json();
        console.log("GitHub upload result:", uploadResult);

        // Use the download_url from the API response instead of constructing raw URL
        const rawUrl = uploadResult.content?.download_url || `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`;
        console.log("Generated image URL:", rawUrl);
        return rawUrl;

    } catch (error) {
        console.error('GitHub upload error:', error);
        throw new AppError(ERROR_CODES.UPLOAD_FAILED, 'Kon afbeelding niet uploaden naar GitHub', error as Error);
    }
};