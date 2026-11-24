import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Rupeeve Error Boundary caught:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    try {
      localStorage.clear();
    } catch (e) {
      console.error(e);
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100dvh',
          backgroundColor: '#0A0F1D',
          color: '#FFFFFF',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          textAlign: 'center'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            backgroundColor: 'rgba(255, 77, 109, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            marginBottom: '16px'
          }}>
            ⚠️
          </div>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>
            Something went wrong
          </h1>
          <p style={{ fontSize: '13px', color: '#94A3B8', maxWidth: '320px', marginBottom: '20px' }}>
            Rupeeve encountered an unexpected issue while rendering.
          </p>
          <div style={{
            background: '#151C2C',
            border: '1px solid #1F293D',
            borderRadius: '12px',
            padding: '12px',
            fontSize: '11px',
            color: '#FF4D6D',
            maxWidth: '320px',
            overflowX: 'auto',
            marginBottom: '24px',
            textAlign: 'left'
          }}>
            {this.state.error?.toString()}
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '12px 20px',
                borderRadius: '12px',
                backgroundColor: '#3B82F6',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: 'bold',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Reload App
            </button>
            <button
              onClick={this.handleReset}
              style={{
                padding: '12px 20px',
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 77, 109, 0.15)',
                color: '#FF4D6D',
                border: 'none',
                fontWeight: 'bold',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Reset Data
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
