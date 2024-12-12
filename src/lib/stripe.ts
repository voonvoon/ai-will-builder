import {env} from '@/env';
import Stripe from 'stripe';


//add ! cuz it mihgt be null / undefined
const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export default stripe;
    