import mongoose from "mongoose";

const LineItemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  qty: { type: Number, required: true, default: 1 },
  rate: { type: Number, required: true, default: 0 },
});

const InvoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true },
  invoiceDate: { type: Date, default: Date.now },

  company: {
    name: String,
    address: String,
    email: String,
    logo: String,
    gstNumber: String, // ✅ GST Number
    bankDetails: {
      accountName: String,
      accountNumber: String,
      ifscCode: String,
      bankName: String,
    },
  },

  client: {
    name: String,
    address: String,
    email: String,
    gstNumber: String, // ✅ Client GST Number
  },

  items: [LineItemSchema],

  gatTaxPercent: { type: Number, default: 0 }, // ✅ GAT
  salesTaxPercent: { type: Number, default: 0 }, // ✅ Sales Tax
  taxPercent: { type: Number, default: 0 }, // existing main tax if needed

  notes: String,
  paymentMethod: {
    type: String,
    enum: ["Bank Transfer", "UPI", "Credit Card", "Cash", "Cheque"],
    default: "Bank Transfer",
  },

  status: { type: String, enum: ["draft", "unpaid", "paid"], default: "draft" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Invoice || mongoose.model("Invoice", InvoiceSchema);
