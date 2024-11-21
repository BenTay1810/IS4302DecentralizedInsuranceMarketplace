import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Web3 from "web3";
import "bootstrap/dist/css/bootstrap.min.css";

const Navbar = () => {

    const [web3, setWeb3] = useState(null);
    
    useEffect(() => {
        const checkWalletConnected = async () => {
            if (window.ethereum) {
                const web3 = new Web3(window.ethereum);
                const accounts = await web3.eth.getAccounts();
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                }
            }
        };
        checkWalletConnected();
    }, []);

    const [account, setAccount] = useState("");

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                // Request accounts from MetaMask
                const accounts = await window.ethereum.request({
                    method: "eth_requestAccounts",
                });
                setAccount(accounts[0]); // Save the first account
            } catch (error) {
                console.error("Error connecting to wallet:", error);
            }
        } else {
            alert("MetaMask is not installed. Please install it to use this feature!");
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
            <Link className="navbar-brand" to="/">
                ChainSure
            </Link>
            <div className="collapse navbar-collapse">
                <ul className="navbar-nav ms-auto">
                    <li className="nav-item">
                        <Link className="nav-link" to="/">
                            Marketplace
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/myacc">
                            My Account
                        </Link>
                    </li>
                    <li className="nav-item">
                        <button
                            className="nav-link btn btn-link text-decoration-none"
                            onClick={connectWallet}
                        >
                            {account
                                ? `Wallet: ${account.slice(0, 6)}...${account.slice(-4)}`
                                : "Connect Wallet"}
                        </button>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
