import React, { useState } from "react";
import "./styles.css";
import html2canvas from "html2canvas";

const TaxInvoice = () => {
  const [items, setItems] = useState([
    { description: "", quantity: 0, rate: 0, amount: 0, hsnSac: "" },
    { description: "", quantity: 0, rate: 0, amount: 0, hsnSac: "" },
    { description: "", quantity: 0, rate: 0, amount: 0, hsnSac: "" },
    { description: "", quantity: 0, rate: 0, amount: 0, hsnSac: "" },
  ]);

  // Added state for invoice details
  const [invoiceDetails, setInvoiceDetails] = useState({
    invoiceNo: "",
    invoiceDate: "",
    buyerName: "",
    buyerGSTIN: "",
    buyerAddress: "",
  });

  const [phoneNumber, setPhoneNumber] = useState("");
  const [isPhoneNumberEntered, setIsPhoneNumberEntered] = useState(false);

  const handleInputChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;

    if (field === "quantity" || field === "rate") {
      updatedItems[index].amount = updatedItems[index].quantity * updatedItems[index].rate;
    }

    setItems(updatedItems);
  };

  const handleInvoiceDetailsChange = (field, value) => {
    const updatedDetails = { ...invoiceDetails };
    updatedDetails[field] = value;
    setInvoiceDetails(updatedDetails);
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

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleSendMessage = () => {
    if (phoneNumber) {
      // Hide the elements before capturing the screenshot
      const whatsappSection = document.querySelector('.whatsapp-section');
      const actionButtons = document.querySelector('.action-buttons');
      if (whatsappSection) whatsappSection.style.display = 'none';
      if (actionButtons) actionButtons.style.display = 'none';
  
      // Capture the screenshot of the invoice section
      html2canvas(document.querySelector(".invoice-box"), {
        backgroundColor: "#ffffff", // Set background color
        scale: 2, // Increase scale for better resolution
        useCORS: true, // Allow cross-origin image loading
      }).then((canvas) => {
        // Convert the canvas to an image (data URL)
        const imageUrl = canvas.toDataURL("image/png");
  
        // Create a temporary link element to trigger the download
        const link = document.createElement("a");
        link.href = imageUrl;
        link.download = "invoice.png"; // Name the downloaded file
        link.click(); // Trigger the download
  
        // Show the hidden elements again
        if (whatsappSection) whatsappSection.style.display = 'block';
        if (actionButtons) actionButtons.style.display = 'block';
  
        // Now send the message via WhatsApp
        const whatsappMessage = `🧾 *Tax Invoice*\n\nPlease find the invoice attached below.`;
  
        // Open WhatsApp with the message and the phone number
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(whatsappUrl, "_blank");
      });
    } else {
      alert("Please enter a valid phone number.");
    }
  };
  
  
  

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
            <td><span className="info-title">Invoice No:</span> 
              <input 
                type="text" 
                value={invoiceDetails.invoiceNo} 
                onChange={(e) => handleInvoiceDetailsChange('invoiceNo', e.target.value)} 
              />
            </td>
            <td><span className="info-title">Invoice Date:</span> 
              <input 
                type="date" 
                value={invoiceDetails.invoiceDate} 
                onChange={(e) => handleInvoiceDetailsChange('invoiceDate', e.target.value)} 
              />
            </td>
          </tr>
          <tr>
            <td><span className="info-title">Buyer Name:</span> 
              <input 
                type="text" 
                value={invoiceDetails.buyerName} 
                onChange={(e) => handleInvoiceDetailsChange('buyerName', e.target.value)} 
              />
            </td>
            <td><span className="info-title">GSTIN:</span> 
              <input 
                type="text" 
                value={invoiceDetails.buyerGSTIN} 
                onChange={(e) => handleInvoiceDetailsChange('buyerGSTIN', e.target.value)} 
              />
            </td>
          </tr>
          <tr>
            <td colSpan="2"><span className="info-title">Buyer Address:</span> 
              <input 
                type="text" 
                value={invoiceDetails.buyerAddress} 
                onChange={(e) => handleInvoiceDetailsChange('buyerAddress', e.target.value)} 
              />
            </td>
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
              <td>
                <input
                  type="text"
                  value={item.hsnSac}
                  onChange={(e) => handleInputChange(index, "hsnSac", e.target.value)}
                />
              </td>
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

      {/* WhatsApp Phone Number Input */}
      {!isPhoneNumberEntered && (
        <div className="whatsapp-section">
          <label htmlFor="phone-number">Enter Phone Number (with country code):</label>
          <input
            type="text"
            id="phone-number"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            placeholder="e.g., 919819287163"
          />
          <button onClick={() => setIsPhoneNumberEntered(true)}>Enter</button>
        </div>
      )}

      {isPhoneNumberEntered && (
        <div className="action-buttons">
          <button className="whatsapp-button" onClick={handleSendMessage}>
            📤 Share via WhatsApp
          </button>

          <button className="print-button" onClick={() => window.print()}>
            🖨️ Print Invoice
          </button>
        </div>
      )}
    </div>
  );
};

export default TaxInvoice;
