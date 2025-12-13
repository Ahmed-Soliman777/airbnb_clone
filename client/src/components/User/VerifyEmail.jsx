import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { verifyEmail, resendVerification } from "../../store/Slices/authslice";
import { useNavigate } from "react-router-dom";

export default function VerifyEmail({ isOpen = true, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error,success } = useSelector((state) => state.auth);
const savedEmail = localStorage.getItem("registerEmail");


  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = useForm();

  const onSubmit = (data) => {
    dispatch(verifyEmail({ email: savedEmail, code: data.verificationCode })).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        navigate("/");
      }
    });
  };

  const handleResend = () => {
    dispatch(resendVerification({ email: savedEmail }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">

      {/* Modal Card */}
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 relative">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
        >
          ×
        </button>

        <h2 className="text-2xl font-semibold text-center mb-6">
          Verify Your Email
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Verification Code
            </label>
            <input
              type="text"
              {...register("verificationCode", {
                required: "Verification code is required",
                minLength: {
                  value: 6,
                  message: "Code must be at least 6 digits",
                },
              })}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your code"
            />
            {errors.code && (
              <p className="text-red-500 text-sm mt-1">{errors.code.message}</p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-600 text-sm text-center">{error}</p>
          )}

          {/* Success Message */}
          {isSubmitSuccessful && !error && (
            <p className="text-green-600 text-sm text-center">
              Email verified successfully!
            </p>
          )}
          {success && (
  <p className="text-green-600 text-sm text-center">{success}</p>
)}


          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md transition duration-200 disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        {/* Resend */}
        <div className="text-sm text-center mt-4">
          <button
            onClick={handleResend}
            disabled={loading}
            className="text-blue-600 hover:underline disabled:opacity-50"
          >
            {loading ? "Resending..." : "Resend Code"}
          </button>
        </div>
      </div>
    </div>
  );
}
