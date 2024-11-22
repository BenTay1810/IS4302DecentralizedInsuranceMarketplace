import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import colors from '../styles/colors';
import { Link, useParams, useNavigate } from 'react-router-dom';

function Buy3({ formData, policies }) {
    const { policyName } = useParams();
    const [isModalVisible, setModalVisible] = useState(false);
    const navigate = useNavigate(); // Initialize navigate

    const policy = policies?.find(
        (p) => p.name.toLowerCase() === policyName.replace(/-/g, ' ').toLowerCase()
    );

    if (!policy) {
        return (
            <div>
                <h2 className="text-center">Policy Not Found</h2>
                <p className="text-center">The policy you're looking for doesn't exist.</p>
                <Link to="/" className="btn btn-primary">
                    Go Back to Home
                </Link>
            </div>
        );
    }

    const defaultData = {
        firstName: "John",
        lastName: "Lee",
        identificationNo: "S123456A",
        contactNo: "9876 5432",
        accountNo: "0x9175D3y34dF2ab",
        email: "johnlee@gmail.com",
        stakedAmount: policy?.minStakeAmount || 50,
        claimBackAmount: formData.stakedAmount
            ? formData.stakedAmount * parseFloat(policy?.claimBackRate || 5)
            : policy?.minStakeAmount * parseFloat(policy?.claimBackRate || 5),
        startDate: "01/01/2025",
        endDate: "31/12/2025",
        duration: "1 year",
    };

    const finalData = { ...defaultData, ...formData };

    const handleConfirmClick = () => {
        setModalVisible(true); // Show the modal
    };

    const handleCloseModal = () => {
        setModalVisible(false); // Hide the modal
        navigate("/"); // Redirect to the homepage
    };

    return (
        <div>
            <div className="container" style={{ width: '400px', padding: '30px' }}>
                {/* Progress Bar */}
                <div className="d-flex align-items-center mb-4">
                    <Link to={`/policy/${policyName}/buy1`}>
                        <div
                            className="rounded-circle text-white d-flex align-items-center justify-content-center"
                            style={{ width: '40px', height: '40px', backgroundColor: colors.lightblue }}
                        >
                            1
                        </div>
                    </Link>
                    <div className="flex-grow-1" style={{ height: '2px', backgroundColor: 'grey' }}></div>
                    <Link to={`/policy/${policyName}/buy2`}>
                        <div
                            className="rounded-circle text-white d-flex align-items-center justify-content-center"
                            style={{ width: '40px', height: '40px', backgroundColor: colors.lightblue }}
                        >
                            2
                        </div>
                    </Link>
                    <div className="flex-grow-1" style={{ height: '2px', backgroundColor: 'grey' }}></div>
                    <div
                        className="rounded-circle text-white d-flex align-items-center justify-content-center"
                        style={{ width: '40px', height: '40px', backgroundColor: colors.darkblue }}
                    >
                        3
                    </div>
                </div>
            </div>

            <h2 className="text-center mb-4">Last step: Confirmation!</h2>

            <div className="container-fluid bg-light p-4" style={{ width: '85%', margin: '0 auto' }}>
                {/* Form Fields */}
                <div className="row">
                    {/* Left Column */}
                    <div className="col-md-6">
                        <div className="form-group text-start mb-3">
                            <label>First Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={finalData.firstName}
                                readOnly
                                style={{ backgroundColor: colors.lightgrey }}
                            />
                        </div>
                        <div className="form-group text-start mb-3">
                            <label>Last Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={finalData.lastName}
                                readOnly
                                style={{ backgroundColor: colors.lightgrey }}
                            />
                        </div>
                        <div className="form-group text-start mb-3">
                            <label>Identification No.</label>
                            <input
                                type="text"
                                className="form-control"
                                value={finalData.identificationNo}
                                readOnly
                                style={{ backgroundColor: colors.lightgrey }}
                            />
                        </div>
                        <div className="form-group text-start mb-3">
                            <label>Contact No.</label>
                            <input
                                type="text"
                                className="form-control"
                                value={finalData.contactNo}
                                readOnly
                                style={{ backgroundColor: colors.lightgrey }}
                            />
                        </div>
                        <div className="form-group text-start mb-3">
                            <label>Account No.</label>
                            <input
                                type="text"
                                className="form-control"
                                value={finalData.accountNo}
                                readOnly
                                style={{ backgroundColor: colors.lightgrey }}
                            />
                        </div>
                        <div className="form-group text-start mb-3">
                            <label>Email Address</label>
                            <input
                                type="text"
                                className="form-control"
                                value={finalData.email}
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
                                value={policy?.name || "N/A"}
                                readOnly
                                style={{ backgroundColor: colors.lightgrey }}
                            />
                        </div>
                        <div className="form-group text-start mb-3">
                            <label>Policy Type</label>
                            <input
                                type="text"
                                className="form-control"
                                value={policy?.type || "N/A"}
                                readOnly
                                style={{ backgroundColor: colors.lightgrey }}
                            />
                        </div>
                        <div className="form-group text-start mb-3">
                            <label>Staked Amount</label>
                            <input
                                type="text"
                                className="form-control"
                                value={finalData.stakedAmount}
                                readOnly
                                style={{ backgroundColor: colors.lightgrey }}
                            />
                        </div>
                        <div className="form-group text-start mb-3">
                            <label>Claim Back Amount</label>
                            <input
                                type="text"
                                className="form-control"
                                value={finalData.claimBackAmount}
                                readOnly
                                style={{ backgroundColor: colors.lightgrey }}
                            />
                        </div>
                        <div className="form-group text-start mb-3">
                            <label>Duration of Claim</label>
                            <div className="d-flex">
                                <input
                                    type="text"
                                    className="form-control mr-2"
                                    value={finalData.startDate}
                                    readOnly
                                    style={{ backgroundColor: colors.lightgrey }}
                                />
                                <span className="mx-2 align-self-center">to</span>
                                <input
                                    type="text"
                                    className="form-control ml-2"
                                    value={finalData.endDate}
                                    readOnly
                                    style={{ backgroundColor: colors.lightgrey }}
                                />
                            </div>
                        </div>
                        <div className="form-group text-start mb-3">
                            <label>Claim Duration</label>
                            <input
                                type="text"
                                className="form-control"
                                value={finalData.duration}
                                readOnly
                                style={{ backgroundColor: colors.lightgrey }}
                            />
                        </div>
                    </div>
                </div>

                <div className="text-end mt-4">
                    <button
                        type="button"
                        className="btn btn-block"
                        style={{ backgroundColor: colors.darkblue, color: 'white' }}
                        onClick={handleConfirmClick}
                    >
                        Confirm Purchase
                    </button>
                </div>
            </div>

            {/* Bootstrap Modal */}
            {isModalVisible && (
                <div className="modal show fade" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content p-4 text-center">
                            <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '4rem', marginBottom: '20px' }}></i>
                            <h2>Successful Transaction!</h2>
                            <button type="button" className="btn btn-primary mt-4" onClick={handleCloseModal}>
                                Okay!
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Buy3;
