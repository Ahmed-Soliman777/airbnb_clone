"use client"
import { useState } from "react";
import Image from "next/image";
import { registerSchema } from "./utils/validationSchema";
import { RegisterDto } from "@/types/dtos";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import myBackgroundImage from "../public/airbnb.jpg";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterDto>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const validateData = registerSchema.safeParse(formData);

    if (!validateData.success) {
      const newErrors: Record<string, string> = {};
      validateData.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          newErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setErrors(newErrors);
      console.log("Validation errors:", newErrors);
    } else {
      console.log("Form is valid!", validateData.data);
      setErrors({});
      try {
        const requestData = {
          ...validateData.data,
          role: "admin",
          isVerified: true,
        };
        const response = await axios.post(
          "http://localhost:3000/api/register",
          requestData
        );
        router.push("/users");
        toast.success("User registered successfully");
        // console.log(response.data);
      } catch (error) {
        toast.error("User registration failed");
        console.error(error);
      }
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center font-sans">
      <Image
        src={myBackgroundImage}
        alt="Background image"
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/40" />

      <Toaster position="top-center" />

      <main className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-2xl px-10 py-12">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
          Airbnb Clone System
        </h1>
        <p className="text-gray-500 mb-8">
          Create your administrator account
        </p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First name"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm
              focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20 outline-none"
              />
              {errors.firstName && (
                <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>
              )}
            </div>

            <div>
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last name"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm
              focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20 outline-none"
              />
              {errors.lastName && (
                <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email address"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm
            focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20 outline-none"
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm
            focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20 outline-none"
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm
            focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20 outline-none"
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-500 mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* <input
            value="Admin"
            disabled
            className="w-full rounded-lg bg-gray-100 border border-gray-200 px-4 py-3
          text-sm text-gray-600"
          /> */}

          <button
            type="submit"
            className="w-full rounded-lg bg-gradient-to-r from-[#FF385C] to-[#E31C5F]
          py-3 text-white font-medium text-sm hover:opacity-90 transition
          focus:ring-4 focus:ring-[#FF385C]/30"
          >
            Create account
          </button>
        </form>
      </main>
    </div>
  );

}
