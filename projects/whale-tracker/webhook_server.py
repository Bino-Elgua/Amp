"""
Webhook server for Stripe events.
Deploy separately on Railway or as Edge Function.
"""

import os
import logging
from fastapi import FastAPI, Request, HTTPException
from dotenv import load_dotenv
from payments import handle_stripe_webhook, verify_webhook_signature

load_dotenv()

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

app = FastAPI(title="Whale Tracker Webhooks")


@app.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    """
    Handle Stripe webhook events.
    Webhook URL: https://your-railway-url.railway.app/webhook/stripe
    
    Configure in Stripe Dashboard:
    - Endpoint URL: https://your-railway-url/webhook/stripe
    - Events: checkout.session.completed, customer.subscription.deleted, invoice.payment_failed
    """
    
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    
    if not sig_header:
        raise HTTPException(status_code=400, detail="Missing stripe-signature header")
    
    # Verify webhook signature
    event = verify_webhook_signature(payload, sig_header)
    if not event:
        raise HTTPException(status_code=400, detail="Invalid signature")
    
    try:
        # Process the event
        handle_stripe_webhook(event)
        return {"status": "success"}
    except Exception as e:
        logger.error(f"Webhook processing error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn
    
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
