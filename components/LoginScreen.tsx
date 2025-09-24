import React, { useState } from 'react';
import { LoginScreenProps } from '../types';
import { MagicSparklesIcon } from './icons';

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, error, isMobile }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || loading) return;
    setLoading(true);
    await onLogin(email, password);
    setLoading(false);
  };

  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      background: 'radial-gradient(circle, #4a3a5a, #2c243b)',
    },
    titleContainer: {
        textAlign: 'center',
        marginBottom: '40px',
    },
    title: {
      fontFamily: "'Playfair Display', serif",
      fontSize: isMobile ? '2.8rem' : '3.5rem',
      fontWeight: 700,
      color: '#ede7f6',
      letterSpacing: '1px',
      textShadow: '0 0 10px #e7bda4, 0 0 20px #e7bda4, 0 0 30px #a981a9',
    },
    subtitle: {
        color: '#bca0bc',
        fontSize: isMobile ? '1rem' : '1.1rem',
        marginTop: '10px',
        fontFamily: "'Lato', sans-serif",
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px',
      backgroundColor: 'rgba(255, 255, 255, 0.07)',
      borderRadius: '15px',
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      backdropFilter: 'blur(4px)',
      WebkitBackdropFilter: 'blur(4px)',
      border: '1px solid rgba(255, 255, 255, 0.18)',
      width: isMobile ? '90%' : 'auto',
      maxWidth: '400px',
    },
    input: {
      width: '100%',
      maxWidth: '250px',
      padding: '12px 15px',
      marginBottom: '20px',
      borderRadius: '8px',
      border: '1px solid #7b6285',
      backgroundColor: '#2c243b',
      color: '#ede7f6',
      fontSize: '1rem',
      outline: 'none',
      textAlign: 'center',
      fontFamily: "'Lato', sans-serif",
      boxSizing: 'border-box',
    },
    button: {
      width: '150px',
      padding: '12px 15px',
      borderRadius: '8px',
      border: 'none',
      backgroundColor: '#a981a9',
      color: '#ffffff',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease, transform 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      opacity: loading ? 0.7 : 1,
    },
    error: {
      color: '#ff9a9a',
      marginTop: '15px',
      textAlign: 'center',
      height: '20px',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.titleContainer}>
        <h1 style={styles.title}>A Thoughtful Moment</h1>
        <p style={styles.subtitle}>Jullie privéruimte om te verbinden en te reflecteren.</p>
      </div>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mailadres"
          style={styles.input}
          aria-label="Email"
          disabled={loading}
          autoComplete="email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Wachtwoord"
          style={styles.input}
          aria-label="Password"
          disabled={loading}
          autoComplete="current-password"
        />
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? 'Inloggen...' : <><MagicSparklesIcon /> Binnenkomen</>}
        </button>
        <p style={styles.error}>{error || ''}</p>
      </form>
    </div>
  );
};

export default LoginScreen;