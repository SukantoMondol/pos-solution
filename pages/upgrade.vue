<template>
  <div class="page-container">
    <div class="header">
      <button class="back-btn" @click="goBack">← Back</button>
      <h1>Upgrade Plan</h1>
    </div>
    
    <div class="content">
      <div class="upgrade-section">
        <h2>Choose Your Plan</h2>
        
        <div class="plans-grid">
          <div class="plan-card basic">
            <div class="plan-header">
              <h3>Basic</h3>
              <div class="price">
                <span class="currency">$</span>
                <span class="amount">0</span>
                <span class="period">/month</span>
              </div>
            </div>
            <div class="plan-features">
              <ul>
                <li>Up to 100 products</li>
                <li>Basic reporting</li>
                <li>Email support</li>
                <li>1 user account</li>
              </ul>
            </div>
            <button class="plan-btn" :class="{ active: currentPlan === 'basic' }" @click="selectPlan('basic')">
              {{ currentPlan === 'basic' ? 'Current Plan' : 'Select Plan' }}
            </button>
          </div>
          
          <div class="plan-card pro">
            <div class="plan-header">
              <h3>Professional</h3>
              <div class="price">
                <span class="currency">$</span>
                <span class="amount">29</span>
                <span class="period">/month</span>
              </div>
            </div>
            <div class="plan-features">
              <ul>
                <li>Unlimited products</li>
                <li>Advanced reporting</li>
                <li>Priority support</li>
                <li>Up to 5 user accounts</li>
                <li>Inventory management</li>
                <li>Multi-location support</li>
              </ul>
            </div>
            <button class="plan-btn" :class="{ active: currentPlan === 'pro' }" @click="selectPlan('pro')">
              {{ currentPlan === 'pro' ? 'Current Plan' : 'Select Plan' }}
            </button>
          </div>
          
          <div class="plan-card enterprise">
            <div class="plan-header">
              <h3>Enterprise</h3>
              <div class="price">
                <span class="currency">$</span>
                <span class="amount">99</span>
                <span class="period">/month</span>
              </div>
            </div>
            <div class="plan-features">
              <ul>
                <li>Everything in Professional</li>
                <li>Custom integrations</li>
                <li>24/7 phone support</li>
                <li>Unlimited user accounts</li>
                <li>API access</li>
                <li>Custom reporting</li>
                <li>Dedicated account manager</li>
              </ul>
            </div>
            <button class="plan-btn" :class="{ active: currentPlan === 'enterprise' }" @click="selectPlan('enterprise')">
              {{ currentPlan === 'enterprise' ? 'Current Plan' : 'Select Plan' }}
            </button>
          </div>
        </div>
        
        <div class="upgrade-actions">
          <button class="upgrade-btn" @click="processUpgrade" :disabled="!selectedPlan">
            Upgrade Now
          </button>
        </div>
        
        <div class="faq-section">
          <h3>Frequently Asked Questions</h3>
          <div class="faq-item">
            <h4>Can I change my plan anytime?</h4>
            <p>Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.</p>
          </div>
          <div class="faq-item">
            <h4>What payment methods do you accept?</h4>
            <p>We accept all major credit cards, PayPal, and bank transfers for annual subscriptions.</p>
          </div>
          <div class="faq-item">
            <h4>Is there a free trial?</h4>
            <p>Yes, all paid plans come with a 14-day free trial. No credit card required to start.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Upgrade Plan'
})

const currentPlan = ref('basic')
const selectedPlan = ref('')

const goBack = () => {
  if (process.client) {
    window.location.href = '/'
  }
}

const selectPlan = (plan: string) => {
  selectedPlan.value = plan
}

const processUpgrade = () => {
  if (!selectedPlan.value) {
    alert('Please select a plan')
    return
  }
  
  if (selectedPlan.value === currentPlan.value) {
    alert('This is your current plan')
    return
  }
  
  alert(`Upgrading to ${selectedPlan.value} plan. This would redirect to payment processing in a real application.`)
}
</script>

<style scoped>
.page-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}

.back-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 15px;
}

.content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.upgrade-section h2 {
  margin-bottom: 30px;
  color: #333;
  text-align: center;
}

.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

.plan-card {
  background: white;
  border: 2px solid #ddd;
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  position: relative;
  transition: all 0.3s ease;
}

.plan-card:hover {
  border-color: #007bff;
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.plan-card.pro {
  border-color: #007bff;
  transform: scale(1.05);
}

.plan-card.pro::before {
  content: 'Most Popular';
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  background: #007bff;
  color: white;
  padding: 5px 20px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
}

.plan-header h3 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 24px;
}

.price {
  margin-bottom: 30px;
}

.currency {
  font-size: 20px;
  color: #666;
  vertical-align: top;
}

.amount {
  font-size: 48px;
  font-weight: bold;
  color: #333;
}

.period {
  font-size: 16px;
  color: #666;
}

.plan-features ul {
  list-style: none;
  padding: 0;
  margin: 0 0 30px 0;
  text-align: left;
}

.plan-features li {
  padding: 8px 0;
  color: #333;
  position: relative;
  padding-left: 25px;
}

.plan-features li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #28a745;
  font-weight: bold;
}

.plan-btn {
  width: 100%;
  padding: 12px 24px;
  border: 2px solid #007bff;
  background: white;
  color: #007bff;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.3s ease;
}

.plan-btn:hover {
  background: #007bff;
  color: white;
}

.plan-btn.active {
  background: #007bff;
  color: white;
}

.upgrade-actions {
  text-align: center;
  margin-bottom: 40px;
}

.upgrade-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 15px 40px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  transition: background 0.3s ease;
}

.upgrade-btn:hover:not(:disabled) {
  background: #218838;
}

.upgrade-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.faq-section {
  background: #f8f9fa;
  padding: 30px;
  border-radius: 8px;
}

.faq-section h3 {
  margin: 0 0 20px 0;
  color: #333;
}

.faq-item {
  margin-bottom: 20px;
}

.faq-item h4 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 16px;
}

.faq-item p {
  margin: 0;
  color: #666;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .plans-grid {
    grid-template-columns: 1fr;
  }
  
  .plan-card.pro {
    transform: none;
  }
}
</style>