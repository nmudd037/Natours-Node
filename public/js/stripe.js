/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe('pk_test_51HmF1ZHKKrM3eod8zPSxp5u3dODoTDqhCEtvEIZJxM6GRrZwRjGUSNQDkMMJP3w4dKZIkYQ4Fjb1hbf7o0AuHa5B00elFGsL7U');

export const bookTour = async (tourId) => {
    try {
        // 1) Get the checkout session from API
        //const session = await axios(`http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`);
        const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
        //console.log(session);

        // 2) Create checkout form + Charge Credit Card
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        });

    } catch (err) {
        console.log(err);
        showAlert('error', err);
    }
    
};