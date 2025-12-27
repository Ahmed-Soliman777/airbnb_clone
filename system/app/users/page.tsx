"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const Users = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/users");
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const GuestToAdminBtn = async (userId: string) => {
        try {
            await axios.put(`http://localhost:3000/api/users/${userId}`, {
                role: "admin",
            });
            toast.success("User role updated successfully");
            fetchUsers();
        } catch (error) {
            console.error("Error updating user role:", error);
            toast.error("Error updating user role");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <>
            <Toaster position="top-center" />
            <div
                className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
                style={{
                    backgroundImage:
                        "url('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267')",
                }}
            >
                <div className="absolute inset-0 bg-black/40"></div>

                <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm text-center">
                    <h2 className="text-2xl font-semibold text-gray-900">
                        {users[users.length - 1].name}
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        {users[users.length - 1].email}
                    </p>

                    <span className="inline-block mt-3 px-4 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-700">
                        {users[users.length - 1].role}
                    </span>

                    <button
                        onClick={() =>
                            GuestToAdminBtn(users[users.length - 1]._id)
                        }
                        className="mt-6 w-full bg-[#FF385C] hover:bg-[#e03150] transition text-white py-3 rounded-xl font-medium"
                    >
                        Verify & Switch to Admin
                    </button>
                </div>
            </div>
        </>


    );
};

export default Users;
