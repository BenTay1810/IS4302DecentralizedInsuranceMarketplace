import React from 'react';

const Navbar = () => {
  // // Define styles for the navbar
  // const styles = {
  //   navbar: {
  //     display: 'flex',
  //     justifyContent: 'space-between',
  //     alignItems: 'center',
  //     padding: '10px 20px',
  //     backgroundColor: 'black', // Navbar background color
  //     color: '#fff', // Text color
  //   },
  //   title: {
  //     fontSize: '24px',
  //     fontWeight: 'bold',
  //   },
  //   navLinks: {
  //     listStyleType: 'none',
  //     display: 'flex',
  //     gap: '20px',
  //   },
  //   link: {
  //     color: '#fff',
  //     textDecoration: 'none',
  //     fontSize: '18px',
  //   },
  // };

  return (
    // <nav style={styles.navbar}>
    //   <div style={styles.title}>ChainSure</div>
    //   <ul style={styles.navLinks}>
    //     <li>
    //       <a href="#home" style={styles.link}>Marketplace</a>
    //     </li>
    //     <li>
    //       <a href="#about" style={styles.link}>My Account</a>
    //     </li>
    //     <li>
    //       <a href="#contact" style={styles.link}>Wallet</a>
    //     </li>
    //   </ul>
    // </nav>
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <a className="navbar-brand" href="#">ChainSure</a>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <a className="nav-link" href="#home">Marketplace</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#about">My Account</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#contact">Wallet</a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
