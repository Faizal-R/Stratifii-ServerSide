import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config({ path: "src/.env" });

 const stripe = new Stripe(process.env.STRIPE_SECRET_API_KEY!);
 export default stripe
