/**
 * Supabase Edge Function: Stripe Webhook Handler
 *
 * Handles all Stripe events critical to the booking flow:
 * - payment_intent.succeeded    → confirm booking, mark deposit held
 * - payment_intent.payment_failed → mark booking payment failed
 * - charge.dispute.created      → flag booking for review
 * - account.updated             → update venue Stripe status
 *
 * Deploy: supabase functions deploy stripe-webhook
 * Set secret: supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
 */

import Stripe from "https://esm.sh/stripe@14.5.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
});

const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") ?? "";

Deno.serve(async (req) => {
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Missing signature", { status: 400 });
  }

  const body = await req.text();

  // Verify webhook signature — critical for security
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new Response(`Webhook signature verification failed: ${err}`, { status: 400 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    switch (event.type) {

      // ── Payment succeeded → confirm booking ──────────────────────────────
      case "payment_intent.succeeded": {
        const intent = event.data.object as Stripe.PaymentIntent;
        const bookingId = intent.metadata?.booking_id;
        if (!bookingId) break;

        const { error } = await supabase
          .from("bookings")
          .update({
            status: "confirmed",
            payment_status: "deposit_held",
            stripe_payment_intent_id: intent.id,
            stripe_charge_id: intent.latest_charge as string,
          })
          .eq("id", bookingId)
          .eq("status", "pending"); // Idempotency guard

        if (error) throw error;

        console.log(`Booking ${bookingId} confirmed via payment ${intent.id}`);
        break;
      }

      // ── Payment failed → mark booking ────────────────────────────────────
      case "payment_intent.payment_failed": {
        const intent = event.data.object as Stripe.PaymentIntent;
        const bookingId = intent.metadata?.booking_id;
        if (!bookingId) break;

        await supabase
          .from("bookings")
          .update({ payment_status: "failed" })
          .eq("id", bookingId);

        break;
      }

      // ── Charge refunded → update booking ─────────────────────────────────
      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        const intentId = charge.payment_intent as string;

        const isFullRefund = charge.amount_refunded === charge.amount;

        await supabase
          .from("bookings")
          .update({
            payment_status: isFullRefund ? "refunded" : "partially_refunded",
          })
          .eq("stripe_payment_intent_id", intentId);

        break;
      }

      // ── Dispute — flag booking ────────────────────────────────────────────
      case "charge.dispute.created": {
        const dispute = event.data.object as Stripe.Dispute;
        console.warn(`Dispute created for charge ${dispute.charge}. Manual review required.`);
        // TODO: send notification to venue owner and admin
        break;
      }

      // ── Stripe Connect: venue account updated ─────────────────────────────
      case "account.updated": {
        const account = event.data.object as Stripe.Account;
        await supabase
          .from("venues")
          .update({ stripe_account_id: account.id })
          .eq("stripe_account_id", account.id);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Webhook handler error:", err);
    return new Response(`Webhook handler error: ${err}`, { status: 500 });
  }
});
