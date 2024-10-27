import React from 'react';

const Home = () => {
  // Define inline styles
  const styles = {
    home: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh', // Full viewport height
      backgroundColor: '#ecf0f1', // Example background color
      color: '#2c3e50', // Example text color
      textAlign: 'center', // Center text
    },
    h1: {
      fontSize: '2.5rem',
    },
    p: {
      fontSize: '1.2rem',
    },
  };

  return (
    <div style={styles.home}>
      <h1 style={styles.h1}>Welcome to My App!</h1>
      <p style={styles.p}>This is the homepage of your React application.</p>
    </div>
  );
};

export default Home;
