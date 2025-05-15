
import Stripe from 'stripe';
const stripe = new Stripe("sk_test_51RJZwZQ7yi5s2jxjTSip2jgDl5Jj3BggqwknFKlbxtLW4Rcw48USizdwqLh36WrLjPT77WnD2vi4rwHpIY8dxeRT00XMVkMw3j");


// Route to create PaymentIntent
const stripepayment= async (req, res) => {
    const { amount } = req.body; // amount in dollars (e.g., 10)

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // convert dollars to cents
            currency: 'usd',
        });

        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export default stripepayment;


