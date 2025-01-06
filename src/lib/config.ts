import Stripe from "stripe";
import { Resend } from "resend";

export const stripe = new Stripe(process.env.STRIPE_API_SECRET!);
export const resend = new Resend(process.env.RESEND_API_KEY!);
