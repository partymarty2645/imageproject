import React, { useState, useCallback, useMemo, useEffect } from 'react';
import LoginScreen from './components/LoginScreen';
import MainView from './components/MainView';
import { User, AppState } from './types';
import { INITIAL_YESTERDAY_IMAGE } from './constants';
import { auth, ai } from './firebase/config';
import { signInUser, signOutUser, getUserProfile } from './services/authService';
import { ERROR_CODES } from './utils/errorHandling';
import LoadingSpinner from './components/LoadingSpinner';
import { ToastProvider } from './contexts/ToastContext';
import AppErrorBoundary from './components/AppErrorBoundary';
import { UI } from './constants/appConstants';
import { Button } from './components/ui/button';

const useWindowWidth = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return windowWidth;
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string>(INITIAL_YESTERDAY_IMAGE);
  const [appState, setAppState] = useState<AppState>({
    loading: false,
    error: null,
  });

  const width = useWindowWidth();
  const isMobile = width < UI.MOBILE_BREAKPOINT;
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const userProfile = await getUserProfile(firebaseUser.uid);
        if (userProfile) {
            setCurrentUser(userProfile);
        }
      } else {
        setCurrentUser(null);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);


  const handleLogin = useCallback(async (email: string, password: string): Promise<boolean> => {
    setError(null);
    try {
      const user = await signInUser(email, password);
      setCurrentUser(user);
      return true;
    } catch (error: any) {
      switch (error.code) {
        case ERROR_CODES.UNAUTHORIZED_EMAIL:
          setError('E-mailadres niet toegestaan');
          break;
        case ERROR_CODES.INVALID_CREDENTIALS:
          setError('E-mail of wachtwoord onjuist');
          break;
        default:
          setError('Inloggen mislukt. Controleer de console voor details.');
          console.error(error);
      }
      return false;
    }
  }, []);

  const handleLogout = useCallback(async () => {
    await signOutUser();
    setCurrentUser(null);
    setBackgroundImage(INITIAL_YESTERDAY_IMAGE);
  }, []);

  const handleImageLoad = useCallback((imageUrl: string) => {
    // Create a new Image object to test if the image loads successfully
    const img = new Image();
    img.onload = () => {
      console.log("✅ Background image loaded successfully");
      setBackgroundImage(imageUrl);
    };
    img.onerror = () => {
      console.error("❌ Background image failed to load:", imageUrl);
      // Keep the current background or use a fallback
    };
    img.src = imageUrl;
  }, []);

  const handleTestImageGeneration = useCallback(async () => {
    if (!ai) {
      alert("AI service niet beschikbaar");
      return;
    }
    
    try {
      setAppState({ loading: true, error: null });
      console.log("🚀 Starting image generation test...");
      
      const { generateDailyImageFree } = await import('./services/unsplashService');
      const imageUrl = await generateDailyImageFree();
      
      console.log("✅ Image generated and uploaded successfully!");
      console.log("📸 Image URL:", imageUrl);
      
      // Test URL accessibility
      const response = await fetch(imageUrl);
      if (response.ok) {
        console.log("✅ Image URL is accessible!");
        alert(`✅ Test geslaagd! Image URL: ${imageUrl}`);
        handleImageLoad(imageUrl); // Use the safe image loading function
      } else {
        console.log("❌ Image URL not accessible:", response.status);
        alert("❌ Image URL niet toegankelijk");
      }
      
    } catch (error) {
      console.error("❌ Test failed:", error);
      alert(`❌ Test mislukt: ${error}`);
    } finally {
      setAppState({ loading: false, error: null });
    }
  }, [ai]);

  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      fontFamily: "'Lato', sans-serif",
      backgroundColor: '#2c243b',
      color: '#ede7f6',
      minHeight: '100vh',
      width: '100%',
      overflowX: 'hidden',
      position: 'relative',
      zIndex: 1,
    },
    background: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      filter: 'blur(10px) brightness(0.4)',
      transform: 'scale(1.1)',
      zIndex: -1,
      transition: 'background-image 0.5s ease-in-out',
    },
    error: {
      color: '#ff8a8a',
      textAlign: 'center',
      padding: '20px',
      fontSize: '1.2rem',
      backgroundColor: 'rgba(74, 58, 88, 0.5)',
      border: '1px solid #ff8a8a',
      borderRadius: '8px',
      margin: '20px auto',
      maxWidth: '600px',
    },
  };

  if (appState.error) {
    return <div style={styles.container}><div style={styles.error}>{appState.error}</div></div>;
  }

  if (authLoading) {
    return <LoadingSpinner />;
  }
  
  // Removed AI check to allow proceeding without Firebase AI (using fallbacks)

  return (
    <AppErrorBoundary>
      <ToastProvider>
        <div style={styles.container}>
          <div style={styles.background}></div>
          {!currentUser ? (
            <LoginScreen onLogin={handleLogin} error={error} isMobile={isMobile} />
          ) : (
            <div>
              <Button 
                onClick={handleTestImageGeneration}
                disabled={appState.loading}
                className="fixed top-4 right-4 z-50"
                variant="outline"
              >
                {appState.loading ? 'Testen...' : '🖼️ Test Unsplash'}
              </Button>
              <MainView 
                currentUser={currentUser} 
                onLogout={handleLogout} 
                isMobile={isMobile}
                onImageLoad={handleImageLoad}
              />
            </div>
          )}
        </div>
      </ToastProvider>
    </AppErrorBoundary>
  );
};

export default App;