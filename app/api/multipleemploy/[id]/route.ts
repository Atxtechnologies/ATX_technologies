import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectedToDatabase } from "@/lib/db";
import Admin from "@/models/admin";
import { encrypt } from "@/lib/encryption";
import bcrypt from "bcryptjs";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectedToDatabase();

    // ✅ Auth check
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "superadmin") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    // ✅ Extract params and body
    const { id } = params;
    const { newPassword } = await req.json();

    if (!id || !newPassword) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ✅ Find admin
    const existingAdmin = await Admin.findById(id);
    if (!existingAdmin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    // ✅ Hash for login & encrypt for viewing
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    const encryptedPassword = encrypt(newPassword);

    existingAdmin.password = hashedPassword;           // for login
    existingAdmin.encryptedPassword = encryptedPassword; // for superadmin view

    await existingAdmin.save();

    return NextResponse.json(
      { message: `Password updated successfully for ${existingAdmin.name}` },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating password:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
