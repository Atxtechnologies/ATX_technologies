// "use client";

// import { useState, useEffect } from "react";
// import CreateAdminForm from "@/components/Admin/multipleadmincreationform/adminform";

// export default function AdminDashboard() {
//   const [admins, setAdmins] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [visiblePasswords, setVisiblePasswords] = useState<{ [key: string]: boolean }>({});


//   const fetchAdmins = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch("/api/multipleemploy",{cache:"no-store"});
//       const data = await res.json();
//       if (res.ok) setAdmins(data.admins || []);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id: string) => {
//     if (!confirm("Are you sure you want to delete this employee?")) return;
//     try {
//       const res = await fetch(`/api/multipleemploy?id=${id}`, { method: "DELETE" });
//       if (res.ok) fetchAdmins();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchAdmins();  
//   }, []);

//   const handlePasswordChange = async (id: string) => {
//   const newPassword = prompt("Enter new password for this admin:");
//   if (!newPassword) return alert("Password cannot be empty!");

//   try {
//     const res = await fetch(`/api/multipleemploy/${id}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ id, newPassword }),
//     });

//     const data = await res.json();
//     if (res.ok) {
//       alert("Password updated successfully!");
//     } else {
//       alert(data.error || "Failed to update password");
//     }
//   } catch (err) {
//     console.error(err);
//     alert("Something went wrong while updating password");
//   }
// };


//   return (
//     <div className="p-6 max-w-5xl mx-auto">
//       {/* Create Admin Form */}
//       <CreateAdminForm onSuccess={fetchAdmins} />

//       {/* Admin List */}
//       <div className="bg-white shadow-lg rounded-xl p-6">
//         <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Employer List</h2>

//         {loading ? (
//           <p className="text-center text-gray-500">Loading employees...</p>
//         ) : admins.length === 0 ? (
//           <p className="text-center text-gray-500">No employees created yet.</p>
//         ) : (
//           <ul className="divide-y divide-gray-200">
//             {admins.map((admin) => (
//               <li
//   key={admin._id}
//   className="flex justify-between items-center py-3 px-4 hover:bg-gray-50 rounded-md transition"
// >
//   <div>
//     <p className="font-medium text-gray-800">{admin.name}</p>
//     <p className="text-gray-500 text-sm">{admin.email}</p>
//     <p className="text-gray-500 text-sm">{admin.phone}</p>
//   </div>
//   <div className="flex gap-4">
//     <button
//       className="text-blue-600 font-medium hover:text-blue-800 transition"
//       onClick={() => handlePasswordChange(admin._id)}
//     >
//       Change Password
//     </button>
//     <button
//       className="text-red-600 font-medium hover:text-red-800 transition"
//       onClick={() => handleDelete(admin._id)}
//     >
//       Delete
//     </button>
//   </div>
// </li>

//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import CreateAdminForm from "@/components/Admin/multipleadmincreationform/adminform";
import { Eye, EyeOff } from "lucide-react";

export default function AdminDashboard() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState<{ [key: string]: boolean }>({});
  const [selectedAdmin, setSelectedAdmin] = useState<any | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [updating, setUpdating] = useState(false);

  // ✅ Fetch all admins
  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/multipleemploy", { cache: "no-store" });
      const data = await res.json();
      if (res.ok) setAdmins(data.admins || []);
      else console.error("Fetch admins failed:", data);
    } catch (err) {
      console.error("Error fetching admins:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete admin
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this employee?")) return;
    try {
      const res = await fetch(`/api/multipleemploy?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchAdmins();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete admin");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while deleting admin");
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // ✅ Toggle showing decrypted password
  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // ✅ Open change password modal
  const openChangePasswordModal = (admin: any) => {
    setSelectedAdmin(admin);
    setNewPassword("");
    setShowPassword(false);
  };

  // ✅ Close modal
  const closeModal = () => {
    setSelectedAdmin(null);
    setNewPassword("");
    setShowPassword(false);
  };

  // ✅ Submit password change (PUT -> /api/multipleemploy/[id])
  const submitPasswordChange = async () => {
    if (!newPassword.trim()) {
      alert("Password cannot be empty!");
      return;
    }

    try {
      setUpdating(true);
      const res = await fetch(`/api/multipleemploy/${selectedAdmin._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });

      // Defensive parsing in case server sends empty body
      let data;
      try {
        data = await res.json();
      } catch {
        data = { error: "Invalid JSON response from server" };
      }

      if (res.ok) {
        alert(data.message || "Password updated successfully!");
        closeModal();
        fetchAdmins();
      } else {
        alert(data.error || "Failed to update password");
      }
    } catch (err) {
      console.error("Error updating password:", err);
      alert("Something went wrong while updating password");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Create Admin Form */}
      <CreateAdminForm onSuccess={fetchAdmins} />

      {/* Admin List */}
      <div className="bg-white shadow-lg rounded-xl p-6 mt-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
          Employer List
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading employees...</p>
        ) : admins.length === 0 ? (
          <p className="text-center text-gray-500">No employees created yet.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {admins.map((admin) => (
              <li
                key={admin._id}
                className="flex justify-between items-center py-3 px-4 hover:bg-gray-50 rounded-md transition"
              >
                <div>
                  <p className="font-medium text-gray-800">{admin.name}</p>
                  <p className="text-gray-500 text-sm">{admin.email}</p>
                  <p className="text-gray-500 text-sm">{admin.phone}</p>

                  {/* Password section (only for superadmin) */}
                  {typeof admin.password !== "undefined" && (
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-gray-600 text-sm">
                        {visiblePasswords[admin._id]
                          ? admin.password
                          : "••••••••••"}
                      </p>
                      <button
                        className="text-gray-600 hover:text-gray-800"
                        onClick={() => togglePasswordVisibility(admin._id)}
                        aria-label={
                          visiblePasswords[admin._id]
                            ? "Hide password"
                            : "View password"
                        }
                      >
                        {visiblePasswords[admin._id] ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <button
                    className="text-blue-600 font-medium hover:text-blue-800 transition"
                    onClick={() => openChangePasswordModal(admin)}
                  >
                    Change Password
                  </button>
                  <button
                    className="text-red-600 font-medium hover:text-red-800 transition"
                    onClick={() => handleDelete(admin._id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Password Change Modal */}
      {selectedAdmin && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl p-6 w-96 shadow-lg relative">
            <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">
              Change Password for {selectedAdmin.name}
            </h2>

            {/* Password input */}
            <div className="relative mb-4">
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="border border-gray-300 rounded-lg w-full p-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                disabled={updating}
                onClick={submitPasswordChange}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {updating ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
