import { NextResponse } from "next/server";
import {connectedToDatabase} from "@/lib/db";
import Invoice from "@/models/Invoice";

export async function GET(req: Request, { params }: any) {
  await connectedToDatabase();
  const invoice = await Invoice.findById(params.id);
  if (!invoice) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(invoice);
}

export async function PUT(req: Request, { params }: any) {
  await connectedToDatabase();
  const data = await req.json();
  const updated = await Invoice.findByIdAndUpdate(params.id, data, { new: true });
  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: any) {
  await connectedToDatabase();
  await Invoice.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
