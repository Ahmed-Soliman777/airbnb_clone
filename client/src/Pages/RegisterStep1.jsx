
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

const emailSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

const RegisterStep1 = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(emailSchema),
  });

  const onSubmit = (data) => {
    localStorage.setItem("registerEmail", data.email);
    navigate("/register");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white w-full max-w-lg p-8 rounded-2xl border border-[#717171]">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
         Login or sign up
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-1 text-lg font-medium">Welcome to Airbnb</label>
            <input
              type="email"
              {...register("email")}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your Email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#ff385c] text-white py-2 rounded-lg hover:bg-[#e61e4d] transition duration-200"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterStep1;
