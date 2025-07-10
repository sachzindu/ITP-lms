import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useVerifyEmailMutation, useResendOtpMutation } from "../../redux/api/usersApiSlice.js";

const EmailVerification = () => {
  const [otp, setOtp] = useState("");  // Store OTP input from the user
  const [message, setMessage] = useState("");  // Store response message for verification
  const [resendMessage, setResendMessage] = useState("");  // Store response message for resend OTP

  const navigate = useNavigate();
  const location = useLocation();

  // Get email from location state passed after registration
  const email = location.state?.email;

  // API mutation hooks
  const [verifyEmail, { isLoading: isVerifying }] = useVerifyEmailMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

  // Log email to ensure it's passed correctly
  console.log("Email from location state:", email);

  // Handle Email verification
  const handleVerify = async () => {
    if (!otp) {
      setMessage("Please enter the OTP.");
      return;
    }

    try {
      // Call the verifyEmail mutation with both the email and OTP
      const res = await verifyEmail({ email, otp }).unwrap();
      console.log("Verify Email Response:", res);  // Log the response for debugging
      setMessage(res.message || "Email verified successfully");
      // Navigate to login page after 2 seconds
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.log("Error in verifyEmail:", err);  // Log error details
      setMessage(err?.data?.message || "Verification failed");
    }
  };

  // Handle Resending OTP
  const handleResend = async () => {
    try {
      // Call the resendOtp mutation with the email
      const res = await resendOtp({ email }).unwrap();
      console.log("Resend OTP Response:", res);  // Log the response for debugging
      setResendMessage(res.message || "OTP resent successfully");
    } catch (err) {
      console.log("Error in resendOtp:", err);  // Log error details
      setResendMessage(err?.data?.message || "Failed to resend OTP");
    }
  };

  // If email is not available, show an error
  if (!email) return <p className="text-center mt-10 text-red-600">Email not provided</p>;

  return (
    <div className="max-w-md mx-auto mt-12 p-6 border shadow rounded-xl">
      <h2 className="text-xl font-bold mb-4">Verify Your Email</h2>
      <p className="text-gray-600 mb-2">
        An OTP has been sent to: <strong>{email}</strong>
      </p>

      {/* OTP input field */}
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
        className="w-full p-2 border rounded mb-4"
      />

      {/* Verify button */}
      <button
        onClick={handleVerify}
        className="w-full bg-blue-600 text-white py-2 rounded mb-2"
        disabled={isVerifying}
      >
        {isVerifying ? "Verifying..." : "Verify"}
      </button>

      {/* Resend OTP button */}
      <button
        onClick={handleResend}
        className="w-full text-blue-500 underline"
        disabled={isResending}
      >
        {isResending ? "Resending..." : "Resend OTP"}
      </button>

      {/* Error or success message for verification */}
      {message && <p className="mt-4 text-sm text-red-600">{message}</p>}

      {/* Success or error message for resend OTP */}
      {resendMessage && <p className="mt-2 text-sm text-green-600">{resendMessage}</p>}
    </div>
  );
};

export default EmailVerification;
