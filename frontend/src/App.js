import React, { useState, useEffect, useRef, createContext } from "react";
import Web3 from "web3";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Token1 from "./components/Token1";
import Token2 from "./components/Token2";
import Token3 from "./components/Token3";
import List1 from "./components/List1";
import List2 from "./components/List2";
import List3 from "./components/List3";
import Account from "./components/Account";
import Token from "./components/Token";
import Claim1 from "./components/Claim1";
import PolicyDetails from "./components/PolicyDetails";
import Buy1 from "./components/Buy1";
import Buy2 from "./components/Buy2";
import Buy3 from "./components/Buy3";
import { Web3Provider } from "./Web3Context";

function App() {
    // List Form Details
    const [listFormData, setListFormData] = useState({
        firstName: "",
        lastName: "",
        3: "",
        contactNumber: "",
        accountNumber: "",
        email: "",
        policyName: "",
        policyType: "",
        claimBackRate: "",
        maxPoolValue: "",
        minStake: "",
        coveragePeriod: "",
    });

    const updateListFormData = (field, value) => {
        setListFormData((prev) => ({ ...prev, [field]: value }));
    };

    // Mint Form Details2
    const [mintFormData, setMintFormData] = useState({
        firstName: "",
        lastName: "",
        3: "",
        contactNumber: "",
        accountNumber: "",
        email: "",
        amount: "",
        conversionRate: "",
    });

    const updateMintFormData = (field, value) => {
        setMintFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <Web3Provider>
            <Router>
                <div className="App">
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route
                            path="/token1"
                            element={
                                <Token1
                                    formData={mintFormData}
                                    updateFormData={updateMintFormData}
                                />
                            }
                        />
                        <Route
                            path="/token2"
                            element={
                                <Token2
                                    formData={mintFormData}
                                    updateFormData={updateMintFormData}
                                />
                            }
                        />
                        <Route
                            path="/token3"
                            element={<Token3 formData={mintFormData} />}
                        />
                        <Route
                            path="/list1"
                            element={
                                <List1
                                    formData={listFormData}
                                    updateFormData={updateListFormData}
                                />
                            }
                        />
                        <Route
                            path="/list2"
                            element={
                                <List2
                                    formData={listFormData}
                                    updateFormData={updateListFormData}
                                />
                            }
                        />
                        <Route
                            path="/list3"
                            element={<List3 formData={listFormData} />}
                        />
                        <Route path="/myacc" element={<Account />} />
                        <Route path="/mytok" element={<Token />} />
                        <Route path="/claim1" element={<Claim1 />} />
                        <Route
                            path="/policy/:policyName"
                            element={<PolicyDetails />}
                        />
                        <Route
                            path="/policy/:policyName/buy1"
                            element={
                                <Buy1
                                    formData={listFormData}
                                    updateFormData={updateListFormData}
                                />
                            }
                        />
                        <Route
                            path="/policy/:policyName/buy2"
                            element={
                                <Buy2
                                    formData={listFormData}
                                    updateFormData={updateListFormData}
                                />
                            }
                        />
                        <Route
                            path="/policy/:policyName/buy3"
                            element={<Buy3 formData={listFormData} />}
                        />
                    </Routes>
                </div>
            </Router>
        </Web3Provider>
    );
}

export default App;
