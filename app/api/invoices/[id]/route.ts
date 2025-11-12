import { NextResponse } from "next/server";
import { connectedToDatabase } from "@/lib/db";
import Invoice from "@/models/Invoice";

// 🔍 GET single invoice
export async function GET(req: Request, { params }: any) {
  await connectedToDatabase();
  const invoice = await Invoice.findById(params.id);
  if (!invoice)
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(invoice);
}

// ✏️ UPDATE invoice
export async function PUT(req: Request, { params }: any) {
  await connectedToDatabase();
  const data = await req.json();

  // 🧮 Recalculate totals before updating
  const subtotal =
    data.items?.reduce(
      (acc: number, item: any) => acc + item.qty * item.rate,
      0
    ) || 0;

  const totalTaxPercent =
    data.taxes?.reduce(
      (acc: number, t: any) => acc + (Number(t.percent) || 0),
      0
    ) || 0;

  const taxAmount = (subtotal * totalTaxPercent) / 100;
  const totalAmount = subtotal + taxAmount;

  const updatedData = {
    ...data,
    subtotal,
    taxAmount,
    totalAmount,
  };

  const updated = await Invoice.findByIdAndUpdate(params.id, updatedData, {
    new: true,
  });
  return NextResponse.json(updated);
}

// ❌ DELETE invoice
export async function DELETE(req: Request, { params }: any) {
  await connectedToDatabase();
  await Invoice.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
