export type LineItem = {
  description: string;
  qty: number;
  rate: number;
};

export type CompanyInfo = {
  name: string;
  address: string;
  email: string;
  logo?: string;
};

export type ClientInfo = {
  name: string;
  address: string;
  email: string;
};

export type Invoice = {
  _id?: string;
  invoiceNumber: string;
  invoiceDate: string;
  company: CompanyInfo;
  client: ClientInfo;
  items: LineItem[];
  taxPercent: number;
  notes: string;
  paymentMethod?: string; //
  status: "draft" | "unpaid" | "paid";
  createdAt?: string;
};


