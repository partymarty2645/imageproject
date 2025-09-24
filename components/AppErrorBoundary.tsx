import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

class AppErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error Boundary caught an error:', error, errorInfo);
    // In production, you might want to send this to an error reporting service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          fontFamily: "'Lato', sans-serif",
          backgroundColor: '#2c243b',
          color: '#ede7f6',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          textAlign: 'center',
        }}>
          <div style={{
            backgroundColor: 'rgba(74, 58, 88, 0.8)',
            padding: '30px',
            borderRadius: '12px',
            maxWidth: '500px',
            border: '1px solid #ff8a8a',
          }}>
            <h2 style={{ marginBottom: '16px', color: '#ff8a8a' }}>
              Er is iets misgegaan
            </h2>
            <p style={{ marginBottom: '20px', lineHeight: '1.5' }}>
              De applicatie heeft een onverwachte fout ondervonden.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '12px 24px',
                backgroundColor: '#ede7f6',
                color: '#2c243b',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
              }}
            >
              Pagina vernieuwen
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;