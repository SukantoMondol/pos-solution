<template>
  <div class="page-container">
    <div class="header">
      <button class="back-btn" @click="goBack">← Back</button>
      <h1>SSL eCommerce Integration</h1>
      <button class="add-btn" @click="showAddModal = true">+ Add Integration</button>
    </div>
    
    <div class="content">
      <div class="ssl-section">
        <div class="integration-info">
          <div class="info-card">
            <div class="info-icon">🔒</div>
            <div class="info-content">
              <h2>SSL eCommerce Payment Gateway</h2>
              <p>Integrate with SSL eCommerce for secure online payments, mobile banking, and digital wallet transactions. Accept payments from customers across Bangladesh.</p>
            </div>
          </div>
        </div>
        
        <div class="integration-stats">
          <div class="stat-card">
            <div class="stat-icon">💰</div>
            <div class="stat-info">
              <h3>Total Transactions</h3>
              <p class="stat-value">{{ formatNumber(totalTransactions) }}</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">✅</div>
            <div class="stat-info">
              <h3>Successful</h3>
              <p class="stat-value success">{{ formatNumber(successfulTransactions) }}</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">❌</div>
            <div class="stat-info">
              <h3>Failed</h3>
              <p class="stat-value failed">{{ formatNumber(failedTransactions) }}</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">📊</div>
            <div class="stat-info">
              <h3>Success Rate</h3>
              <p class="stat-value">{{ successRate }}%</p>
            </div>
          </div>
        </div>
        
        <div class="configuration-section">
          <h3>SSL eCommerce Configuration</h3>
          <div class="config-grid">
            <div class="config-card">
              <div class="config-header">
                <h4>API Configuration</h4>
                <span class="status" :class="apiConfig.status">{{ apiConfig.status }}</span>
              </div>
              <div class="config-content">
                <div class="config-item">
                  <label>Store ID</label>
                  <input type="text" v-model="apiConfig.storeId" :disabled="!apiConfig.editable">
                </div>
                <div class="config-item">
                  <label>Store Password</label>
                  <input type="password" v-model="apiConfig.storePassword" :disabled="!apiConfig.editable">
                </div>
                <div class="config-item">
                  <label>API URL</label>
                  <input type="url" v-model="apiConfig.apiUrl" :disabled="!apiConfig.editable">
                </div>
                <div class="config-item">
                  <label>Environment</label>
                  <select v-model="apiConfig.environment" :disabled="!apiConfig.editable">
                    <option value="sandbox">Sandbox (Test)</option>
                    <option value="production">Production (Live)</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div class="config-card">
              <div class="config-header">
                <h4>Payment Methods</h4>
                <span class="status active">Active</span>
              </div>
              <div class="config-content">
                <div class="payment-method" v-for="method in paymentMethods" :key="method.id">
                  <div class="method-info">
                    <span class="method-icon">{{ method.icon }}</span>
                    <span class="method-name">{{ method.name }}</span>
                  </div>
                  <div class="method-status">
                    <label class="switch">
                      <input type="checkbox" v-model="method.enabled">
                      <span class="slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="config-card">
              <div class="config-header">
                <h4>Transaction Settings</h4>
                <span class="status active">Active</span>
              </div>
              <div class="config-content">
                <div class="config-item">
                  <label>Minimum Amount (BDT)</label>
                  <input type="number" v-model="transactionSettings.minAmount" min="1">
                </div>
                <div class="config-item">
                  <label>Maximum Amount (BDT)</label>
                  <input type="number" v-model="transactionSettings.maxAmount" min="1">
                </div>
                <div class="config-item">
                  <label>Transaction Timeout (minutes)</label>
                  <input type="number" v-model="transactionSettings.timeout" min="1" max="30">
                </div>
                <div class="config-item">
                  <label>Auto Capture</label>
                  <input type="checkbox" v-model="transactionSettings.autoCapture">
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="transactions-section">
          <h3>Recent Transactions</h3>
          <div class="transactions-table">
            <div class="table-header">
              <div class="header-cell">Transaction ID</div>
              <div class="header-cell">Customer</div>
              <div class="header-cell">Amount</div>
              <div class="header-cell">Method</div>
              <div class="header-cell">Status</div>
              <div class="header-cell">Date</div>
              <div class="header-cell">Actions</div>
            </div>
            
            <div v-for="transaction in recentTransactions" :key="transaction.id" class="table-row">
              <div class="cell transaction-id">{{ transaction.transactionId }}</div>
              <div class="cell customer">{{ transaction.customerName }}</div>
              <div class="cell amount">৳{{ formatNumber(transaction.amount) }}</div>
              <div class="cell method">{{ transaction.paymentMethod }}</div>
              <div class="cell status">
                <span class="status-badge" :class="transaction.status">{{ transaction.status }}</span>
              </div>
              <div class="cell date">{{ formatDate(transaction.date) }}</div>
              <div class="cell actions">
                <button @click="viewTransaction(transaction)" class="action-btn view">View</button>
                <button v-if="transaction.status === 'pending'" @click="refundTransaction(transaction)" class="action-btn refund">Refund</button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="test-section">
          <h3>Test Integration</h3>
          <div class="test-card">
            <div class="test-form">
              <div class="form-row">
                <div class="form-group">
                  <label for="testAmount">Test Amount (BDT)</label>
                  <input type="number" id="testAmount" v-model="testAmount" min="1" step="0.01">
                </div>
                <div class="form-group">
                  <label for="testMethod">Payment Method</label>
                  <select id="testMethod" v-model="testMethod">
                    <option value="card">Credit/Debit Card</option>
                    <option value="mobile">Mobile Banking</option>
                    <option value="bank">Internet Banking</option>
                    <option value="wallet">Digital Wallet</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label for="testCustomer">Customer Name</label>
                <input type="text" id="testCustomer" v-model="testCustomer" placeholder="Enter customer name">
              </div>
              <button @click="runTest" class="test-btn" :disabled="isTesting">
                {{ isTesting ? 'Testing...' : 'Run Test Transaction' }}
              </button>
            </div>
          </div>
        </div>
        
        <div class="action-buttons">
          <button @click="saveConfiguration" class="save-btn">Save Configuration</button>
          <button @click="testConnection" class="test-connection-btn">Test Connection</button>
          <button @click="viewLogs" class="logs-btn">View Logs</button>
          <button @click="exportTransactions" class="export-btn">Export Transactions</button>
        </div>
      </div>
    </div>
    
    <!-- Transaction Details Modal -->
    <div v-if="showTransactionModal" class="modal-overlay" @click="closeTransactionModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Transaction Details</h2>
          <button @click="closeTransactionModal" class="close-btn">×</button>
        </div>
        
        <div class="transaction-details" v-if="selectedTransaction">
          <div class="detail-section">
            <h3>Transaction Information</h3>
            <div class="detail-grid">
              <div class="detail-item">
                <span class="label">Transaction ID:</span>
                <span class="value">{{ selectedTransaction.transactionId }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Amount:</span>
                <span class="value">৳{{ formatNumber(selectedTransaction.amount) }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Status:</span>
                <span class="value status-badge" :class="selectedTransaction.status">{{ selectedTransaction.status }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Payment Method:</span>
                <span class="value">{{ selectedTransaction.paymentMethod }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Customer:</span>
                <span class="value">{{ selectedTransaction.customerName }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Date:</span>
                <span class="value">{{ formatDate(selectedTransaction.date) }}</span>
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
  title: 'SSL eCommerce Integration'
})

const showAddModal = ref(false)
const showTransactionModal = ref(false)
const selectedTransaction = ref(null)
const isTesting = ref(false)

const testAmount = ref(100)
const testMethod = ref('card')
const testCustomer = ref('Test Customer')

const apiConfig = ref({
  storeId: 'sslstore123',
  storePassword: '********',
  apiUrl: 'https://sandbox.sslcommerz.com/gwprocess/v3/api.php',
  environment: 'sandbox',
  status: 'active',
  editable: false
})

const paymentMethods = ref([
  { id: 1, name: 'Credit/Debit Card', icon: '💳', enabled: true },
  { id: 2, name: 'Mobile Banking', icon: '📱', enabled: true },
  { id: 3, name: 'Internet Banking', icon: '🏦', enabled: true },
  { id: 4, name: 'Digital Wallet', icon: '💰', enabled: false },
  { id: 5, name: 'Cash on Delivery', icon: '💵', enabled: true }
])

const transactionSettings = ref({
  minAmount: 1,
  maxAmount: 100000,
  timeout: 15,
  autoCapture: true
})

const recentTransactions = ref([
  {
    id: 1,
    transactionId: 'TXN001234567',
    customerName: 'মোহাম্মদ হাসান',
    amount: 1500.00,
    paymentMethod: 'Credit Card',
    status: 'success',
    date: new Date('2024-01-20')
  },
  {
    id: 2,
    transactionId: 'TXN001234568',
    customerName: 'রোকসানা আক্তার',
    amount: 2500.00,
    paymentMethod: 'Mobile Banking',
    status: 'success',
    date: new Date('2024-01-19')
  },
  {
    id: 3,
    transactionId: 'TXN001234569',
    customerName: 'আবুল কালাম',
    amount: 800.00,
    paymentMethod: 'Internet Banking',
    status: 'pending',
    date: new Date('2024-01-18')
  },
  {
    id: 4,
    transactionId: 'TXN001234570',
    customerName: 'নাসিরা খাতুন',
    amount: 3200.00,
    paymentMethod: 'Digital Wallet',
    status: 'failed',
    date: new Date('2024-01-17')
  }
])

const totalTransactions = computed(() => recentTransactions.value.length)
const successfulTransactions = computed(() => 
  recentTransactions.value.filter(t => t.status === 'success').length
)
const failedTransactions = computed(() => 
  recentTransactions.value.filter(t => t.status === 'failed').length
)
const successRate = computed(() => 
  totalTransactions.value > 0 ? 
  Math.round((successfulTransactions.value / totalTransactions.value) * 100) : 0
)

const goBack = () => {
  if (process.client) {
    window.location.href = '/'
  }
}

const saveConfiguration = () => {
  alert('SSL eCommerce configuration saved successfully!')
}

const testConnection = () => {
  alert('Testing SSL eCommerce connection...')
}

const runTest = async () => {
  isTesting.value = true
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 2000))
  isTesting.value = false
  alert(`Test transaction completed! Amount: ৳${testAmount.value}, Method: ${testMethod.value}`)
}

const viewTransaction = (transaction: any) => {
  selectedTransaction.value = transaction
  showTransactionModal.value = true
}

const refundTransaction = (transaction: any) => {
  if (confirm(`Refund transaction ${transaction.transactionId} for ৳${formatNumber(transaction.amount)}?`)) {
    alert('Refund processed successfully!')
  }
}

const viewLogs = () => {
  alert('Opening transaction logs...')
}

const exportTransactions = () => {
  alert('Exporting transaction data...')
}

const closeTransactionModal = () => {
  showTransactionModal.value = false
  selectedTransaction.value = null
}

const formatNumber = (num: number) => {
  return num.toLocaleString('en-US', { minimumFractionDigits: 2 })
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
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
  justify-content: space-between;
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
}

.add-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.integration-info {
  margin-bottom: 30px;
}

.info-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.info-icon {
  font-size: 48px;
}

.info-content h2 {
  margin: 0 0 10px 0;
  font-size: 24px;
}

.info-content p {
  margin: 0;
  font-size: 16px;
  line-height: 1.6;
}

.integration-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.stat-icon {
  font-size: 32px;
}

.stat-info h3 {
  margin: 0 0 5px 0;
  color: #333;
  font-size: 14px;
}

.stat-value {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
  color: #007bff;
}

.stat-value.success {
  color: #28a745;
}

.stat-value.failed {
  color: #dc3545;
}

.configuration-section {
  margin-bottom: 30px;
}

.configuration-section h3 {
  margin-bottom: 20px;
  color: #333;
}

.config-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
}

