import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';


const PolicyDetails = ({ policies }) => {
  const { policyName } = useParams();
  const formattedPolicyName = policyName.replace(/-/g, ' ');
  const policy = policies.find((p) => p.name.toLowerCase() === formattedPolicyName.toLowerCase());
  const navigate = useNavigate(); 

  if (!policy) {
    return (
      <div className="container mt-5 text-center">
        <h1>Policy Not Found</h1>
        <button className="btn btn-primary mt-3" onClick={() => navigate('/')}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="container mt-5">
        <div className="position-relative">
          <button
            className="btn btn-light position-absolute top-0 start-0 mt-3 ms-3"
            onClick={() => navigate(-1)}
          >
            <i className="bi bi-arrow-left"></i> Back
          </button>
        </div>

        <div className="text-center my-5">
          <h1 className="mb-4">{policy.name}</h1>
        </div>

        <div className="row">
          <div className="col-md-6 offset-md-3">
            <div className="mb-3 d-flex justify-content-between">
              <span className="fw-bold">Minimum Stake Amount:</span>
              <span>{policy.minStakeAmount} tokens</span>
            </div>
            <div className="mb-3 d-flex justify-content-between">
              <span className="fw-bold">Claim Back Rate:</span>
              <span>{policy.claimBackRate}</span>
            </div>
            <div className="mb-3 d-flex justify-content-between">
              <span className="fw-bold">Remaining Pool:</span>
              <span className="text-primary">{policy.remainingPool}</span>
            </div>

            <div className="text-center mt-4">
            <Link to={`/policy/${policyName}/buy1`} className="btn buy-button">Buy</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyDetails;
