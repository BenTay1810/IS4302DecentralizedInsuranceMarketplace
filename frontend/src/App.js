// App.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Navbar from './components/Navbar';

function App() {
  const policies = [
    {
      name: 'Extreme Travel Policy',
      minStakeAmount: 50,
      claimBackRate: '5x',
      remainingPool: '5123 tokens / 10000 tokens',
    },
    {
      name: 'Life Policy',
      minStakeAmount: 100,
      claimBackRate: '3x',
      remainingPool: '584 tokens / 20000 tokens',
    },
  ];

  return (
    <div className="App">
      <Navbar />

      <div className="container">
        <header className="d-flex align-items-center py-3 border-bottom">
          <nav className="nav me-auto">
            <a href="#home" className="nav-link">Home</a>
            <a href="#travel" className="nav-link">Travel</a>
            <a href="#life" className="nav-link">Life</a>
            <a href="#property" className="nav-link">Property</a>
          </nav>
          <button className="btn me-3 list-button">List Now!</button>
          <input type="text" placeholder="What are you looking for?" className="form-control w-25" />
        </header>

        <div className="row mt-4">
          {policies.map((policy, index) => (
            <div key={index} className="col-md-4">
              <div className="card mb-4 shadow-sm p-4">
                <div className="card-body">
                  <h5 className="card-title mb-3">{policy.name}</h5>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Minimum Stake Amount:</span>
                    <span className="fw-bold">{policy.minStakeAmount} tokens</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Claim Back Rate:</span>
                    <span className="fw-bold">{policy.claimBackRate}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-3">
                    <span>Remaining Pool:</span>
                    <span className="text-primary fw-bold">{policy.remainingPool}</span>
                  </div>
                  <div className="d-flex justify-content-end">
                    <button className="btn buy-button">Buy</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
