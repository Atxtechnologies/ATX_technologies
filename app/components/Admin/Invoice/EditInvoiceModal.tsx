// "use client";
// import React, { useState, useEffect } from "react";
// import { Invoice, LineItem } from "./types";
// import { updateInvoice, fetchInvoice } from "./api";

// export default function EditInvoiceModal({
//   invoiceId,
//   onClose,
//   onUpdated,
// }: {
//   invoiceId: string;
//   onClose: () => void;
//   onUpdated: () => void;
// }) {
//   const [form, setForm] = useState<Invoice | null>(null);

//   useEffect(() => {
//     const loadInvoice = async () => {
//       const inv = await fetchInvoice(invoiceId);
//       setForm(inv);
//     };
//     loadInvoice();
//   }, [invoiceId]);

//   if (!form) return <div className="p-6 text-center">Loading...</div>;

//   const updateItem = (i: number, key: keyof LineItem, val: string | number) => {
//     const items = [...form.items];
//     items[i][key] = val as never;
//     setForm({ ...form, items });
//   };

//   const addItem = () =>
//     setForm({
//       ...form,
//       items: [...form.items, { description: "", qty: 1, rate: 0 }],
//     });

//   const removeItem = (index: number) =>
//     setForm({
//       ...form,
//       items: form.items.filter((_, i) => i !== index),
//     });

//   const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = (ev) =>
//       setForm({
//         ...form,
//         company: { ...form.company, logo: ev.target?.result as string },
//       });
//     reader.readAsDataURL(file);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     await updateInvoice(invoiceId, form);
//     onUpdated();
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white w-[650px] p-6 rounded-2xl shadow-2xl space-y-5 overflow-y-auto max-h-[90vh]"
//       >
//         {/* Header */}
//         <div className="flex justify-between items-center border-b pb-3">
//           <h2 className="text-xl font-semibold text-gray-800">Edit Invoice</h2>
//           <button
//             type="button"
//             onClick={onClose}
//             className="text-gray-500 hover:text-black text-lg"
//           >
//             ✕
//           </button>
//         </div>

//         {/* 🏢 Company Info */}
//         <section>
//           <h3 className="font-medium text-gray-700 mb-2 border-b pb-1">
//             Company Info
//           </h3>
//           <div className="flex items-center gap-2 mb-3">
//             {form.company.logo && (
//               <img
//                 src={form.company.logo}
//                 alt="Logo Preview"
//                 className="w-12 h-12 object-contain border rounded"
//               />
//             )}
//             <label className="text-sm cursor-pointer bg-gray-100 px-2 py-1 rounded border border-gray-300">
//               Change Logo
//               <input
//                 type="file"
//                 accept="image/*"
//                 hidden
//                 onChange={handleLogoUpload}
//               />
//             </label>
//           </div>

//           <input
//             placeholder="Company Name"
//             className="border p-2 w-full mb-2"
//             value={form.company.name}
//             onChange={(e) =>
//               setForm({
//                 ...form,
//                 company: { ...form.company, name: e.target.value },
//               })
//             }
//           />
//           <input
//             placeholder="Address"
//             className="border p-2 w-full mb-2"
//             value={form.company.address}
//             onChange={(e) =>
//               setForm({
//                 ...form,
//                 company: { ...form.company, address: e.target.value },
//               })
//             }
//           />
//           <input
//             placeholder="Email"
//             className="border p-2 w-full mb-2"
//             value={form.company.email}
//             onChange={(e) =>
//               setForm({
//                 ...form,
//                 company: { ...form.company, email: e.target.value },
//               })
//             }
//           />
//           <input
//             placeholder="GST Number"
//             className="border p-2 w-full mb-2"
//             value={form.company.gstNumber || ""}
//             onChange={(e) =>
//               setForm({
//                 ...form,
//                 company: { ...form.company, gstNumber: e.target.value },
//               })
//             }
//           />

