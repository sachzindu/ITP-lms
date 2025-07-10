import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const VerifyOtp = () => {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/users/verifyResetOtp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Invalid OTP');

            toast.success('OTP verified');
            navigate('/reset-password', { state: { email } });
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-100 to-white px-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm transition-all duration-300"
            >
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Verify OTP</h2>
                <p className="text-sm text-center text-gray-500 mb-6">
                    Enter the 6-digit code sent to your email.
                </p>

                <input
                    type="text"
                    placeholder="Enter OTP"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-5 text-center tracking-widest font-mono text-lg"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    maxLength={6}
                    pattern="[0-9]*"
                    inputMode="numeric"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition duration-200"
                >
                    {loading ? (
                        <span className="flex justify-center items-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                            </svg>
                            Verifying...
                        </span>
                    ) : (
                        'Verify'
                    )}
                </button>
            </form>
        </div>
    );
};

export default VerifyOtp;
