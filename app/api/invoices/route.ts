
import { NextResponse } from "next/server";
import {connectedToDatabase} from "@/lib/db";
import Invoice from "@/models/Invoice";

export const dynamic = "force-dynamic";

export async function GET() {
  await connectedToDatabase();
  const invoices = await Invoice.find().sort({ createdAt: -1 });
  return NextResponse.json(invoices);
}

export async function POST(req: Request) {
  await connectedToDatabase();
  const body = await req.json();

  if (!body.invoiceNumber)
    body.invoiceNumber = `INV-${Date.now()}`;

  const invoice = await Invoice.create(body);
  return NextResponse.json(invoice, { status: 201 });
}
