import React, { useState } from 'react';

const styles = {
  wrapper: {
    display: 'flex',
    justifyContent: 'center', 
    alignItems: 'center',     
    height: '100vh',
    width: '100%',           
    margin: 0,   
    padding: 0,
    backgroundImage: 'url(https://images.pexels.com/photos/32997/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)',  // Background image
    backgroundSize: 'cover',    // Ensures the image covers the entire page
    backgroundPosition: 'center',
  },
  container: {
    maxWidth: '32rem',
    width: '100%',
    padding: '2rem',
    background: 'transparent',
    backdropFilter: 'blur(20px)',
    borderRadius: '10px',
    boxShadow: '2px 2px 6px 3px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '1.5rem',
    color: 'white',
    textShadow: '2px 3px 2px black',
  },
  form: {
    marginBottom: '1.5rem',
  },
  inputGroup: {
    display: 'flex',
    gap: '0.5rem',
  },
  input: {
    flex: 1,
    padding: '0.75rem',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  inputDisabled: {
    backgroundColor: '#f3f4f6',
    cursor: 'not-allowed',
  },
  button: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
    cursor: 'not-allowed',
  },
  errorMessage: {
    padding: '1rem',
    margin: '1rem 0',
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    borderRadius: '6px',
    fontSize: '0.875rem',
  },
  imageContainer: {
    marginTop: '1.5rem',
    display: 'flex',
    justifyContent: 'center',
  },
  generatedImage: {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  placeholder: {
    textAlign: 'center',
    color: '#6b7280',
    padding: '2rem 0',
  },
  statusMessage: {
    textAlign: 'center',
    color: '#3b82f6',
    marginTop: '1rem',
  },
};

const ImageGeneratorForm = () => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setStatus('Initializing...');
    setImage(null);

    try {
      setStatus('Generating your image...');
      const response = await fetch('https://promptify-server-production.up.railway.app/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to generate image');
      }

      const data = await response.json();
      setImage(data.data[0].url);
      setStatus('');
    } catch (error) {
      setError(error.message);
      console.error('Error generating image:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h2 style={styles.title}>Promptify</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <input
              type="text"
              placeholder="Enter your image description..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loading}
              style={{
                ...styles.input,
                ...(loading ? styles.inputDisabled : {}),
              }}
            />
            <button 
              type="submit" 
              disabled={loading || !prompt.trim()}
              style={{
                ...styles.button,
                ...(loading || !prompt.trim() ? styles.buttonDisabled : {}),
              }}
            >
              {loading ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </form>

        {error && (
          <div style={styles.errorMessage}>
            {error}
          </div>
        )}

        {status && (
          <div style={styles.statusMessage}>
            {status}
          </div>
        )}

        {image && (
          <div style={styles.imageContainer}>
            <img
              src={image}
              alt="Generated result"
              style={styles.generatedImage}
            />
          </div>
        )}

        {!image && !error && !loading && !status && (
          <div style={styles.placeholder}>
            Enter a prompt above to generate an image
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGeneratorForm;