.config-card {
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
}

.config-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.config-header h4 {
  margin: 0;
  color: #333;
}

.status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
}

.status.active {
  background: #d4edda;
  color: #155724;
}

.config-item {
  margin-bottom: 15px;
}

.config-item label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

.config-item input,
.config-item select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.payment-method {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.payment-method:last-child {
  border-bottom: none;
}

.method-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.method-icon {
  font-size: 20px;
}

.method-name {
  font-weight: bold;
  color: #333;
}

.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #007bff;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.transactions-section {
  margin-bottom: 30px;
}

.transactions-section h3 {
  margin-bottom: 20px;
  color: #333;
}

.transactions-table {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr 1fr;
  background: #f8f9fa;
  font-weight: bold;
  color: #333;
}

.header-cell {
  padding: 15px;
  border-right: 1px solid #ddd;
}

.header-cell:last-child {
  border-right: none;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr 1fr;
  border-bottom: 1px solid #ddd;
  transition: background-color 0.3s ease;
}

.table-row:hover {
  background: #f8f9fa;
}

.table-row:last-child {
  border-bottom: none;
}

.cell {
  padding: 15px;
  border-right: 1px solid #ddd;
  display: flex;
  align-items: center;
}

.cell:last-child {
  border-right: none;
}

.transaction-id {
  font-family: monospace;
  font-size: 12px;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
}

