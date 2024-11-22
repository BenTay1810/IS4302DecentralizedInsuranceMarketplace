import React, { useState, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import colors from "../styles/colors";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Web3Context } from "../Web3Context";

function List3({ formData }) {
    const {
        account,
        InsuranceCompanyContract,
        MarketplaceContract,
        fetchListedPolicies,
    } = useContext(Web3Context);
    const navigate = useNavigate();

    const [isModalVisible, setModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const getCoveragePeriodString = (coveragePeriod) => {
        switch (coveragePeriod) {
            case "90":
                return "3 months";
            case "180":
                return "6 months";
            case "270":
                return "9 months";
            case "365":
                return "1 year";
            case "730":
                return "2 years";
            default:
                return "";
        }
    };

    const validateForm = () => {
        const requiredFields = [
            "policyName",
            "policyType",
            "claimBackRate",
            "maxPoolValue",
            "minStake",
            "coveragePeriod",
        ];

        for (const field of requiredFields) {
            if (!formData[field]) {
                setErrorMessage(`Missing required field: ${field}`);
                return false;
            }
        }
        setErrorMessage(""); // Clear error message
        return true;
    };

    const handleListButtonClick = async () => {
        if (!validateForm()) return;

        try {
            await InsuranceCompanyContract.methods
                .createNewPolicy(
                    formData.policyName,
                    formData.policyType,
                    parseInt(formData.claimBackRate),
                    parseInt(formData.maxPoolValue),
                    parseInt(formData.minStake),
                    parseInt(formData.coveragePeriod)
                )
                .send({ from: account });

            // const policyId =
            //     result.events.PolicyCreated.returnValues.policyCount;

            // console.log(policyId);

            // await MarketplaceContract.methods
            //     .listPolicy(policyId) // Assuming the marketplace contract has a listPolicy method
            //     .send({ from: account });

            fetchListedPolicies();
            setModalVisible(true); // Show success modal
        } catch (error) {
            setErrorMessage(`Transaction failed: ${error.message}`);
        }
    };

    const handleCloseModal = () => {
        setModalVisible(false); // Hide modal
        navigate("/");
    };

    return (
        <div>
            <div
                className="container"
                style={{ width: "400px", padding: "30px" }}
            >
                {/* Progress Bar */}
                <div className="d-flex align-items-center mb-4">
                    <Link to="/list1">
                        <div
                            className="rounded-circle text-white d-flex align-items-center justify-content-center"
                            style={{
                                width: "40px",
                                height: "40px",
                                backgroundColor: colors.lightblue,
                            }}
                        >
                            1
                        </div>
                    </Link>
                    <div
                        className="flex-grow-1"
                        style={{ height: "2px", backgroundColor: "grey" }}
                    ></div>
                    <Link to="/list2">
                        <div
                            className="rounded-circle text-white d-flex align-items-center justify-content-center"
                            style={{
                                width: "40px",
                                height: "40px",
                                backgroundColor: colors.lightblue,
                            }}
                        >
                            2
                        </div>
                    </Link>
                    <div
                        className="flex-grow-1"
                        style={{ height: "2px", backgroundColor: "grey" }}
                    ></div>
                    <div
                        className="rounded-circle text-white d-flex align-items-center justify-content-center"
                        style={{
                            width: "40px",
                            height: "40px",
                            backgroundColor: colors.darkblue,
                        }}
                    >
                        3
                    </div>
                </div>
            </div>

            <h2 className="text-center mb-4">Last step: Confirmation!</h2>

            <div
                className="container-fluid bg-light p-4"
                style={{ width: "85%", margin: "0 auto" }}
            >
                {/* Form Fields */}
                <div className="row">
                    {/* Left Column */}
                    <div className="col-md-6">
                        <div className="form-group text-start mb-3">
                            <label>First Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={formData.firstName}
                                readOnly
                                style={{ backgroundColor: colors.lightgrey }}
                            />
                        </div>
                        <div className="form-group text-start mb-3">
                            <label>Last Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={formData.lastName}
                                readOnly
                                style={{ backgroundColor: colors.lightgrey }}
                            />
                        </div>
                        <div className="form-group text-start mb-3">
                            <label>Identification No.</label>
                            <input
                                type="text"
                                className="form-control"
                                value={formData.idNumber}
                                readOnly
                                style={{ backgroundColor: colors.lightgrey }}
                            />
                        </div>
                        <div className="form-group text-start mb-3">
                            <label>Contact No.</label>
                            <input
                                type="text"
                                className="form-control"
                                value={formData.contactNumber}
                                readOnly
                                style={{ backgroundColor: colors.lightgrey }}
                            />
                        </div>
                        <div className="form-group text-start mb-3">
                            <label>Account No.</label>
                            <input
                                type="text"
                                className="form-control"
                                value={formData.accountNumber}
                                readOnly
                                style={{ backgroundColor: colors.lightgrey }}
                            />
                        </div>
                        <div className="form-group text-start mb-3">
                            <label>Email Address</label>
                            <input
                                type="text"
                                className="form-control"
                                value={formData.email}
                                readOnly
                                style={{ backgroundColor: colors.lightgrey }}
                            />
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="col-md-6">
                        <div className="form-group text-start mb-3">
                            <label>Policy Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={formData.policyName}
                                readOnly
                                style={{ backgroundColor: colors.lightgrey }}
                            />
                        </div>
                        <div className="form-group text-start mb-3">
                            <label>Policy Type</label>
                            <input
                                type="text"
                                className="form-control"
                                value={formData.policyType}
                                readOnly
                                style={{ backgroundColor: colors.lightgrey }}
                            />
                        </div>
                        <div className="form-group text-start mb-3">
                            <label>Max Token Pool Amount</label>
                            <input
                                type="text"
                                className="form-control"
                                value={formData.maxPoolValue}
                                readOnly
                                style={{ backgroundColor: colors.lightgrey }}
                            />
                        </div>
                        <div className="form-group text-start mb-3">
                            <label>Minimum Stake</label>
                            <input
                                type="text"
                                className="form-control"
                                value={formData.minStake}
                                readOnly
                                style={{ backgroundColor: colors.lightgrey }}
                            />
                        </div>
                        <div className="form-group text-start mb-3">
                            <label>Claim Back Rate</label>
                            <input
                                type="text"
                                className="form-control"
                                value={`${formData.claimBackRate}x`}
                                readOnly
                                style={{ backgroundColor: colors.lightgrey }}
                            />
                        </div>
                        <div className="form-group text-start mb-3">
                            <label>Coverage Period</label>
                            <input
                                type="text"
                                className="form-control"
                                value={getCoveragePeriodString(
                                    formData.coveragePeriod
                                )}
                                readOnly
                                style={{ backgroundColor: colors.lightgrey }}
                            />
                        </div>
                    </div>
                </div>

                {errorMessage && (
                    <div className="alert alert-danger">{errorMessage}</div>
                )}

                <div className="text-end mt-4">
                    <button
                        type="button"
                        className="btn btn-block"
                        style={{
                            backgroundColor: colors.darkblue,
                            color: "white",
                        }}
                        onClick={handleListButtonClick}
                    >
                        List
                    </button>
                </div>
            </div>

            {/* Bootstrap Modal */}
            {isModalVisible && (
                <div
                    className="modal show fade"
                    style={{
                        display: "block",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                    }}
                >
                    <div
                        className="modal show d-flex align-items-center justify-content-center"
                        tabIndex="-1"
                        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                    >
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content p-4 text-center">
                                {/* Icon with margin-bottom */}
                                <i
                                    className="bi bi-check-circle-fill text-success"
                                    style={{
                                        fontSize: "4rem",
                                        marginBottom: "20px",
                                    }}
                                ></i>

                                {/* Text */}
                                <h2>Successful Transaction!</h2>

                                {/* Button */}
                                <button
                                    type="button"
                                    className="btn btn-primary mt-4"
                                    onClick={handleCloseModal}
                                >
                                    Okay!
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default List3;
