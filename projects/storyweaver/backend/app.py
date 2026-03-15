#!/usr/bin/env python3
"""
StoryWeaver Backend — Flask API for chat, book generation, and payments
"""

import os
import json
import sqlite3
import logging
from datetime import datetime
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import requests
import stripe
from werkzeug.utils import secure_filename

# Import our custom modules
from book_generator import BookGenerator
from email_sender import EmailSender
from image_generator import ImageGenerator

# Setup logging
logging.basicConfig(level=logging.INFO)
log = logging.getLogger(__name__)

# Load env
env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(env_path)

app = Flask(__name__)
CORS(app)

# Config
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///storyweaver.db'
app.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(__file__), '..', 'books', 'current')
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50MB max

# Initialize DB
db = SQLAlchemy(app)

# Initialize services
book_gen = BookGenerator()
email_sender = EmailSender()
image_gen = ImageGenerator()

# Stripe config
stripe.api_key = os.getenv('STRIPE_SECRET_KEY', 'sk_test_dummy')
STRIPE_ENABLED = os.getenv('MONETIZATION_ENABLED', 'false').lower() == 'true'

# Ollama config
OLLAMA_HOST = os.getenv('OLLAMA_HOST', 'http://localhost:11434')
OLLAMA_MODEL = os.getenv('OLLAMA_MODEL', 'llama3.2')

