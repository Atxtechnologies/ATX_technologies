"use client";
import { useEffect, useState } from "react";
import { fetchInvoices, deleteInvoice } from "./api";
import { Invoice } from "./types";
import InvoiceFormModal from "./InvoiceFormModal";
import EditInvoiceModal from "./EditInvoiceModal";
import StyledInvoiceTemplate from"./InvoiceTemplate";

export default function InvoiceDashboard() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editInvoiceId, setEditInvoiceId] = useState<string | null>(null);
  const [viewInvoice, setViewInvoice] = useState<Invoice | null>(null);

  const loadInvoices = async () => {
    const data = await fetchInvoices();
    setInvoices(data);
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      {/* 🧾 Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Invoice Dashboard</h1>
          <p className="text-gray-500 text-sm">
            Manage, review, and download client invoices
          </p>
        </div>

        <button
          onClick={() => {
            setEditInvoiceId(null);
            setShowModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow-md transition-all duration-150"
        >
          + New Invoice
        </button>
      </div>

      {/* 📋 Invoices Table */}
      <div className="overflow-hidden bg-white rounded-xl shadow-sm border border-gray-100">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-left text-gray-700">
              <th className="p-3 font-medium">Invoice #</th>
              <th className="p-3 font-medium">Client</th>
              <th className="p-3 font-medium">Date</th>
              <th className="p-3 font-medium text-center">Status</th>
              <th className="p-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No invoices yet. Click “New Invoice” to create one.
                </td>
              </tr>
            ) : (
              invoices.map((inv) => (
                <tr
                  key={inv._id}
                  className="border-b hover:bg-gray-50 transition-colors duration-100"
                >
                  <td className="p-3 font-medium text-gray-800">
                    {inv.invoiceNumber}
                  </td>
                  <td className="p-3 text-gray-700">{inv.client.name}</td>
                  <td className="p-3 text-gray-600">
                    {new Date(inv.invoiceDate).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        inv.status === "paid"
                          ? "bg-green-100 text-green-700"
                          : inv.status === "unpaid"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-3">
                    <button
                      onClick={() => setViewInvoice(inv)}
                      className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      View
                    </button>
                    <button
                      onClick={() => {
                        setEditInvoiceId(inv._id!);
                        setShowModal(true);
                      }}
                      className="text-green-600 hover:text-green-800 font-medium transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={async () => {
                        if (
                          confirm(
                            `Are you sure you want to delete invoice #${inv.invoiceNumber}?`
                          )
                        ) {
                          await deleteInvoice(inv._id!);
                          loadInvoices();
                        }
                      }}
                      className="text-red-600 hover:text-red-800 font-medium transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 🧩 Create / Edit Invoice Modal */}
      {showModal && (
        <>
          {editInvoiceId ? (
            <EditInvoiceModal
              invoiceId={editInvoiceId}
              onClose={() => setShowModal(false)}
              onUpdated={loadInvoices}
            />
          ) : (
            <InvoiceFormModal
              invoiceId={editInvoiceId || undefined}
              onClose={() => setShowModal(false)}
              onSaved={loadInvoices}
            />
          )}
        </>
      )}

      {/* 🧾 View Invoice Modal */}
      {viewInvoice && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) setViewInvoice(null);
          }}
        >
          <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center border-b px-6 py-3 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-800">
                Invoice Preview
              </h3>
              <button
                onClick={() => setViewInvoice(null)}
                className="text-gray-500 hover:text-black text-2xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Invoice Template */}
            <div className="overflow-auto p-6 bg-white">
              <StyledInvoiceTemplate invoice={viewInvoice} />
            </div>

            {/* Footer */}
            <div className="border-t bg-gray-50 px-6 py-3 flex justify-end">
              <button
                onClick={() => setViewInvoice(null)}
                className="px-4 py-2 rounded bg-gray-800 text-white hover:bg-gray-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
