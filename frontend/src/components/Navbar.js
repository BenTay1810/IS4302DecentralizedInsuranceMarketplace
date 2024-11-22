import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Web3 from "web3";
import { Web3Context } from "../Web3Context";

const Navbar = () => {
    const {
        connectWallet,
        account,
        setAccount,
        fetchIsTokenOwner,
        isTokenOwner,
    } = useContext(Web3Context);
    const [accounts, setAccounts] = useState([]);

    useEffect(() => {
        // Fetch accounts when the component mounts
        const fetchAccounts = async () => {
            if (window.ethereum) {
                const web3 = new Web3(window.ethereum);
                try {
                    const accountsList = await web3.eth.getAccounts();
                    setAccounts(accountsList);
                } catch (error) {
                    console.error("Error fetching accounts: ", error);
                }
            }
        };

        fetchAccounts();

        // Listen for account changes from MetaMask
        window.ethereum?.on("accountsChanged", (accounts) => {
            setAccount(accounts[0]);
        });

        fetchIsTokenOwner(account);
    }, [setAccount]);

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
                    {isTokenOwner && ( // Conditionally render "My Token" button
                        <li className="nav-item">
                            <Link className="nav-link" to="/mytok">
                                My Token
                            </Link>
                        </li>
                    )}
                    <li className="nav-item">
                        <Link className="nav-link" to="/myacc">
                            My Account
                        </Link>
                    </li>
                    <li className="nav-item dropdown">
                        {/* Button to toggle the account menu */}
                        <button
                            className="nav-link btn btn-link text-decoration-none dropdown-toggle"
                            id="navbarDropdown"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            {account
                                ? `Wallet: ${account.slice(
                                      0,
                                      6
                                  )}...${account.slice(-4)}`
                                : "Connect Wallet"}
                        </button>

                        {/* Account dropdown */}
                        <ul
                            className="dropdown-menu"
                            aria-labelledby="navbarDropdown"
                        >
                            {accounts.length > 0 ? (
                                accounts.map((acct, index) => (
                                    <li key={index}>
                                        <button
                                            className="dropdown-item"
                                            onClick={() => setAccount(acct)}
                                        >
                                            {acct.slice(0, 6)}...
                                            {acct.slice(-4)}
                                        </button>
                                    </li>
                                ))
                            ) : (
                                <li>
                                    <button className="dropdown-item" disabled>
                                        No accounts found
                                    </button>
                                </li>
                            )}
                            <li>
                                <button
                                    className="dropdown-item"
                                    onClick={connectWallet}
                                >
                                    Connect Wallet
                                </button>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
