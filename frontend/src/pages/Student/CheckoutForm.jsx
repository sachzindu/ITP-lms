import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useAddStudentToClassMutation } from '../../redux/api/usersApiSlice';
import { toast } from 'react-toastify';
import { useMakePaymentMutation } from '../../redux/api/classesApiSlice';
import { useSelector } from 'react-redux';

const CARD_ELEMENT_OPTIONS = {
    style: {
        base: {
            color: '#32325d',
            fontFamily: '"Inter", sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': {
                color: '#a0aec0',
            },
        },
        invalid: {
            color: '#e53e3e',
        },
    },
};

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [cardholderName, setCardholderName] = useState('');
    const [email, setEmail] = useState('');

    const { classIdInfo } = useSelector(state => state.classId);
    const { userInfo } = useSelector(state => state.auth);
    const [addStudentToClass] = useAddStudentToClassMutation();
    const [makePayment] = useMakePaymentMutation();

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    

    const handleStudentAdd = async () => {
        try {
            const body = {
                classId: classIdInfo,
                userDetail: userInfo._id
            };
            const result = await addStudentToClass(body).unwrap();
            if (!result) {
                toast.error("Error adding student to class");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        if (!cardholderName || !email) {
            setMessage("Please fill in all required fields.");
            return;
        }
        
        if (!isValidEmail(email)) {
            setMessage("Please enter a valid email address.");
            return;
        }
        

        setLoading(true);
        setMessage('');

        const cardElement = elements.getElement(CardElement);

        try {
            const res = await makePayment({ amount: 15 }).unwrap();

            const result = await stripe.confirmCardPayment(res.clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: {
                        name: cardholderName,
                        email: email,
                    },
                },
            });

            if (result.error) {
                setMessage(result.error.message);
            } else if (result.paymentIntent.status === 'succeeded') {
                setMessage('✅ Payment successful!');
                await handleStudentAdd();
                toast.success("Payment successful and student added!");
            }
        } catch (err) {
            setMessage('❌ Payment failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-[#eeeee4]">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-lg space-y-6"
            >
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">Secure Payment</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Cardholder's Name<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={cardholderName}
                            onChange={(e) => setCardholderName(e.target.value)}
                            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., John Doe"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., john@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Card Details<span className="text-red-500">*</span>
                        </label>
                        <div className="border rounded-lg px-4 py-3 shadow-inner">
                            <CardElement options={CARD_ELEMENT_OPTIONS} />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={!stripe || loading}
                    className={`w-full py-3 px-4 rounded-xl text-white font-semibold text-lg transition 
                        ${loading || !stripe ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                    {loading ? 'Processing...' : 'Pay Rs. 3500.00'}
                </button>

                {message && (
                    <div
                        className={`text-center text-sm font-medium mt-2 ${
                            message.includes('success') ? 'text-green-600' : 'text-red-600'
                        }`}
                    >
                        {message}
                    </div>
                )}
            </form>
        </div>
    );
};

export default CheckoutForm;
