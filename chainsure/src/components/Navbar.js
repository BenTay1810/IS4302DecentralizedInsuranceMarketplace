import React from 'react';import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = () => {


  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand" to="/">ChainSure</Link> 
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/">Marketplace</Link>
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
