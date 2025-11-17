import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { forgetPassword } from "../store/Slices/authslice";
import { Link } from "react-router-dom";

export default function ForgetPassword() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = useForm();

  const onSubmit = (data) => {
    dispatch(forgetPassword(data));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl border border-[#717171] w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Forgot Password?</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* email field */}
          <div>
            <span className="text-xs">Enter the email address associated with your account, and we’ll email you a link to reset your password.</span>
           
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email address",
                },
              })}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
               placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/*  error Message from Server */}
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          {/* Success Message */}
          {isSubmitSuccessful && !error && (
            <p className="text-green-600 text-sm text-center">
              If the email exists, a reset link has been sent.
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black hover:bg-[#e61e4d] text-white py-2 rounded-md transition duration-200 disabled:opacity-50"
          >
            {loading ? "Sending.." : "Send Reset Link"}
          </button>
        </form>

        {/* Links */}
        <div className="text-sm text-center mt-4">
          <p>
            Remember your password?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
