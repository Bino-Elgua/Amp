import os
import stripe
import logging
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

logger = logging.getLogger(__name__)

# Initialize Stripe
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
STRIPE_PRICE_ID = os.getenv("STRIPE_PRICE_ID")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")

# Initialize Supabase
supabase_client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SERVICE_KEY")
)


def create_checkout_session(discord_id: str, success_url: str, cancel_url: str) -> str:
    """Create Stripe checkout session for $19/month subscription"""
    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            mode="subscription",
            line_items=[{"price": STRIPE_PRICE_ID, "quantity": 1}],
            success_url=success_url + "?session_id={CHECKOUT_SESSION_ID}",
            cancel_url=cancel_url,
            client_reference_id=str(discord_id),
            metadata={"discord_id": str(discord_id)},
        )
        return session.url
    except Exception as e:
        logger.error(f"Failed to create checkout session: {e}")
        return None


def is_premium_user(discord_id: str) -> bool:
    """Check if user has active premium subscription"""
    try:
        response = (
            supabase_client.table("users")
            .select("is_premium")
            .eq("discord_id", str(discord_id))
            .single()
            .execute()
        )
        return response.data.get("is_premium", False)
    except Exception as e:
        logger.error(f"Failed to check premium status: {e}")
        return False


def get_daily_alert_count(discord_id: str) -> int:
    """Get number of alerts sent today for free tier user"""
    try:
        response = (
            supabase_client.table("alert_log")
            .select("id")
            .eq("discord_id", str(discord_id))
            .gte("created_at", "now()-1 day")
            .execute()
        )
        return len(response.data)
    except Exception as e:
        logger.error(f"Failed to get alert count: {e}")
        return 0


def log_alert_sent(discord_id: str, tx_hash: str):
    """Log alert for daily limit tracking"""
    try:
        supabase_client.table("alert_log").insert({
            "discord_id": str(discord_id),
            "tx_hash": tx_hash,
        }).execute()
    except Exception as e:
        logger.error(f"Failed to log alert: {e}")


def handle_stripe_webhook(event: dict):
    """Process Stripe webhook events"""
    event_type = event.get("type")
    
    if event_type == "checkout.session.completed":
        handle_checkout_completed(event)
    elif event_type in ["customer.subscription.deleted", "invoice.payment_failed"]:
        handle_subscription_cancelled(event)


def handle_checkout_completed(event: dict):
    """Mark user as premium after successful checkout"""
    try:
        session = event["data"]["object"]
        discord_id = session.get("client_reference_id")
        stripe_customer_id = session.get("customer")
        
        if discord_id:
            supabase_client.table("users").upsert({
                "discord_id": discord_id,
                "stripe_customer_id": stripe_customer_id,
                "is_premium": True,
            }).execute()
            
            logger.info(f"User {discord_id} upgraded to premium")
    except Exception as e:
        logger.error(f"Failed to handle checkout completion: {e}")


def handle_subscription_cancelled(event: dict):
    """Downgrade user when subscription ends"""
    try:
        obj = event["data"]["object"]
        
        # For subscription.deleted, get customer_id from subscription object
        if event["type"] == "customer.subscription.deleted":
            customer_id = obj.get("customer")
        # For invoice.payment_failed, get customer_id from invoice
        else:
            customer_id = obj.get("customer")
        
        # Find user by stripe_customer_id and downgrade
        if customer_id:
            response = (
                supabase_client.table("users")
                .select("discord_id")
                .eq("stripe_customer_id", customer_id)
                .single()
                .execute()
            )
            
            if response.data:
                discord_id = response.data.get("discord_id")
                supabase_client.table("users").update(
                    {"is_premium": False}
                ).eq("discord_id", discord_id).execute()
                
                logger.info(f"User {discord_id} downgraded from premium")
    except Exception as e:
        logger.error(f"Failed to handle subscription cancellation: {e}")


def verify_webhook_signature(payload: bytes, sig_header: str) -> dict:
    """Verify Stripe webhook signature"""
    try:
        event = stripe.Webhook.construct_event(
            payload,
            sig_header,
            STRIPE_WEBHOOK_SECRET
        )
        return event
    except ValueError:
        logger.error("Invalid webhook payload")
        return None
    except stripe.error.SignatureVerificationError:
        logger.error("Invalid webhook signature")
        return None