.status-badge.success {
  background: #d4edda;
  color: #155724;
}

.status-badge.pending {
  background: #fff3cd;
  color: #856404;
}

.status-badge.failed {
  background: #f8d7da;
  color: #721c24;
}

.actions {
  gap: 5px;
}

.action-btn {
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
  margin-right: 5px;
}

.action-btn.view {
  background: #17a2b8;
  color: white;
}

.action-btn.refund {
  background: #ffc107;
  color: #212529;
}

.test-section {
  margin-bottom: 30px;
}

.test-section h3 {
  margin-bottom: 20px;
  color: #333;
}

.test-card {
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
}

.test-form {
  max-width: 500px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.test-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
}

.test-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.action-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.save-btn,
.test-connection-btn,
.logs-btn,
.export-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
}

.save-btn {
  background: #28a745;
  color: white;
}

.test-connection-btn {
  background: #17a2b8;
  color: white;
}

.logs-btn {
  background: #6c757d;
  color: white;
}

.export-btn {
  background: #007bff;
  color: white;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #ddd;
}

.modal-header h2 {
  margin: 0;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.transaction-details {
  padding: 20px;
}

.detail-section h3 {
  margin-bottom: 15px;
  color: #333;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.label {
  font-weight: bold;
  color: #666;
  font-size: 14px;
}

.value {
  color: #333;
  font-size: 16px;
}

@media (max-width: 768px) {
  .config-grid {
    grid-template-columns: 1fr;
  }
  
  .transactions-table {
    overflow-x: auto;
  }
  
  .table-header,
  .table-row {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  
  .header-cell,
  .cell {
    border-right: none;
    border-bottom: 1px solid #ddd;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>
