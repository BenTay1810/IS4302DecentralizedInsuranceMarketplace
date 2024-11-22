import React, { useState, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import colors from "../styles/colors";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Web3Context } from "../Web3Context";

function Token3({ formData }) {
    const { account, CSTokenContract, fetchIsTokenOwner } =
        useContext(Web3Context);
    const navigate = useNavigate();

    const [isModalVisible, setModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const validateForm = () => {
        const requiredFields = ["amount", "conversionRate"];

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
            if (!CSTokenContract) {
                throw new Error(
                    "CSTokenContract is not initialized. Check Web3Context setup."
                );
            }
            const amount = parseInt(formData.amount);
            const conversionRate = parseInt(formData.conversionRate);

            const requiredCollateral = amount * conversionRate;

            await CSTokenContract.methods
                .mint(parseInt(amount), parseInt(conversionRate))
                .send({ from: account, value: requiredCollateral });

            fetchIsTokenOwner(account);

            setModalVisible(true); // Show success modal
        } catch (error) {
            console.error(error);
            setErrorMessage(`Transaction failed: ${error.message}`);
        }
    };

    const handleCloseModal = () => {
        setModalVisible(false); // Hide modal
        navigate("/"); // Navigate to home screen
    };

    return (
        <div>
            <div
                className="container"
                style={{ width: "400px", padding: "30px" }}
            >
                {/* Progress Bar */}
                <div className="d-flex align-items-center mb-4">
                    <Link to="/token1">
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
                    <Link to="/token2">
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
                            <label>Amount</label>
                            <input
                                type="text"
                                className="form-control"
                                value={formData.amount}
                                readOnly
                                style={{ backgroundColor: colors.lightgrey }}
                            />
                        </div>
                        <div className="form-group text-start mb-3">
                            <label>Conversion Rate</label>
                            <input
                                type="text"
                                className="form-control"
                                value={formData.conversionRate}
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
                        Mint
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

export default Token3;
