<template>
  <div class="page-container">
    <div class="header">
      <button class="back-btn" @click="goBack">← Back</button>
      <h1>Payment Management</h1>
    </div>
    
    <div class="content">
      <div class="payment-section">
        <h2>Payment Processing</h2>
        
        <div class="payment-methods">
          <h3>Payment Methods</h3>
          <div class="methods-grid">
            <div class="method-card" @click="selectMethod('cash')" :class="{ active: selectedMethod === 'cash' }">
              <div class="method-icon">💵</div>
              <h4>Cash</h4>
              <p>Cash payment</p>
            </div>
            <div class="method-card" @click="selectMethod('card')" :class="{ active: selectedMethod === 'card' }">
              <div class="method-icon">💳</div>
              <h4>Card</h4>
              <p>Credit/Debit card</p>
            </div>
            <div class="method-card" @click="selectMethod('bank')" :class="{ active: selectedMethod === 'bank' }">
              <div class="method-icon">🏦</div>
              <h4>Bank Transfer</h4>
              <p>Online banking</p>
            </div>
            <div class="method-card" @click="selectMethod('mobile')" :class="{ active: selectedMethod === 'mobile' }">
              <div class="method-icon">📱</div>
              <h4>Mobile Payment</h4>
              <p>Mobile wallet</p>
            </div>
          </div>
        </div>
        
        <div class="payment-form">
          <h3>Process Payment</h3>
          <form @submit.prevent="processPayment">
            <div class="form-group">
              <label for="amount">Amount</label>
              <input type="number" id="amount" v-model="payment.amount" step="0.01" required>
            </div>
            
            <div class="form-group">
              <label for="customer">Customer</label>
              <input type="text" id="customer" v-model="payment.customer" required>
            </div>
            
            <div v-if="selectedMethod === 'card'" class="card-details">
              <h4>Card Details</h4>
              <div class="form-row">
                <div class="form-group">
                  <label for="cardNumber">Card Number</label>
                  <input type="text" id="cardNumber" v-model="payment.cardNumber" placeholder="1234 5678 9012 3456">
                </div>
                <div class="form-group">
                  <label for="expiry">Expiry Date</label>
                  <input type="text" id="expiry" v-model="payment.expiry" placeholder="MM/YY">
                </div>
              </div>
              <div class="form-group">
                <label for="cvv">CVV</label>
                <input type="text" id="cvv" v-model="payment.cvv" placeholder="123">
              </div>
            </div>
            
            <div class="form-group">
              <label for="notes">Notes</label>
              <textarea id="notes" v-model="payment.notes" rows="3"></textarea>
            </div>
            
            <button type="submit" class="process-btn">Process Payment</button>
          </form>
        </div>
        
        <div class="payment-history">
          <h3>Recent Payments</h3>
          <div v-if="payments.length === 0" class="no-payments">
            <p>No payments processed yet.</p>
          </div>
          <div v-else class="payments-list">
            <div v-for="payment in payments" :key="payment.id" class="payment-item">
              <div class="payment-info">
                <h4>{{ payment.customer }}</h4>
                <p class="amount">{{ formatCurrency(payment.amount) }}</p>
                <p class="method">{{ payment.method }}</p>
                <p class="date">{{ formatDate(payment.date) }}</p>
              </div>
              <div class="payment-status" :class="payment.status">
                {{ payment.status }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Payment Management'
})

const selectedMethod = ref('')
const payment = ref({
  amount: '',
  customer: '',
  cardNumber: '',
  expiry: '',
  cvv: '',
  notes: ''
})

const payments = ref([
  {
    id: 1,
    customer: 'John Doe',
    amount: 150.00,
    method: 'Card',
    status: 'completed',
    date: new Date('2024-01-20')
  },
  {
    id: 2,
    customer: 'Jane Smith',
    amount: 75.50,
    method: 'Cash',
    status: 'completed',
    date: new Date('2024-01-19')
  }
])

const goBack = () => {
  if (process.client) {
    window.location.href = '/'
  }
}

const selectMethod = (method: string) => {
  selectedMethod.value = method
}

const processPayment = () => {
  if (!selectedMethod.value) {
    alert('Please select a payment method')
    return
  }
  
  const newPayment = {
    id: Date.now(),
    customer: payment.value.customer,
    amount: parseFloat(payment.value.amount),
    method: selectedMethod.value.charAt(0).toUpperCase() + selectedMethod.value.slice(1),
    status: 'completed',
    date: new Date()
  }
  
  payments.value.unshift(newPayment)
  
  // Reset form
  payment.value = {
    amount: '',
    customer: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    notes: ''
  }
  selectedMethod.value = ''
  
  alert('Payment processed successfully!')
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
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

.payment-section h2 {
  margin-bottom: 30px;
  color: #333;
  text-align: center;
}

.payment-methods h3 {
  margin-bottom: 20px;
  color: #333;
}

.methods-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.method-card {
  background: #f8f9fa;
  border: 2px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.method-card:hover {
  border-color: #007bff;
  background: #e3f2fd;
}

.method-card.active {
  border-color: #007bff;
  background: #e3f2fd;
}

.method-icon {
  font-size: 48px;
  margin-bottom: 10px;
}

.method-card h4 {
  margin: 0 0 10px 0;
  color: #333;
}

.method-card p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.payment-form {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.payment-form h3 {
  margin-bottom: 20px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.card-details {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.card-details h4 {
  margin-bottom: 15px;
  color: #333;
}

.process-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
}

.process-btn:hover {
  background: #218838;
}

.payment-history h3 {
  margin-bottom: 20px;
  color: #333;
}

.no-payments {
  text-align: center;
  padding: 40px;
  color: #666;
}

.payments-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.payment-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.payment-info h4 {
  margin: 0 0 10px 0;
  color: #333;
}

.amount {
  font-size: 18px;
  font-weight: bold;
  color: #28a745;
  margin: 5px 0;
}

.method {
  color: #666;
  font-size: 14px;
  margin: 5px 0;
}

.date {
  color: #999;
  font-size: 12px;
  margin: 5px 0;
}

.payment-status {
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
}

.payment-status.completed {
  background: #d4edda;
  color: #155724;
}

.payment-status.pending {
  background: #fff3cd;
  color: #856404;
}

.payment-status.failed {
  background: #f8d7da;
  color: #721c24;
}

@media (max-width: 768px) {
  .methods-grid {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .payment-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>

