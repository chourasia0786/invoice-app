import logo from './logo.svg';
import './App.css';

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TaxInvoice from './TaxInvoice'; // Adjust path if needed
import Invoice from './Invoice'; // Adjust path if needed
import './styles.css';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<TaxInvoice />} />
        <Route path="/invoice" element={<Invoice />} />
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </div>
  );
}

export default App;


