// models/Invoice.ts
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
  },
  client: {
    name: String,
    address: String,
    email: String,
  },
  items: [LineItemSchema],
  taxPercent: { type: Number, default: 0 },
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