//           {/* 🏦 Bank Details */}
//           <div className="mt-3">
//             <h4 className="font-medium text-gray-700 mb-2">Bank Details</h4>
//             <input
//               placeholder="Bank Name"
//               className="border p-2 w-full mb-2"
//               value={form.company.bankDetails?.bankName || ""}
//               onChange={(e) =>
//                 setForm({
//                   ...form,
//                   company: {
//                     ...form.company,
//                     bankDetails: {
//                       ...form.company.bankDetails,
//                       bankName: e.target.value,
//                     },
//                   },
//                 })
//               }
//             />
//             <input
//               placeholder="Account Name"
//               className="border p-2 w-full mb-2"
//               value={form.company.bankDetails?.accountName || ""}
//               onChange={(e) =>
//                 setForm({
//                   ...form,
//                   company: {
//                     ...form.company,
//                     bankDetails: {
//                       ...form.company.bankDetails,
//                       accountName: e.target.value,
//                     },
//                   },
//                 })
//               }
//             />
//             <input
//               placeholder="Account Number"
//               className="border p-2 w-full mb-2"
//               value={form.company.bankDetails?.accountNumber || ""}
//               onChange={(e) =>
//                 setForm({
//                   ...form,
//                   company: {
//                     ...form.company,
//                     bankDetails: {
//                       ...form.company.bankDetails,
//                       accountNumber: e.target.value,
//                     },
//                   },
//                 })
//               }
//             />
//             <input
//               placeholder="IFSC Code"
//               className="border p-2 w-full"
//               value={form.company.bankDetails?.ifscCode || ""}
//               onChange={(e) =>
//                 setForm({
//                   ...form,
//                   company: {
//                     ...form.company,
//                     bankDetails: {
//                       ...form.company.bankDetails,
//                       ifscCode: e.target.value,
//                     },
//                   },
//                 })
//               }
//             />
//           </div>
//         </section>

//         {/* 👥 Client Info */}
//         <section>
//           <h3 className="font-medium text-gray-700 mb-2 border-b pb-1">
//             Client Info
//           </h3>
//           <input
//             placeholder="Client Name"
//             className="border p-2 w-full mb-2"
//             value={form.client.name}
//             onChange={(e) =>
//               setForm({
//                 ...form,
//                 client: { ...form.client, name: e.target.value },
//               })
//             }
//           />
//           <input
//             placeholder="Address"
//             className="border p-2 w-full mb-2"
//             value={form.client.address}
//             onChange={(e) =>
//               setForm({
//                 ...form,
//                 client: { ...form.client, address: e.target.value },
//               })
//             }
//           />
//           <input
//             placeholder="Email"
//             className="border p-2 w-full mb-2"
//             value={form.client.email}
//             onChange={(e) =>
//               setForm({
//                 ...form,
//                 client: { ...form.client, email: e.target.value },
//               })
//             }
//           />
//           <input
//             placeholder="GST Number"
//             className="border p-2 w-full"
//             value={form.client.gstNumber || ""}
//             onChange={(e) =>
//               setForm({
//                 ...form,
//                 client: { ...form.client, gstNumber: e.target.value },
//               })
//             }
//           />
//         </section>

//         {/* 📦 Items */}
//         <section>
//           <h3 className="font-medium text-gray-700 mb-1 border-b pb-1">
//             Items
//           </h3>
//           {form.items.map((it, i) => (
//             <div key={i} className="flex gap-2 mb-2">
//               <input
//                 className="border p-2 flex-1"
//                 placeholder="Description"
//                 value={it.description}
//                 onChange={(e) => updateItem(i, "description", e.target.value)}
//               />
//               <input
//                 className="border p-2 w-20"
//                 type="number"
//                 value={it.qty}
//                 onChange={(e) => updateItem(i, "qty", Number(e.target.value))}
//               />
//               <input
//                 className="border p-2 w-24"
//                 type="number"
//                 value={it.rate}
//                 onChange={(e) => updateItem(i, "rate", Number(e.target.value))}
//               />
//               <button
//                 type="button"
//                 onClick={() => removeItem(i)}
//                 className="bg-red-500 text-white px-2 rounded"
//               >
//                 X
//               </button>
//             </div>
//           ))}
//           <button
//             type="button"
//             onClick={addItem}
//             className="text-sm text-blue-600 hover:underline"
//           >
//             + Add Item
//           </button>
//         </section>

//         {/* 💰 Taxes & Payment */}
//         <section>
//           <h3 className="font-medium text-gray-700 mb-2 border-b pb-1">
//             Taxes & Payment
//           </h3>
//           <div className="grid grid-cols-3 gap-3 mb-3">
//             <input
//               placeholder="GAT %"
//               type="number"
//               className="border p-2 rounded"
//               value={form.gatTaxPercent || 0}
//               onChange={(e) =>
//                 setForm({ ...form, gatTaxPercent: Number(e.target.value) })
//               }
//             />
//             <input
//               placeholder="Sales Tax %"
//               type="number"
//               className="border p-2 rounded"
//               value={form.salesTaxPercent || 0}
//               onChange={(e) =>
//                 setForm({ ...form, salesTaxPercent: Number(e.target.value) })
//               }
//             />
//             <input
//               placeholder="Other Tax %"
//               type="number"
//               className="border p-2 rounded"
//               value={form.taxPercent || 0}
//               onChange={(e) =>
//                 setForm({ ...form, taxPercent: Number(e.target.value) })
//               }
//             />
//           </div>

