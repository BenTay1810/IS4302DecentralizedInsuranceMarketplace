import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import colors from '../styles/colors';
import { Link, useParams } from 'react-router-dom';

function Buy1({ formData, setFormData }) {
    const { policyName } = useParams();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value || prevData[name],
        }));
    };

    return (
        <div>
            <div className="container" style={{ width: '400px', padding: '30px' }}>
                {/* Progress Bar */}
                <div className="d-flex align-items-center mb-4">
                    <div
                        className="rounded-circle text-white d-flex align-items-center justify-content-center"
                        style={{ width: '40px', height: '40px', backgroundColor: colors.darkblue }}
                    >
                        1
                    </div>
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
                    <Link to={`/policy/${policyName}/buy3`}>
                        <div
                            className="rounded-circle text-white d-flex align-items-center justify-content-center"
                            style={{ width: '40px', height: '40px', backgroundColor: colors.lightblue }}
                        >
                            3
                        </div>
                    </Link>
                </div>
            </div>

            <h2 className="text-center mb-4">Let's verify your identity.</h2>

            <div className="container-fluid bg-light p-4" style={{ width: '85%', margin: '0 auto' }}>
                <form className="bg-light p-4 rounded">
                    <div className="form-group text-start mb-3">
                        <label>First Name</label>
                        <input
                            type="text"
                            className="form-control"
                            name="firstName"
                            defaultValue={formData.firstName || 'John'}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group text-start mb-3">
                        <label>Last Name</label>
                        <input
                            type="text"
                            className="form-control"
                            name="lastName"
                            defaultValue={formData.lastName || 'Doe'}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group text-start mb-3">
                        <label>Identification No.</label>
                        <input
                            type="text"
                            className="form-control"
                            name="idNumber"
                            defaultValue={formData.idNumber || 'S1234567A'}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group text-start mb-3">
                        <label>Contact No.</label>
                        <input
                            type="text"
                            className="form-control"
                            name="contactNumber"
                            defaultValue={formData.contactNumber || '98765432'}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group text-start mb-3">
                        <label>Account No.</label>
                        <input
                            type="text"
                            className="form-control"
                            name="accountNumber"
                            defaultValue={formData.accountNumber || '0x9175D3y34dF2ab'}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group text-start mb-3">
                        <label>Email Address</label>
                        <input
                            type="email"
                            className="form-control"
                            name="email"
                            defaultValue={formData.email || 'john.doe@example.com'}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="text-end">
                        <Link to={`/policy/${policyName}/buy2`}>
                            <button
                                type="button"
                                className="btn btn-block"
                                style={{ backgroundColor: colors.darkblue, color: 'white' }}
                            >
                                Next
                            </button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Buy1;
