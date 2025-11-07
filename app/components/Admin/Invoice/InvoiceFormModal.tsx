"use client";
import React, { useEffect, useState } from "react";
import { createInvoice, updateInvoice, fetchInvoice } from "./api";
import { Invoice, LineItem } from "./types";

export default function InvoiceFormModal({
  onClose,
  onSaved,
  invoiceId, // ✅ new prop (optional)
}: {
  onClose: () => void;
  onSaved: () => void;
  invoiceId?: string;
}) {
  const [form, setForm] = useState<
    Omit<Invoice, "_id" | "invoiceNumber" | "createdAt">
  >({
    invoiceDate: new Date().toISOString(),
    company: { name: "", address: "", email: "", logo: "" },
    client: { name: "", address: "", email: "" },
    taxPercent: 0,
    notes: "",
    status: "draft",
    items: [{ description: "", qty: 1, rate: 0 }],
  });

  const [isEditMode, setIsEditMode] = useState(false);

  // ✅ Load invoice data if editing
  useEffect(() => {
    if (invoiceId) {
      setIsEditMode(true);
      (async () => {
        const existing = await fetchInvoice(invoiceId);
        setForm(existing);
      })();
    }
  }, [invoiceId]);

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

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64Logo = ev.target?.result as string;
      setForm({
        ...form,
        company: { ...form.company, logo: base64Logo },
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditMode && invoiceId) {
      await updateInvoice(invoiceId, form);
    } else {
      await createInvoice(form);
    }

    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-[600px] p-6 rounded shadow-lg space-y-4 overflow-y-auto max-h-[90vh]"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            {isEditMode ? "Edit Invoice" : "New Invoice"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-black"
          >
            ✕
          </button>
        </div>

        {/* Company Info */}
        <div>
          <h3 className="font-medium mb-2">Company Info</h3>
          <div className="flex items-center gap-2 mb-3">
            {form.company.logo && (
              <img
                src={form.company.logo}
                alt="Logo Preview"
                className="w-12 h-12 object-contain border rounded"
              />
            )}
            <label className="text-sm cursor-pointer bg-gray-100 px-2 py-1 rounded border border-gray-300">
              Upload Logo
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleLogoUpload}
              />
            </label>
          </div>

          <input
            placeholder="Company Name"
            className="border p-2 w-full mb-2"
            value={form.company.name}
            onChange={(e) =>
              setForm({
                ...form,
                company: { ...form.company, name: e.target.value },
              })
            }
          />
          <input
            placeholder="Address"
            className="border p-2 w-full mb-2"
            value={form.company.address}
            onChange={(e) =>
              setForm({
                ...form,
                company: { ...form.company, address: e.target.value },
              })
            }
          />
          <input
            placeholder="Email"
            className="border p-2 w-full"
            value={form.company.email}
            onChange={(e) =>
              setForm({
                ...form,
                company: { ...form.company, email: e.target.value },
              })
            }
          />
        </div>

        {/* Client Info */}
        <div>
          <h3 className="font-medium mb-2">Client Info</h3>
          <input
            placeholder="Client Name"
            className="border p-2 w-full mb-2"
            value={form.client.name}
            onChange={(e) =>
              setForm({
                ...form,
                client: { ...form.client, name: e.target.value },
              })
            }
          />
          <input
            placeholder="Address"
            className="border p-2 w-full mb-2"
            value={form.client.address}
            onChange={(e) =>
              setForm({
                ...form,
                client: { ...form.client, address: e.target.value },
              })
            }
          />
          <input
            placeholder="Email"
            className="border p-2 w-full"
            value={form.client.email}
            onChange={(e) =>
              setForm({
                ...form,
                client: { ...form.client, email: e.target.value },
              })
            }
          />
        </div>

        {/* Items */}
        <div>
          <h3 className="font-medium mb-1">Items</h3>
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
        </div>

        <div className="flex flex-col gap-4">
  <div className="flex gap-4">
    <input
      placeholder="Tax %"
      className="border p-2 w-24"
      value={form.taxPercent}
      onChange={(e) =>
        setForm({ ...form, taxPercent: Number(e.target.value) })
      }
    />
    <input
      placeholder="Notes"
      className="border p-2 flex-1"
      value={form.notes}
      onChange={(e) => setForm({ ...form, notes: e.target.value })}
    />
  </div>

  {/* ✅ Payment Method Dropdown */}
  <div>
    <label className="block text-sm font-medium mb-1">Payment Method</label>
    <select
      className="border p-2 w-full rounded"
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
  </div>
</div>


        

        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded w-full mt-2"
        >
          {isEditMode ? "Update Invoice" : "Save Invoice"}
        </button>
      </form>
    </div>
  );
}
