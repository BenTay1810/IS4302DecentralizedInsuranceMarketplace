import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import colors from '../styles/colors';
import { Link, useParams } from 'react-router-dom';

function Buy2({ policies, formData, setFormData }) {
    const [policy, setPolicy] = useState(null);
    const { policyName } = useParams();

    // Fetch the policy based on policyName
    useEffect(() => {
        const formattedPolicyName = policyName.replace(/-/g, ' '); // Replace dashes with spaces
        const selectedPolicy = policies.find(
            (p) => p.name.toLowerCase() === formattedPolicyName.toLowerCase()
        );
        setPolicy(selectedPolicy);
    }, [policyName, policies]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const calculateDuration = (start, end) => {
        if (start && end) {
            const startDateObj = new Date(start);
            const endDateObj = new Date(end);
            const diffInTime = endDateObj - startDateObj;
            const diffInDays = diffInTime / (1000 * 3600 * 24); // Convert milliseconds to days
            return diffInDays >= 0 ? `${diffInDays} days` : 'Invalid dates';
        }
        return '';
    };

    useEffect(() => {
        if (formData.startDate && formData.endDate) {
            const duration = calculateDuration(formData.startDate, formData.endDate);
            setFormData((prevData) => ({ ...prevData, duration }));
        }
    }, [formData.startDate, formData.endDate, setFormData]);

    if (!policy) {
        return <div>Loading...</div>;
    }

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
                    <div
                        className="rounded-circle text-white d-flex align-items-center justify-content-center"
                        style={{ width: '40px', height: '40px', backgroundColor: colors.darkblue }}
                    >
                        2
                    </div>
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

            <h2 className="text-center mb-4">What are you looking to buy?</h2>

            <div className="container-fluid bg-light p-4" style={{ width: '85%', margin: '0 auto' }}>
                <form className="bg-light p-4 rounded">
                    <div className="form-group text-start mb-3">
                        <label>Policy Name</label>
                        <input
                            type="text"
                            className="form-control"
                            value={policy.name}
                            readOnly
                            style={{ backgroundColor: colors.lightgrey }}
                        />
                    </div>

                    <div className="form-group text-start mb-3">
                        <label>Policy Type</label>
                        <input
                            type="text"
                            className="form-control"
                            value={policy.type}
                            readOnly
                            style={{ backgroundColor: colors.lightgrey }}
                        />
                    </div>

                    <div className="form-group text-start mb-3">
                        <label>Minimum Staking Amount (CS Tokens)</label>
                        <input
                            type="text"
                            className="form-control"
                            value={policy.minStakeAmount}
                            readOnly
                            style={{ backgroundColor: colors.lightgrey }}
                        />
                    </div>

                    <div className="form-group text-start mb-3">
                        <label>Staked Amount (CS Tokens)</label>
                        <input
                            type="number"
                            name="stakedAmount"
                            className="form-control"
                            value={formData.stakedAmount || ''}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group text-start mb-3">
                        <label>Staked Amount (Wei)</label>
                        <input
                            type="text"
                            className="form-control"
                            value={formData.stakedAmount || ''}
                            readOnly
                            style={{ backgroundColor: colors.lightgrey }}
                        />
                    </div>

                    <div className="form-group text-start mb-3">
                        <label>Claim Back Amount (CS Tokens)</label>
                        <input
                            type="text"
                            className="form-control"
                            value={
                                formData.stakedAmount
                                    ? formData.stakedAmount * parseFloat(policy.claimBackRate)
                                    : ''
                            }
                            readOnly
                            style={{ backgroundColor: colors.lightgrey }}
                        />
                    </div>

                    <div className="form-group text-start mb-3">
                        <label htmlFor="startDate" className="form-label">Start Date</label>
                        <input
                            type="date"
                            name="startDate"
                            id="startDate"
                            className="form-control"
                            value={formData.startDate || ''}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group text-start mb-3">
                        <label htmlFor="endDate" className="form-label">End Date</label>
                        <input
                            type="date"
                            name="endDate"
                            id="endDate"
                            className="form-control"
                            value={formData.endDate || ''}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group text-start mb-3">
                        <label>Duration of Claim</label>
                        <input
                            type="text"
                            className="form-control"
                            value={formData.duration || ''}
                            readOnly
                            style={{ backgroundColor: colors.lightgrey }}
                        />
                    </div>

                    <div className="text-end">
                        <Link to={`/policy/${policyName}/buy3`}>
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

export default Buy2;
