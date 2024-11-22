import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Web3Context } from "../Web3Context";
import MarketplaceABI from "../abis/MarketplaceABI.json";

const Account = () => {
    const {
        myListedPolicies,
        boughtPolicies,
        createdPolicies,
        isTokenOwner,
        fetchIsTokenOwner,
        account,
        fetchMyListedPolicies,
        fetchBoughtPolicies,
        fetchCreatedPolicies,
        CSTokenContract,
        InsuranceCompanyContract,
        MarketplaceContract,
        networkId,
    } = useContext(Web3Context);

    useEffect(() => {
        if (account) {
            fetchIsTokenOwner(account);
            fetchMyListedPolicies();
            fetchCreatedPolicies();
            fetchBoughtPolicies();
        }
    }, [
        account,
        fetchIsTokenOwner,
        fetchMyListedPolicies,
        fetchCreatedPolicies,
        fetchBoughtPolicies,
    ]);

    const handleListPolicy = async (policyId, maxPoolValue) => {
        if (!CSTokenContract || !MarketplaceContract) {
            alert("Contracts are not loaded properly.");
            return;
        }

        try {
            await CSTokenContract.methods
                .approve(MarketplaceABI.networks[networkId].address, maxPoolValue)
                .send({ from: account });

            await MarketplaceContract.methods
                .listPolicy(policyId)
                .send({ from: account });
        } catch (error) {
            console.error(error);
            alert("Error listing policy: " + error.message);
        }
    };

    return (
        <div className="container">
            {/* Listed Policies Section */}
            <div className="row mt-4">
                <label
                    className="text-left mb-2"
                    style={{ textAlign: "left", fontSize: "1.5rem" }}
                >
                    Listed Policies
                </label>
                {myListedPolicies.length === 0 ? (
                    <div className="col-12 text-center">
                        <p>You have not listed a policy.</p>
                    </div>
                ) : (
                    myListedPolicies.map((policy, index) => {
                        const minStakeFormatted = Number(policy.minStake);
                        const claimBackRateFormatted = Number(
                            policy.claimBackRate
                        );
                        const remainingPool = Number(policy.maxPoolValue) - Number(policy.currPoolValue);


                        return (
                            <div key={index} className="col-md-4">
                                <div className="card mb-4 shadow-sm p-4">
                                    <div className="card-body">
                                        <h5 className="card-title mb-3">
                                            {policy.policyName}
                                        </h5>
                                        <div className="d-flex justify-content-between mb-2">
                                            <span>Minimum Stake Amount:</span>
                                            <span className="fw-bold">
                                                {minStakeFormatted} tokens
                                            </span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-2">
                                            <span>Claim Back Rate:</span>
                                            <span className="fw-bold">
                                                {claimBackRateFormatted}
                                            </span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-3">
                                            <span>Remaining Pool:</span>
                                            <span className="text-primary fw-bold">
                                                {remainingPool}
                                            </span>
                                        </div>
                                        <div className="d-flex justify-content-end">
                                            <button className="btn buy-button">
                                                Delist
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Created Policies Section */}
            <div className="row mt-4">
                <label
                    className="text-left mb-2"
                    style={{ textAlign: "left", fontSize: "1.5rem" }}
                >
                    Unlisted Policies
                </label>
                {createdPolicies.length === 0 ? (
                    <div className="col-12 text-center">
                        <p>No unlisted policies available.</p>
                    </div>
                ) : (
                    createdPolicies.map((policy, index) => {
                        const minStakeFormatted = Number(policy.minStake);
                        const claimBackRateFormatted = Number(
                            policy.claimBackRate
                        );
                        const remainingPool = Number(policy.maxPoolValue) - Number(policy.currPoolValue);


                        return (
                            <div key={index} className="col-md-4">
                                <div className="card mb-4 shadow-sm p-4">
                                    <div className="card-body">
                                        <h5 className="card-title mb-3">
                                            {policy.policyName}
                                        </h5>
                                        <div className="d-flex justify-content-between mb-2">
                                            <span>Minimum Stake Amount:</span>
                                            <span className="fw-bold">
                                                {minStakeFormatted} tokens
                                            </span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-2">
                                            <span>Claim Back Rate:</span>
                                            <span className="fw-bold">
                                                {claimBackRateFormatted}
                                            </span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-3">
                                            <span>Remaining Pool:</span>
                                            <span className="text-primary fw-bold">
                                                {remainingPool}
                                            </span>
                                        </div>
                                        <div className="d-flex justify-content-end">
                                            <button
                                                className="btn buy-button"
                                                onClick={() =>
                                                    handleListPolicy(
                                                        policy.policyId,
                                                        policy.maxPoolValue
                                                    )
                                                }
                                            >
                                                List
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Bought Policies Section */}
            <div className="row mt-4">
                <label
                    className="text-left mb-2"
                    style={{ textAlign: "left", fontSize: "1.5rem" }}
                >
                    Bought Policies
                </label>
                {boughtPolicies.length === 0 ? (
                    <div className="col-12 text-center">
                        <p>You have not bought a policy.</p>
                    </div>
                ) : (
                    boughtPolicies.map((policy, index) => {
                        const minStakeFormatted = Number(policy.minStake);
                        const claimBackRateFormatted = Number(
                            policy.claimBackRate
                        );
                        const remainingPool = Number(policy.maxPoolValue) - Number(policy.currPoolValue);


                        return (
                            <div key={index} className="col-md-4">
                                <div className="card mb-4 shadow-sm p-4">
                                    <div className="card-body">
                                        <h5 className="card-title mb-3">
                                            {policy.policyName}
                                        </h5>
                                        <div className="d-flex justify-content-between mb-2">
                                            <span>Minimum Stake Amount:</span>
                                            <span className="fw-bold">
                                                {minStakeFormatted} tokens
                                            </span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-2">
                                            <span>Claim Back Rate:</span>
                                            <span className="fw-bold">
                                                {claimBackRateFormatted}
                                            </span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-3">
                                            <span>Remaining Pool:</span>
                                            <span className="text-primary fw-bold">
                                                {remainingPool}
                                            </span>
                                        </div>
                                        <div className="d-flex justify-content-end">
                                            <Link
                                                to="/claim1"
                                                className="btn buy-button"
                                            >
                                                Claim
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default Account;
