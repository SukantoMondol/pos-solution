<template>
  <div class="page-container">
    <div class="header">
      <button class="back-btn" @click="goBack">← Back to Home</button>
      <h1>All Available Pages</h1>
    </div>
    
    <div class="content">
      <div class="pages-section">
        <h2>Main Application Pages</h2>
        <div class="pages-grid">
          <div class="page-card" v-for="page in mainPages" :key="page.name">
            <div class="page-icon">{{ page.icon }}</div>
            <h3>{{ page.name }}</h3>
            <p>{{ page.description }}</p>
            <a :href="page.url" class="page-link">Visit Page</a>
          </div>
        </div>
        
        <h2>Management Pages</h2>
        <div class="pages-grid">
          <div class="page-card" v-for="page in managementPages" :key="page.name">
            <div class="page-icon">{{ page.icon }}</div>
            <h3>{{ page.name }}</h3>
            <p>{{ page.description }}</p>
            <a :href="page.url" class="page-link">Visit Page</a>
          </div>
        </div>
        
        <h2>Settings & Configuration</h2>
        <div class="pages-grid">
          <div class="page-card" v-for="page in settingsPages" :key="page.name">
            <div class="page-icon">{{ page.icon }}</div>
            <h3>{{ page.name }}</h3>
            <p>{{ page.description }}</p>
            <a :href="page.url" class="page-link">Visit Page</a>
          </div>
        </div>
        
        <h2>Financial & Payment</h2>
        <div class="pages-grid">
          <div class="page-card" v-for="page in financialPages" :key="page.name">
            <div class="page-icon">{{ page.icon }}</div>
            <h3>{{ page.name }}</h3>
            <p>{{ page.description }}</p>
            <a :href="page.url" class="page-link">Visit Page</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'All Available Pages'
})

const mainPages = ref([
  { name: 'Home', description: 'Main dashboard and overview', url: '/', icon: '🏠' },
  { name: 'Login', description: 'User authentication', url: '/login', icon: '🔐' },
  { name: 'Products', description: 'Product management and inventory', url: '/products', icon: '📦' },
  { name: 'Customers', description: 'Customer information and management', url: '/customers', icon: '👥' },
  { name: 'Sales', description: 'Sales transactions and records', url: '/sales', icon: '💰' },
  { name: 'Purchase', description: 'Purchase orders and supplier management', url: '/purchase', icon: '🛒' },
  { name: 'Reports', description: 'Analytics and reporting dashboard', url: '/reports', icon: '📊' }
])

const managementPages = ref([
  { name: 'Bank', description: 'Bank account management', url: '/bank', icon: '🏦' },
  { name: 'Loan', description: 'Loan management and tracking', url: '/loan', icon: '💳' },
  { name: 'Installment', description: 'Installment payment tracking', url: '/installment', icon: '📅' },
  { name: 'Employee', description: 'Employee management system', url: '/employee', icon: '👨‍💼' },
  { name: 'Salary', description: 'Salary processing and management', url: '/salary', icon: '💵' },
  { name: 'Supplier', description: 'Supplier information and management', url: '/supplier', icon: '🏢' },
  { name: 'Accounts', description: 'Account management and tracking', url: '/accounts', icon: '📋' },
  { name: 'Expense', description: 'Expense tracking and management', url: '/expense', icon: '💸' }
])

const settingsPages = ref([
  { name: 'Profile', description: 'User profile management', url: '/profile', icon: '👤' },
  { name: 'Currency', description: 'Currency settings and exchange rates', url: '/currency', icon: '💱' },
  { name: 'Languages', description: 'Language settings and preferences', url: '/languages', icon: '🌐' },
  { name: 'Bangla', description: 'Bengali language support and configuration', url: '/bangla', icon: '🇧🇩' },
  { name: 'Printer', description: 'Printer configuration and settings', url: '/printer', icon: '🖨️' },
  { name: 'Export', description: 'Data export and backup settings', url: '/export', icon: '📤' },
  { name: 'Details', description: 'Application details and information', url: '/details', icon: 'ℹ️' },
  { name: 'Upgrade', description: 'Subscription and upgrade options', url: '/upgrade', icon: '⬆️' }
])

const financialPages = ref([
  { name: 'Ad Money', description: 'Advertisement money management', url: '/admoney', icon: '📢' },
  { name: 'Send Money', description: 'Money transfer and sending', url: '/sendmoney', icon: '📤' },
  { name: 'Cash Out', description: 'Cash withdrawal and management', url: '/cashout', icon: '💸' },
  { name: 'Payment', description: 'Payment processing and management', url: '/payment', icon: '💳' },
  { name: 'Return', description: 'Return and refund management', url: '/return', icon: '↩️' },
  { name: 'Profit', description: 'Profit analysis and tracking', url: '/profit', icon: '📈' },
  { name: 'Recharge', description: 'Mobile and utility recharge', url: '/recharge', icon: '📱' },
  { name: 'Electricity', description: 'Electricity bill payment', url: '/electricity', icon: '⚡' },
  { name: 'QR Code', description: 'QR code generation and management', url: '/qrcode', icon: '📱' },
  { name: 'SSL eCommerce', description: 'Payment gateway integration', url: '/sslecomerz', icon: '🔒' },
  { name: 'Documents', description: 'Document management system', url: '/document', icon: '📄' }
])

const goBack = () => {
  if (process.client) {
    window.location.href = '/'
  }
}
</script>

<style scoped>
.page-container {
  padding: 20px;
  max-width: 1400px;
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

.pages-section h2 {
  margin: 30px 0 20px 0;
  color: #333;
  border-bottom: 2px solid #007bff;
  padding-bottom: 10px;
}

.pages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.page-card {
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
}

.page-card:hover {
  border-color: #007bff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.page-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.page-card h3 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 18px;
}

.page-card p {
  margin: 0 0 15px 0;
  color: #666;
  font-size: 14px;
  line-height: 1.4;
}

.page-link {
  display: inline-block;
  background: #007bff;
  color: white;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.page-link:hover {
  background: #0056b3;
}

@media (max-width: 768px) {
  .pages-grid {
    grid-template-columns: 1fr;
  }
}
</style>