# Database Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True)
    stripe_customer_id = db.Column(db.String(255))
    is_paid = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Story(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    title = db.Column(db.String(255))
    content = db.Column(db.Text)  # Full markdown
    chapters = db.Column(db.JSON)  # [{"title": "Ch1", "text": "..."}]
    status = db.Column(db.String(50), default='draft')  # draft, generating, complete
    book_path = db.Column(db.String(255))  # Path to EPUB/MOBI
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class ChatMessage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    story_id = db.Column(db.Integer, db.ForeignKey('story.id'))
    role = db.Column(db.String(20))  # user, assistant
    content = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# Initialize DB
with app.app_context():
    db.create_all()

# Routes

@app.route('/api/health', methods=['GET'])
def health():
    """Health check"""
    return jsonify({'status': 'ok', 'service': 'storyweaver-backend'})

@app.route('/api/ollama/health', methods=['GET'])
def ollama_health():
    """Check if Ollama is running"""
    try:
        resp = requests.get(f"{OLLAMA_HOST}/api/tags", timeout=5)
        return jsonify({'status': 'ok', 'ollama': True, 'model': OLLAMA_MODEL})
    except:
        return jsonify({'status': 'error', 'ollama': False}), 503

@app.route('/api/chat', methods=['POST'])
def chat():
    """
    Main chat endpoint — send message to Ollama, get response
    """
    data = request.json
    message = data.get('message', '')
    story_id = data.get('story_id')
    
    if not message:
        return jsonify({'error': 'No message'}), 400
    
    try:
        # Send to Ollama with longer timeout
        log.info(f"Chat request: {message[:50]}...")
        resp = requests.post(
            f"{OLLAMA_HOST}/api/generate",
            json={
                'model': OLLAMA_MODEL,
                'prompt': message,
                'stream': False,
                'num_predict': 128  # Limit response length for speed
            },
            timeout=180  # Longer timeout for model inference
        )
        
        if resp.status_code != 200:
            log.error(f"Ollama error: {resp.status_code} - {resp.text}")
            return jsonify({'error': f'Ollama error: {resp.status_code}'}), 503
        
        result = resp.json()
        ai_response = result.get('response', 'No response')
        
        log.info(f"Response generated: {ai_response[:50]}...")
        
        return jsonify({
            'response': ai_response,
            'model': OLLAMA_MODEL,
            'timestamp': datetime.utcnow().isoformat()
        })
    
    except requests.exceptions.Timeout:
        log.error("Ollama request timeout")
        return jsonify({'error': 'Request timeout - model too slow or not running'}), 504
    except Exception as e:
        log.error(f"Chat error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/stories', methods=['POST'])
def create_story():
    """Create a new story"""
    data = request.json
    
    story = Story(
        title=data.get('title', 'Untitled Story'),
        content='',
        chapters=[]
    )
    db.session.add(story)
    db.session.commit()
    
    return jsonify({
        'id': story.id,
        'title': story.title,
        'status': story.status
    }), 201

@app.route('/api/stories/<int:story_id>', methods=['GET'])
def get_story(story_id):
    """Get story details"""
    story = Story.query.get(story_id)
    if not story:
        return jsonify({'error': 'Not found'}), 404
    
    return jsonify({
        'id': story.id,
        'title': story.title,
        'content': story.content,
        'chapters': story.chapters,
        'status': story.status,
        'created_at': story.created_at.isoformat()
    })

@app.route('/api/stories/<int:story_id>', methods=['PUT'])
def update_story(story_id):
    """Update story content"""
    story = Story.query.get(story_id)
    if not story:
        return jsonify({'error': 'Not found'}), 404
    
    data = request.json
    story.content = data.get('content', story.content)
    story.title = data.get('title', story.title)
    story.updated_at = datetime.utcnow()
    
    db.session.commit()
    
    return jsonify({
        'id': story.id,
        'title': story.title,
        'updated_at': story.updated_at.isoformat()
    })

@app.route('/api/stories/<int:story_id>/generate-book', methods=['POST'])
def generate_book(story_id):
    """
    Generate EPUB from story
    """
    story = Story.query.get(story_id)
    if not story:
        return jsonify({'error': 'Not found'}), 404
    
    try:
        story.status = 'generating'
        db.session.commit()
        
        # Extract chapters from content
        chapters = book_gen.extract_chapters(story.content)
        
        # Generate images if enabled
        if os.getenv('GENERATE_ILLUSTRATIONS', 'true').lower() == 'true':
            log.info("Generating illustrations...")
            chapters = image_gen.generate_for_chapters(chapters)
        
        # Generate EPUB
        log.info(f"Generating EPUB for story {story_id}: {story.title}")
        epub_path = book_gen.generate_epub(
            story_id,
            story.title,
            chapters,
            author='StoryWeaver Author'
        )
        
        if not epub_path:
            story.status = 'error'
            db.session.commit()
            return jsonify({'error': 'Failed to generate EPUB'}), 500
        
        # Update story
        story.book_path = epub_path
        story.status = 'complete'
        story.chapters = chapters
        db.session.commit()
        
        return jsonify({
            'id': story.id,
            'status': 'complete',
            'book_path': epub_path,
            'message': 'Book generated successfully'
        })
    
    except Exception as e:
        log.error(f"Error generating book: {e}")
        story.status = 'error'
        db.session.commit()
        return jsonify({'error': str(e)}), 500

@app.route('/api/stripe/checkout', methods=['POST'])
def stripe_checkout():
    """Create Stripe checkout session"""
    if not STRIPE_ENABLED:
        return jsonify({'error': 'Monetization disabled'}), 400
    
    try:
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'usd',
                    'product_data': {'name': 'Full Book Export'},
                    'unit_amount': 99,  # $0.99
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url='http://localhost:8080/success',
            cancel_url='http://localhost:8080/cancel',
        )
        return jsonify({'session_id': session.id})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/stories/<int:story_id>/send-to-kindle', methods=['POST'])
def send_to_kindle(story_id):
    """Send generated book to Kindle"""
    story = Story.query.get(story_id)
    if not story:
        return jsonify({'error': 'Not found'}), 404
    
    if not story.book_path:
        return jsonify({'error': 'No book generated yet'}), 400
    
    data = request.json
    kindle_email = data.get('kindle_email')
    
    if not kindle_email:
        return jsonify({'error': 'Kindle email required'}), 400
    
    try:
        success = email_sender.send_to_kindle(
            story.book_path,
            kindle_email,
            story.title
        )
        
        if success:
            return jsonify({
                'success': True,
                'message': f'Book sent to {kindle_email}'
            })
        else:
            return jsonify({'error': 'Failed to send email'}), 500
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/stories/<int:story_id>/download', methods=['GET'])
def download_book(story_id):
    """Download generated book"""
    story = Story.query.get(story_id)
    if not story or not story.book_path:
        return jsonify({'error': 'Book not found'}), 404
    
    try:
        return send_file(story.book_path, as_attachment=True)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/stripe/webhook', methods=['POST'])
def stripe_webhook():
    """Handle Stripe webhook"""
    if not STRIPE_ENABLED:
        return jsonify({'error': 'Monetization disabled'}), 400
    
    payload = request.get_data()
    sig_header = request.headers.get('Stripe-Signature')
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, os.getenv('STRIPE_WEBHOOK_SECRET', '')
        )
    except ValueError:
        return jsonify({'error': 'Invalid payload'}), 400
    except stripe.error.SignatureVerificationError:
        return jsonify({'error': 'Invalid signature'}), 400
    
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        # TODO: Mark user as paid
    
    return jsonify({'success': True})

# Error handlers
@app.errorhandler(404)
def not_found(e):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def server_error(e):
    return jsonify({'error': 'Server error'}), 500

if __name__ == '__main__':
    print("StoryWeaver Backend starting on http://localhost:5000")
    print(f"Ollama: {OLLAMA_HOST}")
    print(f"Model: {OLLAMA_MODEL}")
    print(f"Monetization: {STRIPE_ENABLED}")
    app.run(host='0.0.0.0', port=5000, debug=True)
