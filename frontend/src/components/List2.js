import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import colors from '../styles/colors';
import { Link } from 'react-router-dom';

function List2() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleStartDateChange = (event) => {
        setStartDate(event.target.value);
    };

    const handleEndDateChange = (event) => {
        setEndDate(event.target.value);
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
                    <div
                        className="rounded-circle text-white d-flex align-items-center justify-content-center"
                        style={{ width: '40px', height: '40px', backgroundColor: colors.darkblue }}
                    >
                        2
                    </div>
                    <div className="flex-grow-1" style={{ height: '2px', backgroundColor: 'grey' }}></div>
                    <Link to="/list3">
                        <div
                            className="rounded-circle text-white d-flex align-items-center justify-content-center"
                            style={{ width: '40px', height: '40px', backgroundColor: colors.lightblue }}
                        >
                            3
                        </div>
                    </Link>
                </div>
            </div>

            <h2 className="text-center mb-4">What are you looking to list?</h2>

            <div className="container-fluid bg-light p-4" style={{ width: '85%', margin: '0 auto' }}>
                <form className="bg-light p-4 rounded">
                    <div className="form-group text-start mb-3">
                        <label>Policy Name</label>
                        <input type="text" className="form-control" />
                    </div>

                    <div className="form-group text-start mb-3">
                        <label htmlFor="policyType" className="form-label text-left">Policy Type</label>
                        <select id="policyType" className="form-select">
                            <option value="" disabled selected>Select</option>
                            <option value="travel">Travel</option>
                            <option value="life">Life</option>
                            <option value="property">Property</option>
                        </select>
                    </div>

                    <div className="form-group text-start mb-3">
                        <label>Token Pool Amount</label>
                        <input type="text" className="form-control"/>
                    </div>

                    <div className="form-group text-start mb-3">
                        <label>Minimum Staking Amount</label>  
                        <input type="text" className="form-control" />
                    </div>

                    <div className="form-group text-start mb-3">
                        <label>Claim Back Rate</label>
                        <select id="claimBackRate" className="form-select">
                            <option value="" disabled selected>Select</option>
                            <option value="2x">2x</option>
                            <option value="3x">3x</option>
                            <option value="4x">4x</option>
                            <option value='5x'>5x</option>
                        </select>
                        {/* <input type="text" className="form-control" placeholder="Claim Back Rate" /> */}
                    </div>

                    <div className="form-group text-start mb-3">
                        <label htmlFor="startDate" className="form-label">Start Date</label>
                        <input
                            type="date"
                            id="startDate"
                            className="form-control"
                            value={startDate}
                            onChange={handleStartDateChange}
                        />
                    </div>

                    <div className="form-group text-start mb-3">
                        <label htmlFor="endDate" className="form-label">End Date</label>
                        <input
                            type="date"
                            id="endDate"
                            className="form-control"
                            value={endDate}
                            onChange={handleEndDateChange}
                        />
                    </div>

                    <div className="text-end">
                        <Link to="/list3"> {/* Update the path as needed */}
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

export default List2;