//           <label className="block text-sm font-medium mb-1">
//             Payment Method
//           </label>
//           <select
//             className="border p-2 w-full rounded mb-3"
//             value={form.paymentMethod || "Bank Transfer"}
//             onChange={(e) =>
//               setForm({ ...form, paymentMethod: e.target.value })
//             }
//           >
//             <option value="Bank Transfer">Bank Transfer</option>
//             <option value="UPI">UPI</option>
//             <option value="Credit Card">Credit Card</option>
//             <option value="Cash">Cash</option>
//             <option value="Cheque">Cheque</option>
//           </select>

//           <input
//             placeholder="Notes"
//             className="border p-2 w-full"
//             value={form.notes}
//             onChange={(e) => setForm({ ...form, notes: e.target.value })}
//           />
//         </section>

//         {/* ✅ Submit */}
//         <button
//           type="submit"
//           className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full font-medium transition"
//         >
//           Update Invoice
//         </button>
//       </form>
//     </div>
//   );
// }

"use client";
import React, { useState, useEffect } from "react";
import { Invoice, LineItem } from "./types";
import { updateInvoice, fetchInvoice } from "./api";

export default function EditInvoiceModal({
  invoiceId,
  onClose,
  onUpdated,
}: {
  invoiceId: string;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [form, setForm] = useState<Invoice | null>(null);

  useEffect(() => {
    const loadInvoice = async () => {
      const inv = await fetchInvoice(invoiceId);
      // Ensure taxes array exists
      setForm({
        ...inv,
        taxes: inv.taxes && inv.taxes.length > 0 ? inv.taxes : [{ name: "GST", percent: 0 }],
      });
    };
    loadInvoice();
  }, [invoiceId]);

  if (!form) return <div className="p-6 text-center">Loading...</div>;

  // 📦 Item management
  const updateItem = (i: number, key: keyof LineItem, val: string | number) => {
    const items = [...form.items];
    items[i][key] = val as never;
    setForm({ ...form, items });
  };

  const addItem = () =>
    setForm({
      ...form,
      items: [...form.items, { description: "", qty: 1, rate: 0 }],
    });

  const removeItem = (index: number) =>
    setForm({
      ...form,
      items: form.items.filter((_, i) => i !== index),
    });

  // 🧮 Tax management
  const updateTax = (i: number, key: "name" | "percent", val: string | number) => {
    const taxes = [...(form.taxes || [])];
    taxes[i][key] = val as never;
    setForm({ ...form, taxes });
  };

  const addTax = () =>
    setForm({
      ...form,
      taxes: [...(form.taxes || []), { name: "", percent: 0 }],
    });

  const removeTax = (index: number) =>
    setForm({
      ...form,
      taxes: form.taxes.filter((_, i) => i !== index),
    });

  // 🖼 Logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) =>
      setForm({
        ...form,
        company: { ...form.company, logo: ev.target?.result as string },
      });
    reader.readAsDataURL(file);
  };

  // 💰 Totals
  const subtotal = form.items.reduce((acc, item) => acc + item.qty * item.rate, 0);
  const totalTaxPercent = form.taxes.reduce((acc, t) => acc + (t.percent || 0), 0);
  const taxAmount = (subtotal * totalTaxPercent) / 100;
  const totalAmount = subtotal + taxAmount;

  // 💾 Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...form,
      subtotal,
      taxAmount,
      totalAmount,
    };

    await updateInvoice(invoiceId, payload);
    onUpdated();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-[650px] p-6 rounded-2xl shadow-2xl space-y-5 overflow-y-auto max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-xl font-semibold text-gray-800">Edit Invoice</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-black text-lg"
          >
            ✕
          </button>
        </div>

        {/* 🏢 Company Info */}
        <section>
          <h3 className="font-medium text-gray-700 mb-2 border-b pb-1">Company Info</h3>
          <div className="flex items-center gap-2 mb-3">
            {form.company.logo && (
              <img
                src={form.company.logo}
                alt="Logo Preview"
                className="w-12 h-12 object-contain border rounded"
              />
            )}
            <label className="text-sm cursor-pointer bg-gray-100 px-2 py-1 rounded border border-gray-300">
              Change Logo
              <input type="file" accept="image/*" hidden onChange={handleLogoUpload} />
            </label>
          </div>

          {["name", "address", "email", "gstNumber"].map((key) => (
            <input
              key={key}
              placeholder={`Company ${key}`}
              className="border p-2 w-full mb-2"
              value={(form.company as any)[key] || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  company: { ...form.company, [key]: e.target.value },
                })
              }
            />
          ))}

          {/* 🏦 Bank Details */}
          <div className="mt-3">
            <h4 className="font-medium text-gray-700 mb-2">Bank Details</h4>
            {["bankName", "accountName", "accountNumber", "ifscCode"].map((key) => (
              <input
                key={key}
                placeholder={key.replace(/([A-Z])/g, " $1")}
                className="border p-2 w-full mb-2"
                value={(form.company.bankDetails as any)[key] || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    company: {
                      ...form.company,
                      bankDetails: {
                        ...form.company.bankDetails,
                        [key]: e.target.value,
                      },
                    },
                  })
                }
              />
            ))}
          </div>
        </section>

        {/* 👥 Client Info */}
        <section>
          <h3 className="font-medium text-gray-700 mb-2 border-b pb-1">Client Info</h3>
          {["name", "address", "email", "gstNumber"].map((key) => (
            <input
              key={key}
              placeholder={`Client ${key}`}
              className="border p-2 w-full mb-2"
              value={(form.client as any)[key] || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  client: { ...form.client, [key]: e.target.value },
                })
              }
            />
          ))}
        </section>

        {/* 📦 Items */}
        <section>
          <h3 className="font-medium text-gray-700 mb-1 border-b pb-1">Items</h3>
          {form.items.map((it, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                className="border p-2 flex-1"
                placeholder="Description"
                value={it.description}
                onChange={(e) => updateItem(i, "description", e.target.value)}
              />
              <input
                className="border p-2 w-20"
                type="number"
                value={it.qty}
                onChange={(e) => updateItem(i, "qty", Number(e.target.value))}
              />
              <input
                className="border p-2 w-24"
                type="number"
                value={it.rate}
                onChange={(e) => updateItem(i, "rate", Number(e.target.value))}
              />
              <button
                type="button"
                onClick={() => removeItem(i)}
                className="bg-red-500 text-white px-2 rounded"
              >
                X
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addItem}
            className="text-sm text-blue-600 hover:underline"
          >
            + Add Item
          </button>
        </section>

        {/* 💰 Taxes & Totals */}
        <section>
          <h3 className="font-medium text-gray-700 mb-2 border-b pb-1">
            Taxes & Totals
          </h3>

          {form.taxes.map((tax, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                placeholder="Tax Name"
                className="border p-2 flex-1 rounded"
                value={tax.name}
                onChange={(e) => updateTax(i, "name", e.target.value)}
              />
              <input
                placeholder="%"
                type="number"
                className="border p-2 w-24 rounded"
                value={tax.percent}
                onChange={(e) => updateTax(i, "percent", Number(e.target.value))}
              />
              <button
                type="button"
                onClick={() => removeTax(i)}
                className="bg-red-500 text-white px-2 rounded"
              >
                X
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addTax}
            className="text-sm text-blue-600 hover:underline"
          >
            + Add Tax
          </button>

          {/* Totals */}
          <div className="mt-4 border-t pt-3 text-sm text-gray-800 space-y-1">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Tax ({totalTaxPercent}%):</span>
              <span>₹{taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-gray-900 border-t pt-2">
              <span>Grand Total:</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </section>

        {/* 💳 Payment */}
        <section>
          <label className="block text-sm font-medium mb-1">
            Payment Method
          </label>
          <select
            className="border p-2 w-full rounded mb-3"
            value={form.paymentMethod || "Bank Transfer"}
            onChange={(e) =>
              setForm({ ...form, paymentMethod: e.target.value })
            }
          >
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="UPI">UPI</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Cash">Cash</option>
            <option value="Cheque">Cheque</option>
          </select>

          <textarea
            placeholder="Notes"
            className="border p-2 w-full rounded h-20"
            value={form.notes || ""}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </section>

        {/* ✅ Submit */}
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full font-medium transition"
        >
          Update Invoice
        </button>
      </form>
    </div>
  );
}
