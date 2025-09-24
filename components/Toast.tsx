import React, { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onDismiss: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onDismiss }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true); // Trigger fade-in
    const timer = setTimeout(() => {
      setVisible(false); // Trigger fade-out
      setTimeout(onDismiss, 300); // Wait for animation to finish before dismissing
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [onDismiss]);
  
  const keyframes = `
    @keyframes toast-in {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    @keyframes toast-out {
        from { opacity: 1; }
        to { opacity: 0; }
    }
  `;

  const styles: { [key: string]: React.CSSProperties } = {
    toast: {
      padding: '12px 20px',
      borderRadius: '8px',
      color: 'white',
      fontFamily: "'Lato', sans-serif",
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
      animation: visible ? 'toast-in 0.3s ease-out forwards' : 'toast-out 0.3s ease-in forwards',
    },
    success: {
      backgroundColor: '#679d6b', // Soothing green
      border: '1px solid #85c48a'
    },
    error: {
      backgroundColor: '#b55a5a', // Muted red
      border: '1px solid #d47b7b'
    },
  };

  return (
    <>
      <style>{keyframes}</style>
      <div style={{ ...styles.toast, ...(type === 'success' ? styles.success : styles.error) }}>
        {message}
      </div>
    </>
  );
};

export default Toast;
