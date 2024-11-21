import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';


const Account = ({ policies }) => (
  <div className="container">

    <div className="row mt-4">
        <label className="text-left mb-2" style={{ textAlign: 'left', fontSize: '1.5rem' }}>Listed Policies</label>
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

    <div className="row mt-4">
        <label className="text-left mb-2" style={{ textAlign: 'left', fontSize: '1.5rem' }}>Bought Policies</label>
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
                            <Link to="/claim1" className="btn buy-button">Claim</Link>
                        </div>
                    </div>
                </div>
            </div>
        ))}
    </div>

    
  </div>
);

export default Account;
