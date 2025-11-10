export type BankDetails = {
  accountName?: string;
  accountNumber?: string;
  ifscCode?: string;
  bankName?: string;
};

export type CompanyInfo = {
  name: string;
  address: string;
  email: string;
  logo?: string;
  gstNumber?: string;
  bankDetails?: BankDetails;
};

export type ClientInfo = {
  name: string;
  address: string;
  email: string;
  gstNumber?: string;
};

export type LineItem = {
  description: string;
  qty: number;
  rate: number;
};

export type Invoice = {
  _id?: string;
  invoiceNumber?: string;
  invoiceDate: string;
  company: CompanyInfo;
  client: ClientInfo;
  items: LineItem[];
  gatTaxPercent: number;
  salesTaxPercent: number;
  taxPercent: number;
  notes?: string;
  paymentMethod?: string;
  status: "draft" | "unpaid" | "paid";
  createdAt?: string;
};
