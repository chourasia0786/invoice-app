import React, { useState } from "react";
import html2canvas from "html2canvas";
import "./styles.css";

const TaxInvoice = () => {
  const initialItems = Array(12).fill().map(() => ({
    description: "",
    quantity: "",
    rate: "",
    amount: "",
    hsnSac: "",
  }));

  const [items, setItems] = useState(initialItems);
  const [invoiceDetails, setInvoiceDetails] = useState({
    invoiceNo: "",
    invoiceDate: "",
    buyerName: "",
    buyerGSTIN: "",
    buyerAddress: "",
  });
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isPhoneNumberEntered, setIsPhoneNumberEntered] = useState(false);
  const [isWhatsAppClicked, setIsWhatsAppClicked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showButtons, setShowButtons] = useState(true);

  const handleInputChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = field === "description" || field === "hsnSac" ? value.toUpperCase() : value;

    if (field === "quantity" || field === "rate") {
      const quantity = parseFloat(updatedItems[index].quantity) || 0;
      const rate = parseFloat(updatedItems[index].rate) || 0;
      updatedItems[index].amount = quantity * rate || "";
    }

    setItems(updatedItems);
  };

  const handleInvoiceDetailsChange = (field, value) => {
    const newValue = field === "buyerName" || field === "buyerAddress" ? value.toUpperCase() : value;
    setInvoiceDetails({ ...invoiceDetails, [field]: newValue });
  };

  const handleClear = () => {
    setItems(initialItems);
    setInvoiceDetails({
      invoiceNo: "",
      invoiceDate: "",
      buyerName: "",
      buyerGSTIN: "",
      buyerAddress: "",
    });
    setPhoneNumber("");
  };

  const calculateSubtotal = () => {
    return items.reduce((total, item) => {
      const amount = parseFloat(item.amount) || 0;
      return total + amount;
    }, 0);
  };

  const calculateTotalQuantity = () => {
    return items.reduce((total, item) => {
      const quantity = parseFloat(item.quantity) || 0;
      return total + quantity;
    }, 0);
  };

  const calculateTax = (subtotal) => {
    const cgst = (subtotal * 9) / 100;
    const sgst = (subtotal * 9) / 100;
    const igst = (subtotal * 18) / 100;
    return { cgst, sgst, igst };
  };

  const isRowEmpty = (item) => {
    return (
      !item.description &&
      (!item.quantity || item.quantity === "0" || item.quantity === "") &&
      (!item.rate || item.rate === "0" || item.rate === "") &&
      (!item.amount || item.amount === "0" || item.amount === "") &&
      !item.hsnSac
    );
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleSendMessage = () => {
    if (phoneNumber) {
      setShowButtons(false);
      const whatsappSection = document.querySelector(".whatsapp-section");
      const actionButtons = document.querySelector(".action-buttons");
      const modal = document.querySelector(".modal");

      if (whatsappSection) whatsappSection.style.display = "none";
      if (actionButtons) actionButtons.style.display = "none";
      if (modal) modal.style.display = "none";

      const rows = document.querySelectorAll(".billing-table tbody tr");
      rows.forEach((row, index) => {
        if (index < items.length && isRowEmpty(items[index])) {
          row.classList.add("hide-for-print");
        }
      });

      setTimeout(() => {
        html2canvas(document.querySelector(".invoice-box"), {
          backgroundColor: "#ffffff",
          scale: 2,
          useCORS: true,
        }).then((canvas) => {
          const imageUrl = canvas.toDataURL("image/png");
          const link = document.createElement("a");
          link.href = imageUrl;

          const safeBuyerName = invoiceDetails.buyerName.replace(/[^a-zA-Z0-9]/g, "_") || "unnamed";
          const safeInvoiceNo = invoiceDetails.invoiceNo.replace(/[^a-zA-Z0-9]/g, "_") || "unnamed";
          const safeInvoiceDate = invoiceDetails.invoiceDate.replace(/[^a-zA-Z0-9]/g, "_") || "undated";

          link.download = `invoice_${safeInvoiceNo}_${safeBuyerName}_${safeInvoiceDate}.png`;
          link.click();

          if (whatsappSection) whatsappSection.style.display = "block";
          if (actionButtons) {
            actionButtons.style.display = "flex";
            actionButtons.style.justifyContent = "flex-end";
          }
          if (modal) modal.style.display = "flex";

          rows.forEach((row) => row.classList.remove("hide-for-print"));
          setShowButtons(true);

          const whatsappMessage = `🧾 *Tax Invoice*\n\nPlease find the invoice attached below.`;
          const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;
          window.open(whatsappUrl, "_blank");
        });
      }, 100);
    } else {
      alert("Please enter a valid phone number.");
    }
  };

  const handlePrint = () => {
    setShowButtons(false);

    const rows = document.querySelectorAll(".billing-table tbody tr");
    rows.forEach((row, index) => {
      if (index < items.length && isRowEmpty(items[index])) {
        row.classList.add("hide-for-print");
      }
    });

    setTimeout(() => {
      const invoiceBox = document.querySelector(".invoice-box");
      html2canvas(invoiceBox, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
      }).then((canvas) => {
        const imageUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = imageUrl;

        const safeBuyerName = invoiceDetails.buyerName.replace(/[^a-zA-Z0-9]/g, "_") || "unnamed";
        const safeInvoiceNo = invoiceDetails.invoiceNo.replace(/[^a-zA-Z0-9]/g, "_") || "unnamed";
        const safeInvoiceDate = invoiceDetails.invoiceDate.replace(/[^a-zA-Z0-9]/g, "_") || "undated";

        link.download = `invoice_${safeInvoiceNo}_${safeBuyerName}_${safeInvoiceDate}.png`;
        link.click();

        rows.forEach((row) => row.classList.remove("hide-for-print"));
        setShowButtons(true);
      });
    }, 100);
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleAlertClose = () => {
    setShowAlert(false);
  };

  const handleAlertSave = () => {
    setShowAlert(false);
    alert("Invoice Saved Successfully!");
  };

  const subtotal = calculateSubtotal();
  const { cgst, sgst, igst } = calculateTax(subtotal);
  const totalAmount = subtotal + cgst + sgst + igst;
  const totalQuantity = calculateTotalQuantity();

  return (
    <div className="invoice-box">
      <style>
        {`
          .invoice-box * {
            text-transform: uppercase;
          }
          .invoice-box input {
            text-transform: uppercase;
          }
          .highlight-block, .info-table, .billing-table {
            text-transform: uppercase;
          }
          .billing-table input {
            text-transform: uppercase;
          }
          .right {
            text-align: right;
          }
          .bold {
            font-weight: bold;
          }
          .hide-for-print {
            display: none;
          }
        `}
      </style>
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
            <td>
              <span className="info-title">GSTIN:</span>
              <input
                type="text"
                value={invoiceDetails.buyerGSTIN}
                onChange={(e) => handleInvoiceDetailsChange("buyerGSTIN", e.target.value)}
              />
            </td>
          </tr>
          <tr>
            <td colSpan="2">
              <span className="info-title">Buyer Address:</span>
              <input
                type="text"
                value={invoiceDetails.buyerAddress}
                onChange={(e) => handleInvoiceDetailsChange("buyerAddress", e.target.value)}
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
                  onChange={(e) => handleInputChange(index, "quantity", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={item.rate}
                  onChange={(e) => handleInputChange(index, "rate", e.target.value)}
                />
              </td>
              <td className="right">
                {item.amount === "" || isNaN(parseFloat(item.amount)) ? "" : parseFloat(item.amount).toFixed(2)}
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan="3" className="right bold">TOTAL</td>
            <td className="right bold">{totalQuantity === 0 ? "" : totalQuantity.toFixed(2)}</td>
            <td></td>
            <td className="right bold">{subtotal === 0 ? "" : subtotal.toFixed(2)}</td>
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
            <td className="right bold">{totalAmount === 0 ? "" : totalAmount.toFixed(2)}</td>
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

      {showAlert && (
        <div className="alert-box">
          <div className="alert-content">
            <h3>Are you sure you want to save the invoice?</h3>
            <div className="button-group">
              <button className="save-button" onClick={handleAlertSave}>
                Save
              </button>
              <button className="cancel-button" onClick={handleAlertClose}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showButtons && (
        <div className="action-buttons">
          <button className="whatsapp-button" onClick={openModal}>
            📤 Share via WhatsApp
          </button>
          <button className="print-button" onClick={handlePrint}>
            🖨️ Print Invoice
          </button>
          <button className="clear-button" onClick={handleClear}>
            🗑️ Clear All
          </button>
        </div>
      )}

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <label htmlFor="phone-number">Enter Phone Number </label>
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

export default TaxInvoice;