// components/Admin/Invoice/api.ts
export async function fetchInvoices() {
  const res = await fetch("/api/invoices", { cache: "no-store" });
  return res.json();
}

export async function fetchInvoice(id: string) {
  const res = await fetch(`/api/invoices/${id}`, { cache: "no-store" });
  return res.json();
}

export async function createInvoice(data: any) {
  const res = await fetch("/api/invoices", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateInvoice(id: string, data: any) {
  const res = await fetch(`/api/invoices/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteInvoice(id: string) {
  await fetch(`/api/invoices/${id}`, { method: "DELETE" });
}
