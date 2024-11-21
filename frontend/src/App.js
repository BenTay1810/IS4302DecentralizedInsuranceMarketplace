import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import List1 from './components/List1';
import Home from './components/Home';
import List2 from './components/List2';
import List3 from './components/List3';
import Account from './components/Account';
import Claim1 from './components/Claim1';
import PolicyDetails from './components/PolicyDetails';
import Buy1 from './components/Buy1';
import Buy2 from './components/Buy2';
import Buy3 from './components/Buy3';

function App() {
  const policies = [
    {
      name: 'Extreme Travel Policy',
      type: 'Travel',
      minStakeAmount: 50,
      claimBackRate: '5x',
      remainingPool: '5123 tokens / 10000 tokens',
    },
    {
      name: 'Life Policy',
      type: 'Life',
      minStakeAmount: 100,
      claimBackRate: '3x',
      remainingPool: '584 tokens / 20000 tokens',
    },
  ];

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    idNumber: '',
    contactNumber: '',
    accountNumber: '',
    email: '',
    stakedAmount: '',
    startDate: '',
    endDate: '',
    duration: '',
  });

  return (
    <Router>
      <div className="App">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home policies={policies} />} />
          <Route path="/list1" element={<List1 />} />
          <Route path="/list2" element={<List2 />} />
          <Route path="/list3" element={<List3 />} />
          <Route path="/myacc" element={<Account policies={policies} />} />
          <Route path="/claim1" element={<Claim1 />} />
          <Route path="/policy/:policyName" element={<PolicyDetails policies={policies} />} />
          <Route path="/policy/:policyName/buy1" element={<Buy1 formData={formData} setFormData={setFormData} />} />
          <Route path="/policy/:policyName/buy2" element={<Buy2 policies={policies} formData={formData} setFormData={setFormData} />} />
          <Route path="/policy/:policyName/buy3" element={<Buy3 formData={formData} policies={policies} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
