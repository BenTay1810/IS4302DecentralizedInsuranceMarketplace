import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Web3Context } from "../Web3Context";

const Home = () => {
    const {
        listedPolicies,
        isTokenOwner,
        fetchIsTokenOwner,
        account,
        fetchListedPolicies,
    } = useContext(Web3Context);

    useEffect(() => {
        fetchIsTokenOwner(account);
        fetchListedPolicies();
    }, [fetchIsTokenOwner, fetchListedPolicies]);

    return (
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
                {!isTokenOwner ? (
                    <Link to="/token1" className="btn me-3 list-button">
                        Mint Now!
                    </Link>
                ) : (
                    <Link to="/list1" className="btn me-3 list-button">
                        List Now!
                    </Link>
                )}
                <input
                    type="text"
                    placeholder="What are you looking for?"
                    className="form-control w-25"
                />
            </header>

            <div className="row mt-4">
                {listedPolicies.length === 0 ? (
                    <div className="col-12 text-center mt-5">
                        <h4>No policies available at the moment.</h4>
                        <p className="text-muted">
                            {isTokenOwner ? (
                                <>
                                    Please check back later or{" "}
                                    <Link to="/list1">list a policy</Link>.
                                </>
                            ) : (
                                <>
                                    Please check back later or{" "}
                                    <Link to="/mint-token">mint a token</Link>.
                                </>
                            )}
                        </p>
                    </div>
                ) : (
                    listedPolicies.map((policy, index) => {
                        const minStakeFormatted = Number(policy.minStake);
                        const claimBackRateFormatted = Number(
                            policy.claimBackRate
                        );
                        const currPoolFormatted = Number(policy.currPoolValue);
                        const maxPoolFormatted = Number(policy.maxPoolValue);

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
                                                {maxPoolFormatted -
                                                    currPoolFormatted}
                                            </span>
                                        </div>
                                        <Link
                                            to={`/policy/${policy.policyName
                                                .toLowerCase()
                                                .replace(/\s+/g, "-")}`}
                                            className="btn buy-button"
                                        >
                                            Buy
                                        </Link>
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

export default Home;
