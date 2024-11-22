import React, { createContext, useState, useEffect } from "react";
import Web3 from "web3";
import CSTokenABI from "./abis/CSTokenABI.json";
import InsuranceCompanyABI from "./abis/InsuranceCompanyABI.json";
import MarketplaceABI from "./abis/MarketplaceABI.json";

export const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
    const [account, setAccount] = useState(null);
    const [web3, setWeb3] = useState(null);
    const [networkId, setNetworkId] = useState(null);

    const [CSTokenContract, setCSTokenContract] = useState(null);
    const [InsuranceCompanyContract, setInsuranceCompanyContract] =
        useState(null);
    const [MarketplaceContract, setMarketplaceContract] = useState(null);

    const [listedPolicies, setListedPolicies] = useState([]);
    const [myListedPolicies, setMyListedPolicies] = useState([]);
    const [boughtPolicies, setBoughtPolicies] = useState([]);
    const [createdPolicies, setCreatedPolicies] = useState([]);
    const [isTokenOwner, setIsTokenOwner] = useState(false);
    const [isPolicyHolder, setIsPolicyHolder] = useState(false);

    useEffect(() => {
        const initWeb3 = async () => {
            if (!window.ethereum) {
                alert("MetaMask is required to use this application.");
                return;
            }

            try {
                const web3Instance = new Web3(window.ethereum);
                setWeb3(web3Instance);

                // Request access to accounts
                const accounts = await window.ethereum.request({
                    method: "eth_requestAccounts",
                });
                setAccount(accounts[0]);

                // Get the network ID
                const currentNetworkId = await web3Instance.eth.net.getId();
                setNetworkId(currentNetworkId);

                // Load contracts dynamically
                await loadContracts(web3Instance, currentNetworkId);

                fetchIsTokenOwner(accounts[0]);
                fetchIsPolicyHolder();
                fetchListedPolicies();
                fetchBoughtPolicies();

                // Handle account and network changes
                setupEventListeners();
            } catch (error) {
                console.error("Error initializing Web3: ", error);
            }
        };

        initWeb3();
    }, []);

    const setupEventListeners = () => {
        // Account change listener
        window.ethereum?.on("accountsChanged", (accounts) => {
            setAccount(accounts[0]);
            fetchIsTokenOwner(accounts[0]); // Re-fetch ownership on account change
        });

        // Network change listener
        window.ethereum?.on("chainChanged", () => {
            window.location.reload(); // Reload app on network change
        });
    };

    const loadContracts = async (web3Instance, networkId) => {
        try {
            const contracts = [
                {
                    abi: CSTokenABI,
                    setContract: setCSTokenContract,
                    name: "CSToken",
                },
                {
                    abi: InsuranceCompanyABI,
                    setContract: setInsuranceCompanyContract,
                    name: "InsuranceCompany",
                },
                {
                    abi: MarketplaceABI,
                    setContract: setMarketplaceContract,
                    name: "Marketplace",
                },
            ];

            for (const { abi, setContract, name } of contracts) {
                if (!abi.networks[networkId]) {
                    console.error(
                        `${name} contract is not deployed on network ID ${networkId}`
                    );
                    continue;
                }

                const contractAddress = abi.networks[networkId].address;
                const contract = new web3Instance.eth.Contract(
                    abi.abi,
                    contractAddress
                );
                setContract(contract);
                console.log(`${name} contract loaded at ${contractAddress}`);
            }
        } catch (error) {
            console.error("Error loading contracts:", error);
        }
    };

    const fetchIsTokenOwner = async (account) => {
        if (!CSTokenContract) return;

        try {
            const collateral = await CSTokenContract.methods
                .collateral(account)
                .call();
            setIsTokenOwner(collateral > 0);
        } catch (error) {
            console.error("Error checking token ownership:", error);
        }
    };

    const fetchIsPolicyHolder = async () => {
        if (!MarketplaceContract) return;

        try {
            const response = await MarketplaceContract.methods
                .isPolicyHolder()
                .call();
            setIsPolicyHolder(response);
        } catch (error) {
            console.error("Error checking token ownership:", error);
        }
    };

    const fetchListedPolicies = async () => {
        if (!InsuranceCompanyContract) return;

        try {
            const policyCount = await InsuranceCompanyContract.methods
                .policyCount()
                .call();
            const policies = [];

            for (let policyID = 1; policyID <= policyCount; policyID++) {
                // Get each policy by ID
                const policy = await InsuranceCompanyContract.methods
                    .getPolicy(policyID)
                    .call();

                const {
                    policyId,
                    policyName,
                    policyType,
                    claimBackRate,
                    maxPoolValue,
                    currPoolValue,
                    minStake,
                    coveragePeriod,
                    creator,
                    listed,
                } = policy;
                if (policy.listed === true) {
                    policies.push({
                        policyId,
                        policyName,
                        policyType,
                        claimBackRate,
                        maxPoolValue,
                        currPoolValue,
                        minStake,
                        coveragePeriod,
                        creator,
                        listed,
                    }); // Add the policy to the array if it is listed
                }
            }

            setListedPolicies(policies);
        } catch (error) {
            console.error("Error fetching listed policies:", error);
        }
    };

    const fetchMyListedPolicies = async () => {
        if (!InsuranceCompanyContract) return;

        try {
            const policyCount = await InsuranceCompanyContract.methods
                .policyCount()
                .call();
            const policies = [];

            for (let policyID = 1; policyID <= policyCount; policyID++) {
                // Get each policy by ID
                const policy = await InsuranceCompanyContract.methods
                    .getPolicy(policyID)
                    .call();

                const {
                    policyId,
                    policyName,
                    policyType,
                    claimBackRate,
                    maxPoolValue,
                    currPoolValue,
                    minStake,
                    coveragePeriod,
                    creator,
                    listed,
                } = policy;
                if (
                    policy.listed === true &&
                    policy.creator.toLowerCase() === account.toLowerCase()
                ) {
                    policies.push({
                        policyId,
                        policyName,
                        policyType,
                        claimBackRate,
                        maxPoolValue,
                        currPoolValue,
                        minStake,
                        coveragePeriod,
                        creator,
                        listed,
                    }); // Add the policy to the array if it is listed
                }
            }

            setMyListedPolicies(policies);
        } catch (error) {
            console.error("Error fetching listed policies:", error);
        }
    };

    const fetchBoughtPolicies = async () => {
        if (!MarketplaceContract || !isPolicyHolder) return;

        try {
            // Call the viewMyBoughtPolicies function to get all the buyer's policies
            const buyerPolicies = await MarketplaceContract.methods
                .viewMyBoughtPolicies()
                .call();

            const boughtPolicies = [];

            // Iterate through each buyer's policy
            for (const buyerPolicy of buyerPolicies) {
                // Check if buyerPolicy and boughtPolicy exist before proceeding
                if (buyerPolicy && buyerPolicy.boughtPolicy) {
                    const {
                        boughtPolicy,
                        coverageStartTimestamp,
                        coverageEndTimestamp,
                        coverageStartDate,
                        coverageEndDate,
                        ownedCSTokens,
                    } = buyerPolicy;

                    // Destructure the fields from the boughtPolicy struct
                    const {
                        policyId,
                        policyName,
                        policyType,
                        claimBackRate,
                        maxPoolValue,
                        currPoolValue,
                        minStake,
                        coveragePeriod,
                        creator,
                        listed,
                    } = boughtPolicy;

                    // Push the extracted and processed policy data into the boughtPolicies array
                    boughtPolicies.push({
                        policyId,
                        policyName,
                        policyType,
                        claimBackRate,
                        maxPoolValue,
                        currPoolValue,
                        minStake,
                        coveragePeriod,
                        creator,
                        listed,
                        coverageStartTimestamp,
                        coverageEndTimestamp,
                        coverageStartDate,
                        coverageEndDate,
                        ownedCSTokens,
                    });
                } else {
                    console.warn("Invalid policy data", buyerPolicy);
                }
            }

            // Update the state with the processed bought policies
            setBoughtPolicies(boughtPolicies);
        } catch (error) {
            console.error("Error fetching bought policies:", error);
        }
    };

    const fetchCreatedPolicies = async () => {
        if (!InsuranceCompanyContract) return;

        try {
            const policyCount = await InsuranceCompanyContract.methods
                .policyCount()
                .call();
            const createdPolicies = [];

            for (let policyID = 1; policyID <= policyCount; policyID++) {
                const policy = await InsuranceCompanyContract.methods
                    .getPolicy(policyID)
                    .call();

                if (
                    policy.creator.toLowerCase() === account.toLowerCase() &&
                    policy.listed == false
                ) {
                    const {
                        policyId,
                        policyName,
                        policyType,
                        claimBackRate,
                        maxPoolValue,
                        currPoolValue,
                        minStake,
                        coveragePeriod,
                        creator,
                        listed,
                    } = policy;

                    createdPolicies.push({
                        policyId,
                        policyName,
                        policyType,
                        claimBackRate,
                        maxPoolValue,
                        currPoolValue,
                        minStake,
                        coveragePeriod,
                        creator,
                        listed,
                    });
                }
            }

            setCreatedPolicies(createdPolicies); // Set the created policies
        } catch (error) {
            console.error("Error fetching created policies:", error);
        }
    };

    const connectWallet = async () => {
        if (!window.ethereum) {
            alert(
                "MetaMask is not installed. Please install it to use this feature!"
            );
            return;
        }

        try {
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            setAccount(accounts[0]);
        } catch (error) {
            console.error("Error connecting to wallet:", error);
        }
    };

    return (
        <Web3Context.Provider
            value={{
                account,
                setAccount,
                web3,
                networkId,
                CSTokenContract,
                InsuranceCompanyContract,
                MarketplaceContract,
                listedPolicies,
                myListedPolicies,
                boughtPolicies,
                createdPolicies,
                isTokenOwner,
                connectWallet,
                fetchIsTokenOwner,
                fetchListedPolicies,
                fetchMyListedPolicies,
                fetchBoughtPolicies,
                fetchCreatedPolicies,
            }}
        >
            {children}
        </Web3Context.Provider>
    );
};
