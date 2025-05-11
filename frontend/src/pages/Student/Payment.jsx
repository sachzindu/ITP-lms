import { useState } from 'react';
import { CreditCard, Calendar, User, Lock } from 'lucide-react';
import { toast } from 'react-toastify';
import { useMakePaymentMutation } from '../../redux/api/classesApiSlice';

export default function PaymentForm() {
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    saveCard: false
  });
  
  const [cardType, setCardType] = useState(null);
  const [makePayment]=useMakePaymentMutation();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async(e) => {

   let {cardNumber,cardName,expiryDate,cvv}=formData;
   cardNumber=cardNumber.replace(/\s+/g,"");
   expiryDate=expiryDate.trim();
   cvv=cvv.trim();
   const [expmonth, expyear] = expiryDate.split("/");


    try{
        const result=await makePayment({number:cardNumber,cvc:cvv,exp_month:expmonth,exp_year:expyear,amount:"555"}).unwrap();
        if (result){

            toast.success("Success");
        }
        

    }catch(error){
        toast.error("Payment failed");
    }
    
    
  };

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Detect card type based on card number
  const detectCardType = (cardNumber) => {
    const visaRegex = /^4/;
    const mastercardRegex = /^5[1-5]/;
    
    // Remove spaces for proper detection
    const cleanCardNumber = cardNumber.replace(/\s+/g, '');
    
    if (visaRegex.test(cleanCardNumber)) {
      return 'visa';
    } else if (mastercardRegex.test(cleanCardNumber)) {
      return 'mastercard';
    } else {
      return null;
    }
  };

  const handleCardNumberChange = (e) => {
    const formattedValue = formatCardNumber(e.target.value);
    setFormData(prev => ({ ...prev, cardNumber: formattedValue }));
    
    // Detect and set card type
    const detectedType = detectCardType(formattedValue);
    setCardType(detectedType);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-4 px-6">
        <h2 className="text-white text-xl font-semibold">Payment Details</h2>
      </div>
      
      <div className="px-6 py-8">
        <div className="space-y-6">
          {/* Card Number */}
          <div className="space-y-1">
            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
              Card Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CreditCard className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleCardNumberChange}
                placeholder="1234 5678 9012 3456"
                maxLength="19"
                className="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
              {cardType && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  {cardType === 'visa' ? (
                    <svg className="h-6 w-6" viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="36" height="24" rx="4" fill="#F9F9F9" />
                      <path d="M15.2 15.5H12.9L14.3 8.5H16.6L15.2 15.5Z" fill="#00579F" />
                      <path d="M21.7 8.7C21.1 8.5 20.3 8.3 19.3 8.3C17.1 8.3 15.5 9.5 15.5 11.2C15.5 12.5 16.6 13.2 17.5 13.6C18.4 14 18.7 14.3 18.7 14.7C18.7 15.3 18 15.6 17.3 15.6C16.4 15.6 15.9 15.5 15.1 15.2L14.8 15.1L14.5 17.1C15.2 17.4 16.4 17.6 17.6 17.6C19.9 17.6 21.5 16.4 21.5 14.6C21.5 13.5 20.8 12.7 19.5 12.2C18.7 11.9 18.2 11.6 18.2 11.2C18.2 10.8 18.6 10.4 19.5 10.4C20.2 10.4 20.8 10.5 21.2 10.7L21.4 10.8L21.7 8.7Z" fill="#00579F" />
                      <path d="M24.9 8.5H23.1C22.7 8.5 22.3 8.6 22.1 9L19.6 15.5H21.9C21.9 15.5 22.2 14.7 22.3 14.4C22.6 14.4 24.6 14.4 25 14.4C25.1 14.8 25.2 15.5 25.2 15.5H27.2L25.4 8.5H24.9ZM22.9 12.8C23.1 12.3 23.7 10.8 23.7 10.8C23.7 10.8 23.8 10.5 23.9 10.3L24 10.8C24 10.8 24.4 12.4 24.5 12.8H22.9Z" fill="#00579F" />
                      <path d="M11.3 8.5L9.2 13.4L9 12.3C8.6 11.1 7.5 10 6.3 9.4L8.2 15.5H10.5L14 8.5H11.3Z" fill="#00579F" />
                      <path d="M7.9 8.5H4.5L4.4 8.7C7.1 9.4 9 10.8 9.8 12.3L9.1 9C8.9 8.6 8.5 8.5 7.9 8.5Z" fill="#FAA61A" />
                    </svg>
                  ) : cardType === 'mastercard' ? (
                    <svg className="h-6 w-6" viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="36" height="24" rx="4" fill="#F9F9F9" />
                      <path d="M21.3 5H14.7V19H21.3V5Z" fill="#FF5F00" />
                      <path d="M15.3 12C15.3 9.2 16.7 6.7 18.8 5C17.1 3.7 15.1 3 12.9 3C7.9 3 4 7 4 12C4 17 7.9 21 12.9 21C15.1 21 17.1 20.3 18.8 19C16.7 17.3 15.3 14.8 15.3 12Z" fill="#EB001B" />
                      <path d="M32 12C32 17 28.1 21 23.1 21C20.9 21 18.9 20.3 17.2 19C19.3 17.3 20.8 14.8 20.8 12C20.8 9.2 19.4 6.7 17.2 5C18.9 3.7 20.9 3 23.1 3C28.1 3 32 7 32 12Z" fill="#F79E1B" />
                    </svg>
                  ) : null}
                </div>
              )}
            </div>
          </div>

          {/* Card Holder */}
          <div className="space-y-1">
            <label htmlFor="cardName" className="block text-sm font-medium text-gray-700">
              Card Holder Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="cardName"
                name="cardName"
                value={formData.cardName}
                onChange={handleInputChange}
                placeholder="John Doe"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Expiry and CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                Expiry Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="expiryDate"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  placeholder="MM/YY"
                  maxLength="5"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
                CVV
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  placeholder="123"
                  maxLength="4"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Save Card */}
          <div className="flex items-center">
            <input
              id="saveCard"
              name="saveCard"
              type="checkbox"
              checked={formData.saveCard}
              onChange={handleInputChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="saveCard" className="ml-2 block text-sm text-gray-700">
              Save card for future payments
            </label>
          </div>
        </div>

        {/* Payment Details Summary */}
        <div className="mt-6 bg-gray-50 p-4 rounded-md">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Subtotal</span>
            <span className="text-sm font-medium">$99.00</span>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-sm text-gray-500">Tax</span>
            <span className="text-sm font-medium">$9.90</span>
          </div>
          <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between">
            <span className="text-base font-medium text-gray-900">Total</span>
            <span className="text-base font-medium text-indigo-600">$108.90</span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            onClick={handleSubmit}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
}