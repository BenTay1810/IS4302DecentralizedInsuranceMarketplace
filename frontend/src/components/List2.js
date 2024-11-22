import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import colors from "../styles/colors";
import { Link } from "react-router-dom";

function List2({ formData, updateFormData }) {
    const [isValid, setIsValid] = useState(true);

    useEffect(() => {
        const maxPoolValue = parseInt(formData.maxPoolValue);
        const minStake = parseInt(formData.minStake);
        setIsValid(maxPoolValue >= minStake);
    }, [formData.maxPoolValue, formData.minStake]);

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
                    <div
                        className="rounded-circle text-white d-flex align-items-center justify-content-center"
                        style={{
                            width: "40px",
                            height: "40px",
                            backgroundColor: colors.darkblue,
                        }}
                    >
                        2
                    </div>
                    <div
                        className="flex-grow-1"
                        style={{ height: "2px", backgroundColor: "grey" }}
                    ></div>
                    <Link to="/list3">
                        <div
                            className="rounded-circle text-white d-flex align-items-center justify-content-center"
                            style={{
                                width: "40px",
                                height: "40px",
                                backgroundColor: colors.lightblue,
                            }}
                        >
                            3
                        </div>
                    </Link>
                </div>
            </div>

            <h2 className="text-center mb-4">What are you looking to list?</h2>

            <div
                className="container-fluid bg-light p-4"
                style={{ width: "85%", margin: "0 auto" }}
            >
                <form className="bg-light p-4 rounded">
                    <div className="form-group text-start mb-3">
                        <label>Policy Name</label>
                        <input
                            type="text"
                            className="form-control"
                            value={formData.policyName}
                            onChange={(e) =>
                                updateFormData("policyName", e.target.value)
                            }
                        />
                    </div>

                    <div className="form-group text-start mb-3">
                        <label
                            htmlFor="policyType"
                            className="form-label text-left"
                        >
                            Policy Type
                        </label>
                        <select
                            id="policyType"
                            className="form-select"
                            value={formData.policyType}
                            onChange={(e) =>
                                updateFormData("policyType", e.target.value)
                            }
                        >
                            <option value="" disabled>
                                Select
                            </option>
                            <option value="Travel">Travel</option>
                            <option value="Life">Life</option>
                            <option value="Property">Property</option>
                        </select>
                    </div>

                    <div className="form-group text-start mb-3">
                        <label>Max Token Pool Amount</label>
                        <input
                            type="number"
                            step="1"
                            className="form-control"
                            value={formData.maxPoolValue}
                            onChange={(e) => {
                                // Ensure the value is positive
                                const value = Math.max(0, e.target.value); // Prevent negative values
                                updateFormData("maxPoolValue", value);
                            }}
                        />
                    </div>

                    <div className="form-group text-start mb-3">
                        <label>Minimum Stake</label>
                        <input
                            type="number"
                            step="1"
                            className="form-control"
                            value={formData.minStake}
                            onChange={(e) =>
                                updateFormData("minStake", e.target.value)
                            }
                        />
                    </div>

                    <div className="form-group text-start mb-3">
                        <label>Claim Back Rate</label>
                        <input
                            type="number"
                            step="1"
                            className="form-control"
                            value={formData.claimBackRate}
                            onChange={(e) => {
                                // Ensure the value is positive
                                const value = Math.max(0, e.target.value); // Prevent negative values
                                updateFormData("claimBackRate", value);
                            }}
                        />
                    </div>
                    <div className="form-group text-start mb-3">
                        <label>Coverage Period</label>
                        <select
                            id="claimBackRate"
                            className="form-select"
                            value={formData.coveragePeriod}
                            onChange={(e) =>
                                updateFormData("coveragePeriod", e.target.value)
                            }
                        >
                            <option value="" disabled>
                                Select
                            </option>
                            <option value="90">3 months</option>
                            <option value="180">6 months</option>
                            <option value="270">9 months</option>
                            <option value="365">1 year</option>
                            <option value="730">2 years</option>
                        </select>
                        {/* <input type="text" className="form-control" placeholder="Claim Back Rate" /> */}
                    </div>

                    <div className="text-end">
                        <Link to="/list3">
                            {" "}
                            {/* Update the path as needed */}
                            <button
                                type="button"
                                className="btn btn-block"
                                style={{
                                    backgroundColor: colors.darkblue,
                                    color: "white",
                                }}
                                disabled={!isValid}
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
