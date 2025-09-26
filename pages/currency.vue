<template>
  <div class="page-container">
    <div class="header">
      <button class="back-btn" @click="goBack">← Back</button>
      <h1>Currency Settings</h1>
    </div>
    
    <div class="content">
      <div class="currency-section">
        <h2>Currency Management</h2>
        
        <div class="current-currency">
          <h3>Current Currency</h3>
          <div class="currency-display">
            <span class="currency-symbol">{{ currentCurrency.symbol }}</span>
            <span class="currency-name">{{ currentCurrency.name }}</span>
            <span class="currency-code">({{ currentCurrency.code }})</span>
          </div>
        </div>
        
        <div class="currency-form">
          <h3>Change Currency</h3>
          <form @submit.prevent="updateCurrency">
            <div class="form-group">
              <label for="currency">Select Currency</label>
              <select id="currency" v-model="selectedCurrency" required>
                <option value="">Choose Currency</option>
                <option value="usd">USD - US Dollar ($)</option>
                <option value="eur">EUR - Euro (€)</option>
                <option value="gbp">GBP - British Pound (£)</option>
                <option value="bdt">BDT - Bangladeshi Taka (৳)</option>
                <option value="inr">INR - Indian Rupee (₹)</option>
                <option value="jpy">JPY - Japanese Yen (¥)</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="exchangeRate">Exchange Rate</label>
              <input type="number" id="exchangeRate" v-model="exchangeRate" step="0.01" required>
            </div>
            
            <button type="submit" class="update-btn">Update Currency</button>
          </form>
        </div>
        
        <div class="currency-history">
          <h3>Currency History</h3>
          <div class="history-list">
            <div v-for="change in currencyHistory" :key="change.id" class="history-item">
              <div class="change-info">
                <span class="from-currency">{{ change.from }}</span>
                <span class="arrow">→</span>
                <span class="to-currency">{{ change.to }}</span>
                <span class="rate">Rate: {{ change.rate }}</span>
              </div>
              <div class="change-date">{{ formatDate(change.date) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Currency Settings'
})

const currentCurrency = ref({
  symbol: '$',
  name: 'US Dollar',
  code: 'USD'
})

const selectedCurrency = ref('')
const exchangeRate = ref(1.0)

const currencyHistory = ref([
  {
    id: 1,
    from: 'BDT',
    to: 'USD',
    rate: 0.0091,
    date: new Date('2024-01-15')
  },
  {
    id: 2,
    from: 'USD',
    to: 'EUR',
    rate: 0.85,
    date: new Date('2024-01-10')
  }
])

const goBack = () => {
  if (process.client) {
    window.location.href = '/'
  }
}

const updateCurrency = () => {
  const currencies = {
    usd: { symbol: '$', name: 'US Dollar', code: 'USD' },
    eur: { symbol: '€', name: 'Euro', code: 'EUR' },
    gbp: { symbol: '£', name: 'British Pound', code: 'GBP' },
    bdt: { symbol: '৳', name: 'Bangladeshi Taka', code: 'BDT' },
    inr: { symbol: '₹', name: 'Indian Rupee', code: 'INR' },
    jpy: { symbol: '¥', name: 'Japanese Yen', code: 'JPY' }
  }
  
  if (selectedCurrency.value && currencies[selectedCurrency.value as keyof typeof currencies]) {
    currentCurrency.value = currencies[selectedCurrency.value as keyof typeof currencies]
    
    // Add to history
    currencyHistory.value.unshift({
      id: Date.now(),
      from: 'Previous',
      to: currentCurrency.value.code,
      rate: exchangeRate.value,
      date: new Date()
    })
    
    alert('Currency updated successfully!')
    
    // Reset form
    selectedCurrency.value = ''
    exchangeRate.value = 1.0
  }
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
  max-width: 800px;
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

.currency-section h2 {
  margin-bottom: 30px;
  color: #333;
  text-align: center;
}

.current-currency {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.current-currency h3 {
  margin-bottom: 15px;
  color: #333;
}

.currency-display {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: bold;
}

.currency-symbol {
  font-size: 24px;
  color: #007bff;
}

.currency-form {
  margin-bottom: 30px;
}

.currency-form h3 {
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
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.update-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
}

.update-btn:hover {
  background: #0056b3;
}

.currency-history h3 {
  margin-bottom: 20px;
  color: #333;
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

.change-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.from-currency,
.to-currency {
  font-weight: bold;
  color: #333;
}

.arrow {
  color: #666;
}

.rate {
  color: #007bff;
  font-size: 14px;
}

.change-date {
  color: #666;
  font-size: 14px;
}
</style>