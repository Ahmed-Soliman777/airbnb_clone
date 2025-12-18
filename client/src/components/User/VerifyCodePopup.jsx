import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { verifyResetCode } from "../../store/Slices/authslice";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function VerifyCodePopup({ onClose }) {
  const dispatch = useDispatch();
  const { loading, error, resetEmail } = useSelector((state) => state.auth);
  const { register, handleSubmit, formState: { errors } } = useForm();
const navigate = useNavigate();

  const [successMessage, setSuccessMessage] = useState("");

  const onSubmit = async (data) => {
    const res = await dispatch(
      verifyResetCode({ code: data.code, email: resetEmail })
    );

    if (res.meta.requestStatus === "fulfilled") {
      setSuccessMessage(" Code verified. You can reset your password.");
        navigate("/reset-password");
      
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-xl relative">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold text-center mb-4">
          Enter Verification Code
        </h2>

        <p className="text-sm text-gray-600 mb-3 text-center">
          We sent a verification code to:
          <span className="font-semibold text-black"> {resetEmail}</span>
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">

          {/* CODE INPUT */}
          <input
            type="text"
            {...register("code", {
              required: "Code is required",
              minLength: { value: 6, message: "Code must be 6 characters" },
            })}
            className="w-full p-2 border rounded-md text-center tracking-widest text-xl"
            placeholder="XXXXXX"
            maxLength={6}
          />

          {errors.code && (
            <p className="text-red-500 text-sm">{errors.code.message}</p>
          )}

          {/* Server Error */}
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          {/* Success Message */}
          {successMessage && (
            <p className="text-green-600 text-sm text-center">{successMessage}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-md"
          >
            {loading ? "Verifying..." : "Verify Code"}
          </button>
        </form>
      </div>
    </div>
  );
}
