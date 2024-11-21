import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import "./App.css";
import Navbar from "./components/Navbar";
import List1 from "./components/List1";
import Home from "./components/Home";
import List2 from "./components/List2";
import List3 from "./components/List3";
import Account from "./components/Account";
import Claim1 from "./components/Claim1";

function App() {

    const policies = [
        {
            name: "Extreme Travel Policy",
            minStakeAmount: 50,
            claimBackRate: "5x",
            remainingPool: "5123 tokens / 10000 tokens",
        },
        {
            name: "Life Policy",
            minStakeAmount: 100,
            claimBackRate: "3x",
            remainingPool: "584 tokens / 20000 tokens",
        },
    ];

    return (
        <Router>
            <div className="App">
                <Navbar />

                <Routes>
                    <Route path="/" element={<Home policies={policies} />} />
                    <Route path="/list1" element={<List1 />} />
                    <Route path="/list2" element={<List2 />} />
                    <Route path="/list3" element={<List3 />} />
                    <Route
                        path="/myacc"
                        element={<Account policies={policies} />}
                    />
                    <Route path="/claim1" element={<Claim1 />} />
                    {/* Add more routes as needed */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
