// app/api/multipleemploy/route.ts
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectedToDatabase } from "@/lib/db";
import Admin from "@/models/admin";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { decrypt, encrypt } from "@/lib/encryption";

export async function POST(req: NextRequest) {
  try {
    await connectedToDatabase();
    const session = await getServerSession(authOptions);
    

    // Only superadmin can create admins
    if (!session || session.user.role !== "superadmin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { name, email, password, phone } = await req.json();
    console.log("Creating admin with phone:", phone);

    // ✅ Validate email domain
if (!email.endsWith("@atxtechnologies.com")) {
  return NextResponse.json(
    { error: "Email must be @atxtechnologies.com" },
    { status: 400 }
  );
}

    if (!name || !email || !password ) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return NextResponse.json({ error: "Admin already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const encryptedPassword = encrypt(password);

    const newAdmin = await Admin.create({
      name,
      email,
      password: hashedPassword,
      encryptedPassword,
      phone: phone?.trim() || "",
      role: "admin",
    });

    const { password: _, ...adminWithoutPassword } = newAdmin.toObject();

    return NextResponse.json({ message: "Admin created successfully", admin: adminWithoutPassword }, { status: 201 });

  } catch (err) {
    console.error("Admin creation error:", err);
    
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
  
}



export async function GET(req: NextRequest) {
  try {
    await connectedToDatabase();
    const session = await getServerSession(authOptions);

    // ✅ 1. Only superadmin or admin can access
    if (!session || !["superadmin", "admin"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // ✅ 2. Fetch all admins including encryptedPassword
    const adminsFromDB = await Admin.find(
      {},
      "name email phone role encryptedPassword createdAt"
    ).sort({ createdAt: -1 });

    let admins;

    // ✅ 3. If superadmin, decrypt each encrypted password safely
    if (session.user.role === "superadmin") {
      admins = adminsFromDB.map((adminDoc) => {
        const admin = adminDoc.toObject();
        try {
          if (typeof admin.encryptedPassword === "string") {
            admin.password = decrypt(admin.encryptedPassword); // 👈 decrypt properly
            admin._pwStatus = "ok";
          } else {
            admin.password = undefined;
            admin._pwStatus = "missing";
          }
        } catch (err) {
          admin.password = undefined;
          admin._pwStatus = "decrypt-error";
        }
        return admin;
      });
    } else {
      // ✅ 4. Regular admins don’t get passwords
      admins = adminsFromDB.map((adminDoc) => ({
        ...adminDoc.toObject(),
        password: undefined,
      }));
    }

    // ✅ 5. Return admins safely
    return NextResponse.json({ admins }, { status: 200 });
  } catch (err: any) {
    console.error("Fetching admins error:", err.message || err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}



export async function DELETE(req: NextRequest) {
  try {
    await connectedToDatabase();
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "superadmin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Admin ID required" }, { status: 400 });

    await Admin.findByIdAndDelete(id);
    return NextResponse.json({ message: "Admin deleted successfully" }, { status: 200 });

  } catch (err) {
    console.error("Deleting admin error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
