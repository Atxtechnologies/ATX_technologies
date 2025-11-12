// "use client";
// import React, { useRef, useState } from "react";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import Image from "next/image";
// import { Invoice } from "./types";

// export default function StyledInvoiceTemplate({ invoice }: { invoice: Invoice }) {
//   const invoiceRef = useRef<HTMLDivElement>(null);
//   const [logo, setLogo] = useState<string>(
//     invoice.company.logo || "/default-logo.png"
//   );

//   // --- Tax Calculations ---
//   const subtotal = invoice.items.reduce(
//     (acc, item) => acc + item.qty * item.rate,
//     0
//   );
//   const gatTax = subtotal * (invoice.gatTaxPercent || 0) / 100;
//   const salesTax = subtotal * (invoice.salesTaxPercent || 0) / 100;
//   const otherTax = subtotal * (invoice.taxPercent || 0) / 100;
//   const totalTax = gatTax + salesTax + otherTax;
//   const total = subtotal + totalTax;

//   // --- Logo Change ---
//   const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const reader = new FileReader();
//       reader.onload = (ev) => setLogo(ev.target?.result as string);
//       reader.readAsDataURL(e.target.files[0]);
//     }
//   };

//   // --- Download PDF ---
//   const downloadPDF = async () => {
//     const element = invoiceRef.current;
//     if (!element) return;

//     const canvas = await html2canvas(element, {
//       scale: 2,
//       useCORS: true,
//       backgroundColor: "#ffffff",
//     });
//     const imgData = canvas.toDataURL("image/png");
//     const pdf = new jsPDF("p", "mm", "a4");
//     const width = pdf.internal.pageSize.getWidth();
//     const height = (canvas.height * width) / canvas.width;
//     pdf.addImage(imgData, "PNG", 0, 0, width, height);
//     pdf.save(`${invoice.invoiceNumber || "invoice"}.pdf`);
//   };

//   return (
//     <div className="relative bg-gray-100 p-6 flex justify-center">
//       {/* --- Action Buttons --- */}
//       <div className="absolute top-4 right-4 flex gap-2 z-10">
//         <label className="bg-gray-200 px-3 py-1 rounded cursor-pointer text-sm hover:bg-gray-300 transition">
//           Change Logo
//           <input type="file" accept="image/*" onChange={handleLogoChange} hidden />
//         </label>
//         <button
//           onClick={downloadPDF}
//           className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition"
//         >
//           Download PDF
//         </button>
//       </div>

//       {/* --- Invoice Content --- */}
//       <div
//         ref={invoiceRef}
//         className="bg-white w-[800px] p-10 font-sans text-gray-800 shadow-md border border-gray-200 rounded"
//       >
//         {/* Header */}
//         <div className="flex justify-between items-start border-b pb-4 mb-4">
//           <div className="flex items-start gap-4">
//             {logo && (
//               <div className="w-16 h-16 relative">
//                 <Image src={logo} alt="Company Logo" fill className="object-contain" />
//               </div>
//             )}
//             <div>
//               <h2 className="text-lg font-semibold uppercase">
//                 {invoice.company.name}
//               </h2>
//               <p className="text-sm">{invoice.company.address}</p>
//               <p className="text-sm">{invoice.company.email}</p>
//               {invoice.company.gstNumber && (
//                 <p className="text-sm font-medium">
//                   <strong>GST:</strong> {invoice.company.gstNumber}
//                 </p>
//               )}
//             </div>
//           </div>

//           <div className="text-right">
//             <h1 className="text-3xl font-bold tracking-widest mb-1">INVOICE</h1>
//             <p className="text-sm">
//               Invoice No: <strong>{invoice.invoiceNumber}</strong>
//             </p>
//             <p className="text-sm">
//               Invoice Date: {new Date(invoice.invoiceDate).toLocaleDateString()}
//             </p>
//           </div>
//         </div>

//         {/* Client Info */}
//         <div className="mb-6">
//           <h3 className="font-semibold text-sm uppercase mb-1 text-gray-700">
//             Bill To
//           </h3>
//           <p className="text-sm">{invoice.client.name}</p>
//           <p className="text-sm">{invoice.client.address}</p>
//           <p className="text-sm">{invoice.client.email}</p>
//           {invoice.client.gstNumber && (
//             <p className="text-sm font-medium">
//               <strong>GST:</strong> {invoice.client.gstNumber}
//             </p>
//           )}
//         </div>

