<template>
  <div class="page-container">
    <div class="header">
      <button class="back-btn" @click="goBack">← Back</button>
      <h1>Electricity Bill</h1>
    </div>
    
    <div class="content">
      <div class="electricity-section">
        <h2>Pay Electricity Bill</h2>
        
        <div class="bill-form">
          <form @submit.prevent="handleBillPayment">
            <div class="form-group">
              <label for="provider">Electricity Provider</label>
              <select id="provider" v-model="form.provider" required>
                <option value="">Select Provider</option>
                <option value="desco">DESCO</option>
                <option value="dpdc">DPDC</option>
                <option value="westzone">West Zone Power</option>
                <option value="northzone">North Zone Power</option>
                <option value="southzone">South Zone Power</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="accountNumber">Account Number</label>
              <input type="text" id="accountNumber" v-model="form.accountNumber" placeholder="Enter account number" required>
            </div>
            
            <div class="form-group">
              <label for="amount">Bill Amount</label>
              <input type="number" id="amount" v-model="form.amount" placeholder="Enter amount" required>
            </div>
            
            <div class="form-group">
              <label for="customerName">Customer Name</label>
              <input type="text" id="customerName" v-model="form.customerName" placeholder="Enter customer name" required>
            </div>
            
            <button type="submit" class="pay-btn">Pay Bill</button>
          </form>
        </div>
        
        <div class="bill-history">
          <h3>Recent Payments</h3>
          <div v-if="paymentHistory.length === 0" class="no-history">
            <p>No payment history found.</p>
          </div>
          <div v-else class="history-list">
            <div v-for="payment in paymentHistory" :key="payment.id" class="history-item">
              <div class="payment-info">
                <span class="provider">{{ payment.provider }}</span>
                <span class="account">{{ payment.accountNumber }}</span>
                <span class="amount">{{ formatCurrency(payment.amount) }}</span>
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
  title: 'Electricity Bill'
})

const form = ref({
  provider: '',
  accountNumber: '',
  amount: '',
  customerName: ''
})

const paymentHistory = ref([
  {
    id: 1,
    provider: 'DESCO',
    accountNumber: '123456789',
    amount: 2500,
    status: 'success'
  },
  {
    id: 2,
    provider: 'DPDC',
    accountNumber: '987654321',
    amount: 1800,
    status: 'success'
  }
])

const goBack = () => {
  if (process.client) {
    window.location.href = '/'
  }
}

const handleBillPayment = () => {
  if (!form.value.amount || form.value.amount <= 0) {
    alert('Please enter a valid amount')
    return
  }
  
  // Add to history
  const newPayment = {
    id: Date.now(),
    provider: form.value.provider,
    accountNumber: form.value.accountNumber,
    amount: parseFloat(form.value.amount),
    status: 'success'
  }
  
  paymentHistory.value.unshift(newPayment)
  
  alert(`Electricity bill payment of ${formatCurrency(parseFloat(form.value.amount))} successful for account ${form.value.accountNumber}`)
  
  // Reset form
  form.value = {
    provider: '',
    accountNumber: '',
    amount: '',
    customerName: ''
  }
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'BDT'
  }).format(amount)
}
</script>

<style scoped>
.page-container {
  padding: 20px;
  max-width: 600px;
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

.electricity-section h2 {
  margin-bottom: 30px;
  color: #333;
  text-align: center;
}

.bill-form {
  margin-bottom: 30px;
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
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.pay-btn {
  background: #ffc107;
  color: #333;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  width: 100%;
  font-weight: bold;
}

.pay-btn:hover {
  background: #e0a800;
}

.bill-history h3 {
  margin-bottom: 20px;
  color: #333;
}

.no-history {
  text-align: center;
  padding: 40px;
  color: #666;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.payment-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.provider {
  font-weight: bold;
  color: #333;
}

.account {
  color: #666;
  font-size: 14px;
}

.amount {
  color: #ffc107;
  font-weight: bold;
}

.payment-status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
}

.payment-status.success {
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
</style>