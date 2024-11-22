import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import colors from "../styles/colors";
import { Link } from "react-router-dom";

function Token1({ formData, updateFormData }) {
    return (
        <div>
            <div
                className="container"
                style={{ width: "400px", padding: "30px" }}
            >
                {/* Progress Bar */}
                <div className="d-flex align-items-center mb-4">
                    <div
                        className="rounded-circle text-white d-flex align-items-center justify-content-center"
                        style={{
                            width: "40px",
                            height: "40px",
                            backgroundColor: colors.darkblue,
                        }}
                    >
                        1
                    </div>
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

            <h2 className="text-center mb-4">Let's verify your identity.</h2>

            <div
                className="container-fluid bg-light p-4"
                style={{ width: "85%", margin: "0 auto" }}
            >
                <form className="bg-light p-4 rounded">
                    <div className="form-group text-start mb-3">
                        <label
                            className="text-left"
                            style={{ textAlign: "left" }}
                        >
                            First Name
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            value={formData.firstName}
                            onChange={(e) =>
                                updateFormData("firstName", e.target.value)
                            }
                        />
                    </div>

                    <div className="form-group text-start mb-3">
                        <label
                            className="text-left"
                            style={{ textAlign: "left" }}
                        >
                            Last Name
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            value={formData.lastName}
                            onChange={(e) =>
                                updateFormData("lastName", e.target.value)
                            }
                        />
                    </div>

                    <div className="form-group text-start mb-3">
                        <label
                            className="text-left"
                            style={{ textAlign: "left" }}
                        >
                            Identification No.
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            value={formData.idNumber}
                            onChange={(e) =>
                                updateFormData("idNumber", e.target.value)
                            }
                        />
                    </div>

                    <div className="form-group text-start mb-3">
                        <label
                            className="text-left"
                            style={{ textAlign: "left" }}
                        >
                            Contact No.
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            value={formData.contactNumber}
                            onChange={(e) =>
                                updateFormData("contactNumber", e.target.value)
                            }
                        />
                    </div>

                    <div className="form-group text-start mb-3">
                        <label
                            className="text-left"
                            style={{ textAlign: "left" }}
                        >
                            Account No.
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            value={formData.accountNumber}
                            onChange={(e) =>
                                updateFormData("accountNumber", e.target.value)
                            }
                        />
                    </div>

                    <div className="form-group text-start mb-3">
                        <label
                            className="text-left"
                            style={{ textAlign: "left" }}
                        >
                            Email Address
                        </label>
                        <input
                            type="email"
                            className="form-control"
                            value={formData.email}
                            onChange={(e) =>
                                updateFormData("email", e.target.value)
                            }
                        />
                    </div>

                    {/* <div className="form-group mb-3">
            <label className="text-left" style={{ textAlign: 'left' }}>Upload Proof of Identification</label>
            <button className="btn btn-secondary btn-block">Upload</button>
          </div> */}

                    <div className="text-end">
                        <Link to="/token2">
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

export default Token1;
