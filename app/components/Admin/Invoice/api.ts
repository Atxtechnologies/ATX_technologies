// components/Admin/Invoice/api.ts

// 🧱 Centralized API base helper
async function handleResponse(res: Response) {
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`API Error ${res.status}: ${errText}`);
  }
  return res.json();
}

// 📜 Fetch all invoices (sorted by latest)
export async function fetchInvoices() {
  const res = await fetch("/api/invoices", { cache: "no-store" });
  return handleResponse(res);
}

// 📄 Fetch single invoice by ID
export async function fetchInvoice(id: string) {
  const res = await fetch(`/api/invoices/${id}`, { cache: "no-store" });
  return handleResponse(res);
}

// 💾 Create a new invoice
export async function createInvoice(data: any) {
  const res = await fetch("/api/invoices", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

// ✏️ Update an existing invoice
export async function updateInvoice(id: string, data: any) {
  const res = await fetch(`/api/invoices/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

// ❌ Delete invoice by ID
export async function deleteInvoice(id: string) {
  const res = await fetch(`/api/invoices/${id}`, { method: "DELETE" });
  return handleResponse(res);
}
