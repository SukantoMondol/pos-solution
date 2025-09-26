<template>
  <div class="page-container">
    <div class="header">
      <button class="back-btn" @click="goBack">← Back</button>
      <h1>Profit Report</h1>
    </div>
    
    <div class="content">
      <div class="profit-section">
        <h2>Profit Analysis</h2>
        
        <div class="profit-summary">
          <div class="summary-card">
            <h3>Total Revenue</h3>
            <p class="amount positive">{{ formatCurrency(totalRevenue) }}</p>
          </div>
          <div class="summary-card">
            <h3>Total Expenses</h3>
            <p class="amount negative">{{ formatCurrency(totalExpenses) }}</p>
          </div>
          <div class="summary-card">
            <h3>Net Profit</h3>
            <p class="amount" :class="netProfit >= 0 ? 'positive' : 'negative'">
              {{ formatCurrency(netProfit) }}
            </p>
          </div>
        </div>
        
        <div class="profit-chart">
          <h3>Profit Trend</h3>
          <div class="chart-placeholder">
            <div class="chart-bars">
              <div v-for="(month, index) in monthlyData" :key="index" class="chart-bar">
                <div class="bar" :style="{ height: (month.profit / maxProfit * 100) + '%' }"></div>
                <span class="month">{{ month.month }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="profit-actions">
          <button @click="exportReport" class="export-btn">Export Report</button>
          <button @click="printReport" class="print-btn">Print Report</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Profit Report'
})

const totalRevenue = ref(50000)
const totalExpenses = ref(30000)
const netProfit = computed(() => totalRevenue.value - totalExpenses.value)

const monthlyData = ref([
  { month: 'Jan', profit: 2000 },
  { month: 'Feb', profit: 2500 },
  { month: 'Mar', profit: 1800 },
  { month: 'Apr', profit: 3200 },
  { month: 'May', profit: 2800 },
  { month: 'Jun', profit: 3500 }
])

const maxProfit = computed(() => Math.max(...monthlyData.value.map(m => m.profit)))

const goBack = () => {
  if (process.client) {
    window.location.href = '/'
  }
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

const exportReport = () => {
  alert('Profit report exported successfully!')
}

const printReport = () => {
  alert('Profit report sent to printer!')
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

.profit-section h2 {
  margin-bottom: 30px;
  color: #333;
  text-align: center;
}

.profit-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.summary-card {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  border: 1px solid #ddd;
}

.summary-card h3 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 16px;
}

.amount {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
}

.amount.positive {
  color: #28a745;
}

.amount.negative {
  color: #dc3545;
}

.profit-chart {
  margin-bottom: 30px;
}

.profit-chart h3 {
  margin-bottom: 20px;
  color: #333;
}

.chart-placeholder {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.chart-bars {
  display: flex;
  justify-content: space-around;
  align-items: end;
  height: 200px;
  gap: 10px;
}

.chart-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.bar {
  background: #007bff;
  width: 100%;
  min-height: 20px;
  border-radius: 4px 4px 0 0;
  margin-bottom: 10px;
  transition: height 0.3s ease;
}

.month {
  font-size: 12px;
  color: #666;
}

.profit-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.export-btn,
.print-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
}

.export-btn {
  background: #28a745;
  color: white;
}

.export-btn:hover {
  background: #218838;
}

.print-btn {
  background: #17a2b8;
  color: white;
}

.print-btn:hover {
  background: #138496;
}

@media (max-width: 768px) {
  .profit-summary {
    grid-template-columns: 1fr;
  }
  
  .profit-actions {
    flex-direction: column;
  }
}
</style>