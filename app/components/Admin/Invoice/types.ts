// export type BankDetails = {
//   accountName?: string;
//   accountNumber?: string;
//   ifscCode?: string;
//   bankName?: string;
// };

// export type CompanyInfo = {
//   name: string;
//   address: string;
//   email: string;
//   logo?: string;
//   gstNumber?: string;
//   bankDetails?: BankDetails;
// };

// export type ClientInfo = {
//   name: string;
//   address: string;
//   email: string;
//   gstNumber?: string;
// };

// export type LineItem = {
//   description: string;
//   qty: number;
//   rate: number;
// };

// export type Invoice = {
//   _id?: string;
//   invoiceNumber?: string;
//   invoiceDate: string;
//   company: CompanyInfo;
//   client: ClientInfo;
//   items: LineItem[];
//   gatTaxPercent: number;
//   salesTaxPercent: number;
//   taxPercent: number;
//   notes?: string;
//   paymentMethod?: string;
//   status: "draft" | "unpaid" | "paid";
//   createdAt?: string;
// };


// ==========================
// 🔹 Line Item
// ==========================
export interface LineItem {
  description: string;
  qty: number;
  rate: number;
}

// ==========================
// 🔹 Company Info
// ==========================
export interface Company {
  name: string;
  address: string;
  email: string;
  logo?: string;
  gstNumber?: string;
  bankDetails: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    ifscCode: string;
  };
}

// ==========================
// 🔹 Client Info
// ==========================
export interface Client {
  name: string;
  address: string;
  email: string;
  gstNumber?: string;
}

// ==========================
// 🔹 Tax Item (Dynamic Taxes)
// ==========================
export interface Tax {
  name: string;
  percent: number;
}

// ==========================
// 🔹 Invoice
// ==========================
export interface Invoice {
  _id?: string; // optional for new invoices before DB save
  invoiceNumber?: string;
  invoiceDate: string;
  company: Company;
  client: Client;
  items: LineItem[];

  // ✅ Dynamic tax array (always defined)
  taxes: Tax[];

  // ✅ Totals (calculated & stored)
  subtotal?: number;
  taxAmount?: number;
  totalAmount?: number;

  notes?: string;
  paymentMethod: string;
  status: "draft" | "unpaid" | "paid";
  createdAt?: string;
}
