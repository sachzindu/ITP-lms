import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';

const stripePromise = loadStripe('pk_test_51RJZwZQ7yi5s2jxjb99NNbzL0fuRQXIsjKGyt8KXqPAFPYMROfjVKMmPutc4jFizp4Ke76su1Q2M0z0nOjr2wTCv00j6cAjJov');

const PForm = () => (
    <Elements stripe={stripePromise}>
        <CheckoutForm />
    </Elements>
);

export default PForm;
