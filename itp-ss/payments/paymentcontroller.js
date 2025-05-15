import { Router } from 'express';
const router = Router();
const payment = require('./payments');


router.post('/payment', async (req, res, next) => {
    const { number, amount, cvc, exp_month, exp_year } = req.body;
    const { error: validationError } = validateCard(req.body);
    
    try {
        // Check for validation error
        if (validationError) {
            const error = new Error(validationError.details[0].message);
            error.statusCode = 400;
            throw error;
        }

        const result = await payment(number, cvc, exp_month, exp_year, amount);
        
        // Check if payment was successful
        if (!result) {
            const error = new Error("Payment processing failed");
            error.statusCode = 500;
            throw error;
        }
        
        console.log(result);
        res.status(200).json({ message: "Success", paymentId: result.id });
        
    } catch (error) {
        next(error);
    }
});

function validateCard(data) {
    const cardSchema = joi.object({
        number: joi.string().pattern(/^[0-9]{13,19}$/).required()
            .messages({
                'string.pattern.base': 'Card number must be between 13 and 19 digits'
            }),
        cvc: joi.string().pattern(/^[0-9]{3,4}$/).required()
            .messages({
                'string.pattern.base': 'CVC must be 3 or 4 digits'
            }),
        exp_month: joi.string().pattern(/^(0[1-9]|1[0-2])$/).required()
            .messages({
                'string.pattern.base': 'Expiration month must be between 01 and 12'
            }),
        exp_year: joi.string().pattern(/^[0-9]{2}$/).required()
            .messages({
                'string.pattern.base': 'Expiration year must be 2 digits'
            }),
        amount: joi.number().positive().required()
            .messages({
                'number.base': 'Amount must be a number',
                'number.positive': 'Amount must be positive'
            })
    });
    
    return cardSchema.validate(data);
}

// Export the router
export default router;