import React, { useState } from "react";
import "./styles.css";

const TaxInvoice = () => {
  const [items, setItems] = useState([
    { description: "", quantity: 0, rate: 0, amount: 0 },
    { description: "", quantity: 0, rate: 0, amount: 0 },
    { description: "", quantity: 0, rate: 0, amount: 0 },
    { description: "", quantity: 0, rate: 0, amount: 0 },
  ]);

  const handleInputChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;

    if (field === "quantity" || field === "rate") {
      updatedItems[index].amount = updatedItems[index].quantity * updatedItems[index].rate;
    }

    setItems(updatedItems);
  };

  const calculateSubtotal = () => {
    return items.reduce((total, item) => total + item.amount, 0);
  };

  const calculateTax = (subtotal) => {
    const cgst = (subtotal * 9) / 100;
    const sgst = (subtotal * 9) / 100;
    const igst = (subtotal * 18) / 100;
    return { cgst, sgst, igst };
  };

  const subtotal = calculateSubtotal();
  const { cgst, sgst, igst } = calculateTax(subtotal);
  const totalAmount = subtotal + cgst + sgst + igst;

  return (
    <div className="invoice-box">
      <div className="highlight-block">
        <h2 className="main-header">🧾 Tax Invoice</h2>
        <h4><strong>SHREE GOPAL ACCESSORIES</strong></h4>
        <p><strong>Mobile Accessories</strong></p>
        <p><span className="info-title">GSTIN:</span> 27AICPC5515G1ZO</p>
        <p>
          1st Floor, Shop No. 144/145, Orchid City Centre Mall,<br />
          Bellasis Road, Opp. S.T. Depot, Tardeo,<br />
          Mumbai Central, Mumbai City, Maharashtra – 400008
        </p>
      </div>

      <table className="info-table">
        <tbody>
          <tr>
            <td><span className="info-title">Invoice No.:</span> ____________</td>
            <td><span className="info-title">Invoice Date:</span> ____ / ____ / ______</td>
          </tr>
          <tr>
            <td><span className="info-title">Buyer Name:</span> __________________</td>
            <td><span className="info-title">GSTIN:</span> ______________________</td>
          </tr>
          <tr>
            <td colSpan="2"><span className="info-title">Buyer Address:</span> _____________________________________________</td>
          </tr>
        </tbody>
      </table>

      <table className="billing-table">
        <thead>
          <tr>
            <th>Sr. No.</th>
            <th>Description of Goods</th>
            <th>HSN/SAC</th>
            <th>Qty</th>
            <th>Rate (₹)</th>
            <th>Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => handleInputChange(index, "description", e.target.value)}
                />
              </td>
              <td></td>
              <td>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleInputChange(index, "quantity", parseFloat(e.target.value))}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={item.rate}
                  onChange={(e) => handleInputChange(index, "rate", parseFloat(e.target.value))}
                />
              </td>
              <td className="right">{item.amount.toFixed(2)}</td>
            </tr>
          ))}
          <tr>
            <td colSpan="5" className="right bold">Subtotal</td>
            <td className="right">{subtotal.toFixed(2)}</td>
          </tr>
          <tr>
            <td colSpan="5" className="right">CGST 9%</td>
            <td className="right">{cgst.toFixed(2)}</td>
          </tr>
          <tr>
            <td colSpan="5" className="right">SGST 9%</td>
            <td className="right">{sgst.toFixed(2)}</td>
          </tr>
          <tr>
            <td colSpan="5" className="right">IGST 18%</td>
            <td className="right">{igst.toFixed(2)}</td>
          </tr>
          <tr>
            <td colSpan="5" className="right bold">Total Amount</td>
            <td className="right bold">{totalAmount.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      <div className="bank-details">
        <div className="section-title">🏦 Bank Details</div>
        <p><strong>Bank Name:</strong> HDFC</p>
        <p><strong>A/C No.:</strong> 50200077371004</p>
        <p><strong>IFSC Code:</strong> HDFC0000626</p>
        <p><strong>Branch:</strong> Null Bazar</p>
      </div>

      <div className="declaration">
        <div className="section-title">📌 Declaration</div>
        <p>We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.</p>
      </div>

      <div className="authorized">
        Authorized Signatory<br />
        (For SHREE GOPAL ACCESSORIES)
      </div>
    </div>
  );
};

export default TaxInvoice;
