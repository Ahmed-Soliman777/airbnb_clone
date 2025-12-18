import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { sendResetCode, verifyResetCode } from "../store/Slices/authslice";
import { Link } from "react-router-dom";
import { useState } from "react";
import VerifyCodePopup from "../components/User/VerifyCodePopup";

export default function ForgetPassword() {
  const dispatch = useDispatch();
  const { loading, error, successMessage } = useSelector((state) => state.auth);
  const [openVerifyPopup, setOpenVerifyPopup] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    dispatch(verifyResetCode(data.email));

    const res = await dispatch(sendResetCode({ email: data.email }));

    if (res.meta.requestStatus === "fulfilled") {
      setOpenVerifyPopup(true);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl border border-[#717171] w-full max-w-lg">
        
        <h2 className="text-2xl font-semibold text-center mb-6">Forgot Password?</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Email */}
          <div>
            <span className="text-xs">Enter your email to receive reset code.</span>

            <input
              type="email"
              {...register("email", {
                required: "Email is required",
              })}
              className="w-full p-2 border rounded-md"
              placeholder="Enter your email"
            />

            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Server Error */}
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          {/* Success */}
          {successMessage && (
            <p className="text-green-600 text-sm text-center">{successMessage}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-md"
          >
            {loading ? "Sending..." : "Send Reset Code"}
          </button>
        </form>

        {/* Login Link */}
        <div className="text-sm text-center mt-4">
          <p>
            Remember your password?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>

      {openVerifyPopup && (
        <VerifyCodePopup onClose={() => setOpenVerifyPopup(false)} />
      )}
      
    </div>
  );
}
