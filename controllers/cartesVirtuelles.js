const stripe = require('stripe')("sk_test_51MAGguJ2JAuxnWO5kx1cTp0UxqSudEYhMN9ILrIwrVUgdeR8j1OtCztr5T3xDwGpASUdLzhRVeODJKZILbWHtE6W005nHdB4yd")

const createUserStripe = async (req, res) => {
    try {
        const cardholder = await stripe.issuing.cardholders.create({
            type: 'individual',
            name: 'Jenny Rosen',
            email: 'jenny.rosen@example.com',
            phone_number: '+18888675309',
            billing: {
                address: {
                    line1: '1234 Main Street',
                    city: 'San Francisco',
                    state: 'CA',
                    country: 'US',
                    postal_code: '94111',
                },
            },
        });

        if (cardholder) {
            res.status(201).json(cardholder)
        }
    } catch (error) {
        return res.status(500).json(error)
    }
}

module.exports = {
    createUserStripe
}