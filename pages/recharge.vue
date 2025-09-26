<template>
  <div class="page-container">
    <div class="header">
      <button class="back-btn" @click="goBack">← Back</button>
      <h1>Recharge</h1>
    </div>
    
    <div class="content">
      <div class="recharge-section">
        <h2>Mobile Recharge</h2>
        
        <div class="recharge-form">
          <form @submit.prevent="handleRecharge">
            <div class="form-group">
              <label for="operator">Select Operator</label>
              <select id="operator" v-model="form.operator" required>
                <option value="">Choose Operator</option>
                <option value="grameenphone">Grameenphone</option>
                <option value="robi">Robi</option>
                <option value="banglalink">Banglalink</option>
                <option value="teletalk">Teletalk</option>
                <option value="airtel">Airtel</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="phoneNumber">Phone Number</label>
              <input type="tel" id="phoneNumber" v-model="form.phoneNumber" placeholder="01XXXXXXXXX" required>
            </div>
            
            <div class="form-group">
              <label for="amount">Recharge Amount</label>
              <select id="amount" v-model="form.amount" required>
                <option value="">Select Amount</option>
                <option value="10">10 Taka</option>
                <option value="20">20 Taka</option>
                <option value="50">50 Taka</option>
                <option value="100">100 Taka</option>
                <option value="200">200 Taka</option>
                <option value="500">500 Taka</option>
                <option value="1000">1000 Taka</option>
                <option value="custom">Custom Amount</option>
              </select>
            </div>
            
            <div v-if="form.amount === 'custom'" class="form-group">
              <label for="customAmount">Custom Amount</label>
              <input type="number" id="customAmount" v-model="form.customAmount" placeholder="Enter amount">
            </div>
            
            <button type="submit" class="recharge-btn">Recharge Now</button>
          </form>
        </div>
        
        <div class="recharge-history">
          <h3>Recent Recharges</h3>
          <div v-if="rechargeHistory.length === 0" class="no-history">
            <p>No recharge history found.</p>
          </div>
          <div v-else class="history-list">
            <div v-for="recharge in rechargeHistory" :key="recharge.id" class="history-item">
              <div class="history-info">
                <span class="operator">{{ recharge.operator }}</span>
                <span class="phone">{{ recharge.phoneNumber }}</span>
                <span class="amount">{{ formatCurrency(recharge.amount) }}</span>
              </div>
              <div class="history-status" :class="recharge.status">
                {{ recharge.status }}
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
  title: 'Recharge'
})

const form = ref({
  operator: '',
  phoneNumber: '',
  amount: '',
  customAmount: ''
})

const rechargeHistory = ref([
  {
    id: 1,
    operator: 'Grameenphone',
    phoneNumber: '01712345678',
    amount: 100,
    status: 'success'
  },
  {
    id: 2,
    operator: 'Robi',
    phoneNumber: '01812345678',
    amount: 50,
    status: 'success'
  }
])

const goBack = () => {
  if (process.client) {
    window.location.href = '/'
  }
}

const handleRecharge = () => {
  const amount = form.value.amount === 'custom' ? form.value.customAmount : form.value.amount
  
  if (!amount || amount <= 0) {
    alert('Please enter a valid amount')
    return
  }
  
  // Add to history
  const newRecharge = {
    id: Date.now(),
    operator: form.value.operator,
    phoneNumber: form.value.phoneNumber,
    amount: parseFloat(amount),
    status: 'success'
  }
  
  rechargeHistory.value.unshift(newRecharge)
  
  alert(`Recharge of ${formatCurrency(parseFloat(amount))} successful for ${form.value.phoneNumber}`)
  
  // Reset form
  form.value = {
    operator: '',
    phoneNumber: '',
    amount: '',
    customAmount: ''
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

.recharge-section h2 {
  margin-bottom: 30px;
  color: #333;
  text-align: center;
}

.recharge-form {
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

.recharge-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  width: 100%;
  font-weight: bold;
}

.recharge-btn:hover {
  background: #218838;
}

.recharge-history h3 {
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

.history-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.operator {
  font-weight: bold;
  color: #333;
}

.phone {
  color: #666;
  font-size: 14px;
}

.amount {
  color: #007bff;
  font-weight: bold;
}

.history-status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
}

.history-status.success {
  background: #d4edda;
  color: #155724;
}

.history-status.pending {
  background: #fff3cd;
  color: #856404;
}

.history-status.failed {
  background: #f8d7da;
  color: #721c24;
}
</style>