//         {/* Table */}
//         <table className="w-full border-collapse text-sm mb-6">
//           <thead>
//             <tr className="bg-gray-100 border-b border-gray-300">
//               <th className="text-left p-2">Description</th>
//               <th className="text-center p-2">Qty</th>
//               <th className="text-center p-2">Rate</th>
//               <th className="text-right p-2">Amount</th>
//             </tr>
//           </thead>
//           <tbody>
//             {invoice.items.map((item, i) => (
//               <tr key={i} className="border-b">
//                 <td className="p-2">{item.description}</td>
//                 <td className="text-center p-2">{item.qty}</td>
//                 <td className="text-center p-2">${item.rate.toFixed(2)}</td>
//                 <td className="text-right p-2">
//                   ${(item.qty * item.rate).toFixed(2)}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {/* Totals */}
//         <div className="flex justify-end">
//           <table className="text-sm w-1/3">
//             <tbody>
//               <tr>
//                 <td className="p-1">Subtotal</td>
//                 <td className="text-right p-1">${subtotal.toFixed(2)}</td>
//               </tr>
//               {invoice.gatTaxPercent > 0 && (
//                 <tr>
//                   <td className="p-1">GAT ({invoice.gatTaxPercent}%)</td>
//                   <td className="text-right p-1">${gatTax.toFixed(2)}</td>
//                 </tr>
//               )}
//               {invoice.salesTaxPercent > 0 && (
//                 <tr>
//                   <td className="p-1">Sales Tax ({invoice.salesTaxPercent}%)</td>
//                   <td className="text-right p-1">${salesTax.toFixed(2)}</td>
//                 </tr>
//               )}
//               {invoice.taxPercent > 0 && (
//                 <tr>
//                   <td className="p-1">Other Tax ({invoice.taxPercent}%)</td>
//                   <td className="text-right p-1">${otherTax.toFixed(2)}</td>
//                 </tr>
//               )}
//               <tr className="border-t font-semibold">
//                 <td className="p-1">Total</td>
//                 <td className="text-right p-1">${total.toFixed(2)}</td>
//               </tr>
//             </tbody>
//           </table>
//         </div>

//         {/* Payment Info */}
//         <div className="mt-6 text-sm space-y-2 border-t pt-3">
//           <p>
//             <strong>Payment Method:</strong> {invoice.paymentMethod || "Bank Transfer"}
//           </p>

//           {invoice.company.bankDetails && (
//             <div className="mt-2">
//               <h4 className="font-semibold">Bank Account Details:</h4>
//               <p>
//                 <strong>Bank:</strong> {invoice.company.bankDetails.bankName}
//               </p>
//               <p>
//                 <strong>Account Name:</strong> {invoice.company.bankDetails.accountName}
//               </p>
//               <p>
//                 <strong>Account No:</strong> {invoice.company.bankDetails.accountNumber}
//               </p>
//               <p>
//                 <strong>IFSC:</strong> {invoice.company.bankDetails.ifscCode}
//               </p>
//             </div>
//           )}

//           <p>
//             <strong>Notes:</strong>{" "}
//             {invoice.notes || "Thank you for your business!"}
//           </p>
//           <p>
//             <strong>Terms & Conditions:</strong> Payment is due within 30 days.
//           </p>
//         </div>

