/*import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET);


const payment = async (number, cvc, exp_month, exp_year, amount) => {
    try {
        const paymentMethod = await stripe.paymentMethods.create({
            type: 'card',
            card: {
                number: number,
                exp_month: exp_month,
                exp_year: exp_year,
                cvc: cvc
            }
        });

        const paymentIntents = await stripe.paymentIntents.create({
            amount: amount * 100,
            currency: 'USD',
            payment_method: paymentMethod.id,
            confirm: true,
            return_url: "http://localhost:3000/"
        });

        return paymentIntents;

    } catch (error) {
        console.log(error.message);
        throw error; // Re-throw the error or return a meaningful response
    }
};

export default payment; */