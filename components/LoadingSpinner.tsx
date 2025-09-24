import React from 'react';

const LoadingSpinner: React.FC = () => {
  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#2c243b',
    },
    spinner: {
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      border: '5px solid rgba(237, 231, 246, 0.2)',
      borderTopColor: '#e7bda4',
      animation: 'spin 1s linear infinite',
    },
    text: {
      marginTop: '20px',
      color: '#ede7f6',
      fontFamily: "'Playfair Display', serif",
      fontSize: '1.2rem',
      letterSpacing: '1px',
    },
  };

  const keyframes = `
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `;

  return (
    <div style={styles.container}>
      <style>{keyframes}</style>
      <div style={styles.spinner}></div>
      <p style={styles.text}>Een nieuw moment wordt gecreëerd...</p>
    </div>
  );
};

export default LoadingSpinner;