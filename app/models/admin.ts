import mongoose, { Schema, Document } from "mongoose";

// Define allowed role types
export type AdminRole = "admin" | "superadmin";

export interface IAdmin extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: AdminRole;
  encryptedPassword: { type: String, required: false }

}

const AdminSchema = new Schema<IAdmin>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    encryptedPassword: { type: String, required: false },
    role: {
      type: String,
      enum: ["admin", "superadmin"], // ✅ strict role values
      default: "admin",              // ✅ fallback if not provided
    },
  },
  { timestamps: true }
);

export default mongoose.models.Admin ||
  mongoose.model<IAdmin>("Admin", AdminSchema);
