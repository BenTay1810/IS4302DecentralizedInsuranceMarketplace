import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import colors from "../styles/colors";
import { Link } from "react-router-dom";

function Token2({ formData, updateFormData }) {
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
                    <Link to="/token3">
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

            <h2 className="text-center mb-4">How would you like to mint?</h2>

            <div
                className="container-fluid bg-light p-4"
                style={{ width: "85%", margin: "0 auto" }}
            >
                <form className="bg-light p-4 rounded">
                    <div className="form-group text-start mb-3">
                        <label>Collateral Amount (CSTokens)</label>
                        <input
                            type="number"
                            step="1"
                            className="form-control"
                            value={formData.amount}
                            onChange={(e) =>
                                updateFormData("amount", e.target.value)
                            }
                        />
                    </div>
                    <div className="form-group text-start mb-3">
                        <label>Conversion Rate</label>
                        <input
                            type="number"
                            step="1"
                            className="form-control"
                            value={formData.conversionRate}
                            onChange={(e) =>
                                updateFormData("conversionRate", e.target.value)
                            }
                        />
                    </div>

                    <div className="text-end">
                        <Link to="/token3">
                            {" "}
                            {/* Update the path as needed */}
                            <button
                                type="button"
                                className="btn btn-block"
                                style={{
                                    backgroundColor: colors.darkblue,
                                    color: "white",
                                }}
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

export default Token2;
