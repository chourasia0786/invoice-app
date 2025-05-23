import React, { useState } from "react";
import html2canvas from "html2canvas";


const Invoice = () => {
  const initialItems = Array(10).fill().map(() => ({
    description: "",
    quantity: "",
    rate: "",
    amount: "",
  }));

  const [items, setItems] = useState(initialItems);
  const [invoiceDetails, setInvoiceDetails] = useState({
    invoiceNo: "",
    invoiceDate: "",
    buyerName: "",
  });
  const handleAddRow = () => {
    setItems([...items, { description: "", quantity: "", rate: "", amount: "" }]);
  };
  const [showButtons, setShowButtons] = useState(true);

  const handleInputChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = field === "description" ? value.toUpperCase() : value;

    if (field === "quantity" || field === "rate") {
      const quantity = parseFloat(updatedItems[index].quantity) || 0;
      const rate = parseFloat(updatedItems[index].rate) || 0;
      updatedItems[index].amount = quantity * rate || "";
    }

    setItems(updatedItems);
  };

  const handleInvoiceDetailsChange = (field, value) => {
    const newValue = field === "buyerName" ? value.toUpperCase() : value;
    setInvoiceDetails({ ...invoiceDetails, [field]: newValue });
  };

  const handleClear = () => {
    setItems(initialItems);
    setInvoiceDetails({
      invoiceNo: "",
      invoiceDate: "",
      buyerName: "",
    });
  };

  const calculateTotal = () => {
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

  const isRowEmpty = (item) => {
    return (
      !item.description &&
      (!item.quantity || item.quantity === "0" || item.quantity === "") &&
      (!item.rate || item.rate === "0" || item.rate === "") &&
      (!item.amount || item.amount === "0" || item.amount === "")
    );
  };

  const handlePrint = () => {
    setShowButtons(false);

    // Add a class to hide empty rows
    const rows = document.querySelectorAll(".billing-table tbody tr:not(:last-child)");
    rows.forEach((row, index) => {
      if (isRowEmpty(items[index])) {
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

        // Remove the hide class after printing
        rows.forEach((row) => row.classList.remove("hide-for-print"));
        setShowButtons(true);
      });
    }, 100);
  };

  const totalAmount = calculateTotal();
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
        <h4><strong>SHREE GOPAL Mobile ACCESSORIES & Cover</strong></h4>
        <p>
          1ST FLOOR, SHOP NO. 144/145, ORCHID CITY CENTRE MALL,<br />
          BELLASIS ROAD, OPP. S.T. DEPOT, TARDEO,<br />
          MUMBAI CENTRAL, MUMBAI CITY, MAHARASHTRA – 400008
        </p>
      </div>

      <table className="info-table">
        <tbody>
          <tr>
            <td>
              <span className="info-title">INVOICE NO:</span>
              <input
                type="text"
                value={invoiceDetails.invoiceNo}
                onChange={(e) => handleInvoiceDetailsChange("invoiceNo", e.target.value)}
              />
            </td>
            <td>
              <span className="info-title">INVOICE DATE:</span>
              <input
                type="date"
                value={invoiceDetails.invoiceDate}
                onChange={(e) => handleInvoiceDetailsChange("invoiceDate", e.target.value)}
              />
            </td>
          </tr>
          <tr>
            <td>
              <span className="info-title">BUYER NAME:</span>
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
            <th>SR. NO.</th>
            <th>DESCRIPTION OF GOODS</th>
            <th>QTY</th>
            <th>RATE (₹)</th>
            <th>AMOUNT (₹)</th>
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
            <td colSpan="2" className="right bold">TOTAL</td>
            <td className="right bold">
              {totalQuantity === 0 ? "" : totalQuantity.toFixed(2)}
            </td>
            <td></td>
            <td className="right bold">
              {totalAmount === 0 ? "" : totalAmount.toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>

      {showButtons && (
        <div className="action-buttons">
          <button className="add-row-button" onClick={handleAddRow}>
          ➕ ADD Item
          </button>
          <button className="print-button" onClick={handlePrint}>
            🖨️ PRINT INVOICE
          </button>
          <button className="clear-button" onClick={handleClear}>
            🗑️ CLEAR ALL
          </button>
        </div>
      )}
    </div>
  );
};

export default Invoice;