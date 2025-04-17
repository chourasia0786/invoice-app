import React, { useState } from "react";
import html2canvas from "html2canvas";

const Invoice = () => {
  const [items, setItems] = useState([
    { description: "", quantity: 0, rate: 0, amount: 0, hsnSac: "" },
    { description: "", quantity: 0, rate: 0, amount: 0, hsnSac: "" },
    { description: "", quantity: 0, rate: 0, amount: 0, hsnSac: "" },
    { description: "", quantity: 0, rate: 0, amount: 0, hsnSac: "" },
  ]);

  const [invoiceDetails, setInvoiceDetails] = useState({
    invoiceNo: "",
    invoiceDate: "",
    buyerName: "",
  });

  const [phoneNumber, setPhoneNumber] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleInputChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;

    if (field === "quantity" || field === "rate") {
      updatedItems[index].amount = updatedItems[index].quantity * updatedItems[index].rate;
    }

    setItems(updatedItems);
  };

  const handleInvoiceDetailsChange = (field, value) => {
    setInvoiceDetails({ ...invoiceDetails, [field]: value });
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.amount, 0);
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleSendMessage = () => {
    if (phoneNumber) {
      const whatsappSection = document.querySelector(".whatsapp-section");
      const actionButtons = document.querySelector(".action-buttons");
      const modal = document.querySelector(".modal");

      if (whatsappSection) whatsappSection.style.display = "none";
      if (actionButtons) actionButtons.style.display = "none";
      if (modal) modal.style.display = "none";

      html2canvas(document.querySelector(".invoice-box"), {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
      }).then((canvas) => {
        const imageUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = imageUrl;
        link.download = "invoice.png";
        link.click();

        if (whatsappSection) whatsappSection.style.display = "block";
        if (actionButtons) actionButtons.style.display = "flex";
        if (modal) modal.style.display = "flex";

        const whatsappMessage = `🧾 *Tax Invoice*\n\nPlease find the invoice attached below.`;
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(whatsappUrl, "_blank");
      });
    } else {
      alert("Please enter a valid phone number.");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const totalAmount = calculateTotal();

  return (
    <div className="invoice-box">
      <div className="highlight-block">
        {/* <h2 className="main-header">🧾 Tax Invoice</h2> */}
        <h4><strong>SHREE GOPAL ACCESSORIES</strong></h4>
        <p><strong>Mobile Accessories</strong></p>
        <p>
          1st Floor, Shop No. 144/145, Orchid City Centre Mall,<br />
          Bellasis Road, Opp. S.T. Depot, Tardeo,<br />
          Mumbai Central, Mumbai City, Maharashtra – 400008
        </p>
      </div>

      <table className="info-table">
        <tbody>
          <tr>
            <td>
              <span className="info-title">Invoice No:</span>
              <input
                type="text"
                value={invoiceDetails.invoiceNo}
                onChange={(e) => handleInvoiceDetailsChange("invoiceNo", e.target.value)}
              />
            </td>
            <td>
              <span className="info-title">Invoice Date:</span>
              <input
                type="date"
                value={invoiceDetails.invoiceDate}
                onChange={(e) => handleInvoiceDetailsChange("invoiceDate", e.target.value)}
              />
            </td>
          </tr>
          <tr>
            <td>
              <span className="info-title">Buyer Name:</span>
              <input
                type="text"
                value={invoiceDetails.buyerName}
                onChange={(e) => handleInvoiceDetailsChange("buyerName", e.target.value)}
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
            <td colSpan="5" className="right bold">Total Amount</td>
            <td className="right bold">{totalAmount.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      <div className="action-buttons">
        <button className="whatsapp-button" onClick={openModal}>
          📤 Share via WhatsApp
        </button>
        <button className="print-button" onClick={handlePrint}>
          🖨️ Print Invoice
        </button>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <label htmlFor="phone-number">Enter Phone Number</label>
            <input
              type="text"
              id="phone-number"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              placeholder="e.g., 919819287163"
            />
            <div className="button-group">
              <button className="save-button" onClick={handleSendMessage}>Save</button>
              <button className="cancel-button" onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoice;