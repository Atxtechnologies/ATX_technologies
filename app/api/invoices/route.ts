import { NextResponse } from "next/server";
import { connectedToDatabase } from "@/lib/db";
import Invoice from "@/models/Invoice";

export const dynamic = "force-dynamic";

// 🧾 GET all invoices
export async function GET() {
  await connectedToDatabase();
  const invoices = await Invoice.find().sort({ createdAt: -1 });
  return NextResponse.json(invoices);
}

// 💾 CREATE invoice
export async function POST(req: Request) {
  await connectedToDatabase();
  const body = await req.json();

  // Auto-generate invoice number if not provided
  if (!body.invoiceNumber) {
    body.invoiceNumber = `INV-${Date.now()}`;
  }

  // 🧮 Auto calculate totals
  const subtotal = body.items?.reduce(
    (acc: number, item: any) => acc + item.qty * item.rate,
    0
  ) || 0;

  const totalTaxPercent =
    body.taxes?.reduce(
      (acc: number, t: any) => acc + (Number(t.percent) || 0),
      0
    ) || 0;

  const taxAmount = (subtotal * totalTaxPercent) / 100;
  const totalAmount = subtotal + taxAmount;

  const invoiceData = {
    ...body,
    subtotal,
    taxAmount,
    totalAmount,
  };

  const invoice = await Invoice.create(invoiceData);
  return NextResponse.json(invoice, { status: 201 });
}
