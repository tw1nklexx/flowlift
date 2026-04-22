import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

const PRICE_MAP: Record<string, string> = {
  starter: process.env.STRIPE_PRICE_STARTER ?? "",
  pro: process.env.STRIPE_PRICE_PRO ?? "",
};

export async function POST(req: NextRequest) {
  try {
    const { planId } = await req.json();
    const priceId = PRICE_MAP[planId];

    if (!priceId) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "sk_test_placeholder");

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const origin = req.headers.get("origin") ?? "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: user.email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/settings?upgraded=1`,
      cancel_url: `${origin}/settings`,
      metadata: { user_id: user.id, plan: planId },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Stripe error" }, { status: 500 });
  }
}
