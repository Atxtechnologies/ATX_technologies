import mongoose from "mongoose";

const LineItemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  qty: { type: Number, required: true, default: 1 },
  rate: { type: Number, required: true, default: 0 },
});

const TaxSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g. GST, Service Tax
  percent: { type: Number, required: true, default: 0 },
});

const InvoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true },
  invoiceDate: { type: Date, default: Date.now },

  company: {
    name: { type: String, required: true },
    address: String,
    email: String,
    logo: String,
    gstNumber: String,
    bankDetails: {
      accountName: String,
      accountNumber: String,
      ifscCode: String,
      bankName: String,
    },
  },

  client: {
    name: { type: String, required: true },
    address: String,
    email: String,
    gstNumber: String,
  },

  items: { type: [LineItemSchema], required: true },

  taxes: [TaxSchema], // 🧾 multiple tax entries
  subtotal: { type: Number, default: 0 }, // 💰 pre-tax amount
  taxAmount: { type: Number, default: 0 }, // 💸 total tax value
  totalAmount: { type: Number, default: 0 }, // 💵 final amount

  notes: String,
  paymentMethod: {
    type: String,
    enum: ["Bank Transfer", "UPI", "Credit Card", "Cash", "Cheque"],
    default: "Bank Transfer",
  },

  status: { type: String, enum: ["draft", "unpaid", "paid"], default: "draft" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Invoice ||
  mongoose.model("Invoice", InvoiceSchema);
