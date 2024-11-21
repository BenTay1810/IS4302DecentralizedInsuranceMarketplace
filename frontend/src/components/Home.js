// components/SplashPage.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Web3 from "web3";
import "bootstrap/dist/css/bootstrap.min.css";

const Home = () => {
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPolicies = async () => {
            // Initialize Web3 (Connect to the Ethereum network)
            const web3 = new Web3(window.ethereum); // or use Infura / Alchemy for remote access
            await window.ethereum.request({ method: "eth_requestAccounts" }); // Request access to user's wallet

            // Set the contract address and ABI
            const contractAddress = "0xYourContractAddress"; // Replace with your deployed contract address
            const contract = new web3.eth.Contract(
                InsurancePolicyABI.abi,
                contractAddress
            );

            // Call the smart contract's method to get policies
            try {
                const policyCount = await contract.methods
                    .getPolicyCount()
                    .call(); // Replace with the correct method
                const policies = [];
                for (let i = 0; i < policyCount; i++) {
                    const policy = await contract.methods.getPolicy(i).call(); // Replace with the correct method
                    policies.push(policy);
                }
                setPolicies(policies);
            } catch (error) {
                console.error("Error fetching policies:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPolicies();
    }, []);

    if (loading) {
        return <div>Loading policies...</div>;
    }

    <div className="container">
        <header className="d-flex align-items-center py-3 border-bottom">
            <nav className="nav me-auto">
                <a href="#home" className="nav-link">
                    Home
                </a>
                <a href="#travel" className="nav-link">
                    Travel
                </a>
                <a href="#life" className="nav-link">
                    Life
                </a>
                <a href="#property" className="nav-link">
                    Property
                </a>
            </nav>
            <Link to="/list1" className="btn me-3 list-button">
                List Now!
            </Link>
            <input
                type="text"
                placeholder="What are you looking for?"
                className="form-control w-25"
            />
        </header>

        <div className="row mt-4">
            {policies.map((policy, index) => (
                <div key={index} className="col-md-4">
                    <div className="card mb-4 shadow-sm p-4">
                        <div className="card-body">
                            <h5 className="card-title mb-3">{policy.name}</h5>
                            <div className="d-flex justify-content-between mb-2">
                                <span>Minimum Stake Amount:</span>
                                <span className="fw-bold">
                                    {policy.minStakeAmount} tokens
                                </span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span>Claim Back Rate:</span>
                                <span className="fw-bold">
                                    {policy.claimBackRate}
                                </span>
                            </div>
                            <div className="d-flex justify-content-between mb-3">
                                <span>Remaining Pool:</span>
                                <span className="text-primary fw-bold">
                                    {policy.remainingPool}
                                </span>
                            </div>
                            <div className="d-flex justify-content-end">
                                <button className="btn buy-button">Buy</button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>;
};

export default Home;
