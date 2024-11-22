import React, { useEffect, useState, useContext } from "react";
import { Web3Context } from "../Web3Context";

const TokenPage = () => {
    const { CSTokenContract, account, isTokenOwner } = useContext(Web3Context); // Access Web3Context

    const [tokenInfo, setTokenInfo] = useState({
        remainingCollateral: 0,
        conversionRate: 0,
        currentTokensRemaining: 0,
    });

    const [loading, setLoading] = useState(true);

    // Fetch the token information when the component mounts or when account or CSTokenContract changes
    useEffect(() => {
        const fetchTokenInformation = async () => {
            if (!CSTokenContract || !account) {
                console.error("Missing CSTokenContract or account");
                return;
            }

            try {
                console.log(
                    "Calling viewMyTokenInformation for account:",
                    account
                );
                const response = await CSTokenContract.methods
                    .viewMyTokenInformation()
                    .call({ from: account });

                console.log("Token Information Response:", response);

                setTokenInfo({
                    remainingCollateral: Number(response[0]),
                    conversionRate: Number(response[1]),
                    currentTokensRemaining: Number(response[2]),
                });
                setLoading(false);
            } catch (error) {
                console.error("Error fetching token information:", error);
                setLoading(false);
            }
        };

        fetchTokenInformation();
    }, [CSTokenContract, account]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container">
            <h2 className="text-center mt-5">Your Token Information</h2>
            <div className="mt-4">
                {isTokenOwner ? (
                    <>
                        <h4>
                            Remaining Collateral:{" "}
                            {tokenInfo.remainingCollateral} CSTokens
                        </h4>
                        <h4>Conversion Rate: {tokenInfo.conversionRate}</h4>
                        <h4>
                            Tokens Remaining: {tokenInfo.currentTokensRemaining}
                        </h4>
                    </>
                ) : (
                    <div className="text-center mt-5">
                        <h4>No token information available.</h4>
                        <p className="text-muted">
                            Please <a href="/mint">mint a token</a>.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TokenPage;
