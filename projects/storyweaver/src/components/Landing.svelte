<script>
  import axios from 'axios'
  import { createEventDispatcher } from 'svelte'
  
  export let monetizationEnabled = false
  export let isPaid = false
  
  const dispatch = createEventDispatcher()
  
  let loading = false
  
  const startFree = () => {
    dispatch('start', { mode: 'free' })
  }
  
  const checkout = async () => {
    loading = true
    try {
      const res = await axios.post('http://localhost:5000/api/stripe/checkout')
      if (res.data.session_id) {
        // Redirect to Stripe (in production)
        window.location.href = `https://checkout.stripe.com/pay/${res.data.session_id}`
      }
    } catch (e) {
      console.error('Checkout error:', e)
      alert('Payment failed: ' + e.message)
    } finally {
      loading = false
    }
  }
</script>

<div class="landing">
  <div class="hero">
    <div class="logo">📖</div>
    <h1>StoryWeaver</h1>
    <p class="subtitle">AI Story-to-Book Generator</p>
    <p class="tagline">Write stories with AI. Generate beautiful books. Send to Kindle.</p>
    <p class="description">Completely free, runs offline on your device, no API keys needed.</p>
  </div>
  
  <div class="features">
    <div class="feature">
      <div class="icon">💬</div>
      <h3>Chat with AI</h3>
      <p>Develop your story with intelligent writing partner</p>
    </div>
    <div class="feature">
      <div class="icon">📖</div>
      <h3>Generate Books</h3>
      <p>Convert chapters into professional EPUB format</p>
    </div>
    <div class="feature">
      <div class="icon">📧</div>
      <h3>Send to Kindle</h3>
      <p>Email your finished book directly to your Kindle device</p>
    </div>
    <div class="feature">
      <div class="icon">⚡</div>
      <h3>100% Local</h3>
      <p>Runs on your device, no cloud, no privacy concerns</p>
    </div>
  </div>
  
  {#if monetizationEnabled && !isPaid}
    <div class="pricing">
      <h2>Unlock Full Export</h2>
      
      <div class="plans">
        <div class="plan free">
          <h3>Free</h3>
          <p class="price">$0</p>
          <ul>
            <li>✅ Chat with AI</li>
            <li>✅ Write stories</li>
            <li>⭕ Preview first 2 chapters</li>
            <li>⭕ Full book export</li>
            <li>⭕ Send to Kindle</li>
          </ul>
          <button class="btn-primary" on:click={startFree}>Get Started Free</button>
        </div>
        
        <div class="plan paid">
          <div class="badge">RECOMMENDED</div>
          <h3>Full Access</h3>
          <p class="price">$0.99</p>
          <p class="note">One-time payment</p>
          <ul>
            <li>✅ Chat with AI</li>
            <li>✅ Write stories</li>
            <li>✅ Preview first 2 chapters</li>
            <li>✅ Full book export (EPUB)</li>
            <li>✅ Send to Kindle</li>
            <li>✅ Priority support</li>
          </ul>
          <button class="btn-premium" on:click={checkout} disabled={loading}>
            {loading ? 'Processing...' : 'Unlock for $0.99'}
          </button>
        </div>
        
        <div class="plan pro">
          <h3>Monthly</h3>
          <p class="price">$4</p>
          <p class="note">Per month, cancel anytime</p>
          <ul>
            <li>✅ All from Full Access</li>
            <li>✅ Generate book covers</li>
            <li>✅ Commercial use rights</li>
            <li>✅ Priority support</li>
            <li>✅ New features first</li>
          </ul>
          <button class="btn-primary">Coming Soon</button>
        </div>
      </div>
    </div>
  {:else}
    <div class="cta">
      <button class="btn-primary btn-large" on:click={startFree}>
        ✨ Start Writing Now
      </button>
      <p class="note">Free forever. No ads. No tracking.</p>
    </div>
  {/if}
  
  <footer class="footer">
    <p>Built with open-source AI • <a href="#">GitHub</a> • <a href="#">Docs</a></p>
  </footer>
</div>

<style>
  .landing {
    min-height: 100vh;
    background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%);
    color: #e0e0e0;
    overflow-y: auto;
  }
  
  .hero {
    text-align: center;
    padding: 60px 20px;
  }
  
  .logo {
    font-size: 64px;
    margin-bottom: 20px;
  }
  
  .hero h1 {
    font-size: 48px;
    margin: 0 0 10px;
    background: linear-gradient(135deg, #6a7abf, #8a9acf);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .subtitle {
    font-size: 24px;
    color: #a0a0b0;
    margin: 0 0 20px;
  }
  
  .tagline {
    font-size: 18px;
    margin: 10px 0;
    color: #b0b0c0;
  }
  
  .description {
    color: #8a8a9a;
    margin: 10px 0 40px;
  }
  
  .features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 30px;
    padding: 40px 20px;
    max-width: 1000px;
    margin: 0 auto;
  }
  
  .feature {
    background: #1a1f3a;
    padding: 30px;
    border-radius: 12px;
    border: 1px solid #2a2f4a;
    text-align: center;
  }
  
  .feature .icon {
    font-size: 40px;
    margin-bottom: 15px;
  }
  
  .feature h3 {
    margin: 15px 0 10px;
    font-size: 18px;
  }
  
  .feature p {
    color: #a0a0b0;
    font-size: 14px;
    margin: 0;
  }
  
  .pricing {
    padding: 60px 20px;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .pricing h2 {
    text-align: center;
    margin-bottom: 50px;
    font-size: 32px;
  }
  
  .plans {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 30px;
  }
  
  .plan {
    background: #1a1f3a;
    border: 1px solid #2a2f4a;
    border-radius: 12px;
    padding: 40px;
    position: relative;
    transition: all 0.3s;
  }
  
  .plan:hover {
    border-color: #4a5a9f;
    transform: translateY(-5px);
  }
  
  .plan.paid {
    border: 2px solid #6a7abf;
    background: linear-gradient(135deg, #1a1f3a, #2a2f4a);
  }
  
  .badge {
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    background: #6a7abf;
    color: white;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: bold;
  }
  
  .plan h3 {
    margin: 0 0 10px;
    font-size: 24px;
  }
  
  .price {
    font-size: 32px;
    font-weight: bold;
    margin: 10px 0;
    background: linear-gradient(135deg, #6a7abf, #8a9acf);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .note {
    color: #a0a0b0;
    font-size: 12px;
    margin: 5px 0 20px;
  }
  
  .plan ul {
    list-style: none;
    padding: 0;
    margin: 20px 0;
  }
  
  .plan li {
    padding: 8px 0;
    color: #c0c0d0;
    font-size: 14px;
  }
  
  .cta {
    text-align: center;
    padding: 60px 20px;
  }
  
  .btn-primary {
    background: #5a6aaf;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s;
  }
  
  .btn-primary:hover:not(:disabled) {
    background: #6a7abf;
  }
  
  .btn-premium {
    background: linear-gradient(135deg, #6a7abf, #8a9acf);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    width: 100%;
  }
  
  .btn-premium:hover:not(:disabled) {
    transform: scale(1.02);
  }
  
  .btn-primary:disabled, .btn-premium:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .btn-large {
    padding: 16px 48px;
    font-size: 18px;
  }
  
  .footer {
    text-align: center;
    padding: 30px;
    color: #8a8a9a;
    font-size: 14px;
  }
  
  .footer a {
    color: #6a7abf;
    text-decoration: none;
  }
  
  .footer a:hover {
    text-decoration: underline;
  }
  
  @media (max-width: 768px) {
    .hero h1 {
      font-size: 32px;
    }
    
    .subtitle {
      font-size: 18px;
    }
  }
</style>
