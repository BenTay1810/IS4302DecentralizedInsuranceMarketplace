import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import colors from '../styles/colors';
import { Link } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

function List3() {
    const [isModalVisible, setModalVisible] = useState(false);

    const handleListButtonClick = () => {
        setModalVisible(true); // Show modal when "List" is clicked
    };

    const handleCloseModal = () => {
        setModalVisible(false); // Hide modal
    };

    return (
        <div>
            <div className="container" style={{ width: '400px', padding: '30px' }}>
                {/* Progress Bar */}
                <div className="d-flex align-items-center mb-4">
                    <Link to="/list1">
                        <div
                            className="rounded-circle text-white d-flex align-items-center justify-content-center"
                            style={{ width: '40px', height: '40px', backgroundColor: colors.lightblue }}
                        >
                            1
                        </div>
                    </Link>
                    <div className="flex-grow-1" style={{ height: '2px', backgroundColor: 'grey' }}></div>
                    <Link to="/list2">
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
                            <input type="text" className="form-control" value="John" readOnly style={{backgroundColor: colors.lightgrey}} />
                        </div>
                        <div className="form-group text-start mb-3">
                            <label>Last Name</label>
                            <input type="text" className="form-control" value="Lee" readOnly style={{backgroundColor: colors.lightgrey}} />
                        </div>
                        <div className="form-group text-start mb-3">
                            <label>Identification No.</label>
                            <input type="text" className="form-control" value="S123456A" readOnly style={{backgroundColor: colors.lightgrey}} />
                        </div>
                        <div className="form-group text-start mb-3">
                            <label>Contact No.</label>
                            <input type="text" className="form-control" value="9876 5432" readOnly style={{backgroundColor: colors.lightgrey}} />
                        </div>
                        <div className="form-group text-start mb-3">
                            <label>Account No.</label>
                            <input type="text" className="form-control" value="0x9175D3y34dF2ab" readOnly style={{backgroundColor: colors.lightgrey}} />
                        </div>
                        <div className="form-group text-start mb-3">
                            <label>Email Address</label>
                            <input type="text" className="form-control" value="johnlee@gmail.com" readOnly style={{backgroundColor: colors.lightgrey}} />
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="col-md-6">
                        <div className="form-group text-start mb-3">
                            <label>Policy Name</label>
                            <input type="text" className="form-control" value="Extreme Travel Policy" readOnly style={{backgroundColor: colors.lightgrey}} />
                        </div>
                        <div className="form-group text-start mb-3">
                            <label>Policy Type</label>
                            <select className="form-control" disabled>
                                <option>Travel</option>
                            </select>
                        </div>
                        <div className="form-group text-start mb-3">
                            <label>Token Pool Amount</label>
                            <input type="text" className="form-control" value="10000" readOnly style={{backgroundColor: colors.lightgrey}} />
                        </div>
                        <div className="form-group text-start mb-3">
                            <label>Minimum Staking Amount</label>
                            <input type="text" className="form-control" value="50" readOnly style={{backgroundColor: colors.lightgrey}} />
                        </div>
                        <div className="form-group text-start mb-3">
                            <label>Staking Multiple</label>
                            <input type="text" className="form-control" value="5x" readOnly style={{backgroundColor: colors.lightgrey}} />
                        </div>
                        <div className="form-group text-start mb-0">
                            <label>Duration of Claim</label>
                        </div>
                        <div className="d-flex">
                            <input type="text" className="form-control mr-2" value="01/01/2025" readOnly style={{backgroundColor: colors.lightgrey}} />
                            <span className="mx-2 align-self-center">to</span>
                            <input type="text" className="form-control ml-2" value="31/12/2025" readOnly style={{backgroundColor: colors.lightgrey}} />
                        </div>
                    </div>
                </div>

                <div className="text-end mt-4"> 
                    <button
                        type="button"
                        className="btn btn-block"
                        style={{ backgroundColor: colors.darkblue, color: 'white' }}
                        onClick={handleListButtonClick}
                    >
                        List
                    </button>
                </div>
            </div>

            {/* Bootstrap Modal */}
            {isModalVisible && (
                <div className="modal show fade" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <div className="modal show d-flex align-items-center justify-content-center" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content p-4 text-center">
                            {/* Icon with margin-bottom */}
                            <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '4rem', marginBottom: '20px' }}></i>
                            
                            {/* Text */}
                            <h2>Successful Transaction!</h2>
                            
                            {/* Button */}
                            <button type="button" className="btn btn-primary mt-4" onClick={handleCloseModal}>Okay!</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default List3;