//         {/* Signature */}
//         <div className="mt-8 flex justify-end">
//           <div className="border-t border-gray-400 w-40 text-center text-sm pt-1">
//             Authorized Signature
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";
import React, { useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Image from "next/image";
import { Invoice } from "./types";

export default function StyledInvoiceTemplate({ invoice }: { invoice: Invoice }) {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [logo, setLogo] = useState<string>(
    invoice.company.logo || "/default-logo.png"
  );

  // 🧾 Calculate totals dynamically
  const subtotal =
    invoice.subtotal ||
    invoice.items.reduce((acc, item) => acc + item.qty * item.rate, 0);

  const totalTaxAmount =
    invoice.taxAmount ||
    (invoice.taxes?.reduce(
      (acc, t) => acc + subtotal * (Number(t.percent) || 0) / 100,
      0
    ) || 0);

  const totalAmount = invoice.totalAmount || subtotal + totalTaxAmount;

  // 🖼 Change Logo
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => setLogo(ev.target?.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // 💾 Download PDF
  const downloadPDF = async () => {
    const element = invoiceRef.current;
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save(`${invoice.invoiceNumber || "invoice"}.pdf`);
  };

  return (
    <div className="relative bg-gray-100 p-6 flex justify-center">
      {/* --- Action Buttons --- */}
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <label className="bg-gray-200 px-3 py-1 rounded cursor-pointer text-sm hover:bg-gray-300 transition">
          Change Logo
          <input type="file" accept="image/*" onChange={handleLogoChange} hidden />
        </label>
        <button
          onClick={downloadPDF}
          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition"
        >
          Download PDF
        </button>
      </div>

      {/* --- Invoice Content --- */}
      <div
        ref={invoiceRef}
        className="bg-white w-[800px] p-10 font-sans text-gray-800 shadow-md border border-gray-200 rounded"
      >
        {/* Header */}
        <div className="flex justify-between items-start border-b pb-4 mb-4">
          <div className="flex items-start gap-4">
            {logo && (
              <div className="w-16 h-16 relative">
                <Image src={logo} alt="Company Logo" fill className="object-contain" />
              </div>
            )}
            <div>
              <h2 className="text-lg font-semibold uppercase">
                {invoice.company.name}
              </h2>
              <p className="text-sm">{invoice.company.address}</p>
              <p className="text-sm">{invoice.company.email}</p>
              {invoice.company.gstNumber && (
                <p className="text-sm font-medium">
                  <strong>GST:</strong> {invoice.company.gstNumber}
                </p>
              )}
            </div>
          </div>

          <div className="text-right">
            <h1 className="text-3xl font-bold tracking-widest mb-1">INVOICE</h1>
            <p className="text-sm">
              Invoice No: <strong>{invoice.invoiceNumber}</strong>
            </p>
            <p className="text-sm">
              Invoice Date: {new Date(invoice.invoiceDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Client Info */}
        <div className="mb-6">
          <h3 className="font-semibold text-sm uppercase mb-1 text-gray-700">
            Bill To
          </h3>
          <p className="text-sm">{invoice.client.name}</p>
          <p className="text-sm">{invoice.client.address}</p>
          <p className="text-sm">{invoice.client.email}</p>
          {invoice.client.gstNumber && (
            <p className="text-sm font-medium">
              <strong>GST:</strong> {invoice.client.gstNumber}
            </p>
          )}
        </div>

        {/* Items Table */}
        <table className="w-full border-collapse text-sm mb-6">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-300">
              <th className="text-left p-2">Description</th>
              <th className="text-center p-2">Qty</th>
              <th className="text-center p-2">Rate</th>
              <th className="text-right p-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, i) => (
              <tr key={i} className="border-b">
                <td className="p-2">{item.description}</td>
                <td className="text-center p-2">{item.qty}</td>
                <td className="text-center p-2">₹{item.rate.toFixed(2)}</td>
                <td className="text-right p-2">
                  ₹{(item.qty * item.rate).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end">
          <table className="text-sm w-1/3">
            <tbody>
              <tr>
                <td className="p-1">Subtotal</td>
                <td className="text-right p-1">₹{subtotal.toFixed(2)}</td>
              </tr>

              {/* Dynamic Taxes */}
              {invoice.taxes?.map((tax, i) => {
                const amount = (subtotal * (Number(tax.percent) || 0)) / 100;
                return (
                  <tr key={i}>
                    <td className="p-1">
                      {tax.name} ({tax.percent}%)
                    </td>
                    <td className="text-right p-1">₹{amount.toFixed(2)}</td>
                  </tr>
                );
              })}

              <tr className="border-t font-semibold">
                <td className="p-1">Total</td>
                <td className="text-right p-1">₹{totalAmount.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Payment Info */}
        <div className="mt-6 text-sm space-y-2 border-t pt-3">
          <p>
            <strong>Payment Method:</strong>{" "}
            {invoice.paymentMethod || "Bank Transfer"}
          </p>

          {invoice.company.bankDetails && (
            <div className="mt-2">
              <h4 className="font-semibold">Bank Account Details:</h4>
              <p>
                <strong>Bank:</strong> {invoice.company.bankDetails.bankName}
              </p>
              <p>
                <strong>Account Name:</strong> {invoice.company.bankDetails.accountName}
              </p>
              <p>
                <strong>Account No:</strong> {invoice.company.bankDetails.accountNumber}
              </p>
              <p>
                <strong>IFSC:</strong> {invoice.company.bankDetails.ifscCode}
              </p>
            </div>
          )}

          <p>
            <strong>Notes:</strong>{" "}
            {invoice.notes || "Thank you for your business!"}
          </p>
          <p>
            <strong>Terms & Conditions:</strong> Payment is due within 30 days.
          </p>
        </div>

        {/* Signature */}
        <div className="mt-8 flex justify-end">
          <div className="border-t border-gray-400 w-40 text-center text-sm pt-1">
            Authorized Signature
          </div>
        </div>
      </div>
    </div>
  );
}
