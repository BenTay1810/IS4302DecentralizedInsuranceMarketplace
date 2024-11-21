import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import colors from '../styles/colors';

function Claim1() {
    const [isModalVisible, setModalVisible] = useState(false);

    const handleListButtonClick = () => {
        setModalVisible(true); // Show modal when "List" is clicked
    };

    const handleCloseModal = () => {
        setModalVisible(false); // Hide modal
    };

    return (
        <div>
            <div className="container-fluid p-4" style={{ width: '85%', textAlign: 'left'}}>
                <label className="text-left" style={{fontSize: '1.5rem'}}>Claim #9846233</label>
            </div>
            
            <div className="container-fluid bg-light p-4" style={{ width: '85%', margin: '0 auto' }}>
                <form className="bg-light p-4 rounded">
                    <div className="form-group text-start mb-3">
                        <label>Policy Name</label>
                        <input type="text" className="form-control" value="Extreme Travel Policy" readOnly style={{backgroundColor: colors.lightgrey}} />
                    </div>
                    <div className="form-group text-start mb-3">
                        <label>Contract Address</label>
                        <input type="text" className="form-control" value="0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48" readOnly style={{backgroundColor: colors.lightgrey}} />
                    </div>
                    <div className="form-group text-start mb-3">
                        <label>Date of Purchase</label>
                        <input type="text" className="form-control" value="01/12/2024" readOnly style={{backgroundColor: colors.lightgrey}} />
                    </div>
                    <div className="form-group text-start mb-3">
                        <label>Staked Amount</label>
                        <input type="text" className="form-control" value="50" readOnly style={{backgroundColor: colors.lightgrey}} />
                    </div>
                    <div className="form-group text-start mb-3">
                        <label>Amount Claimable</label>
                        <input type="text" className="form-control" value="210" readOnly style={{backgroundColor: colors.lightgrey}} />
                    </div>
                    <div className="form-group text-start mb-3">
                        <label>Account No.</label>
                        <input type="text" className="form-control" value="0x9175Dzy34dF2ab" readOnly style={{backgroundColor: colors.lightgrey}} />
                    </div>

                    <div className="text-end mt-4"> 
                        <button
                            type="button"
                            className="btn btn-block"
                            style={{ backgroundColor: colors.darkblue, color: 'white' }}
                            onClick={handleListButtonClick}
                        >
                            Claim
                        </button>
                    </div>
                </form>
            </div>

            {/* Bootstrap Modal */}
            {isModalVisible && (
                <div className="modal show fade" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }} role="dialog">
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
            )}
        </div>
    );
}

export default Claim1;
