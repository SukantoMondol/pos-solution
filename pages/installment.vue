<template>
  <div class="controls-container">
    <div class="top-buttons">
      <button class="home-btn" @click="goToHomePage">Home</button>
      <button class="create-btn" @click="openCreateModal">Installment</button>
      <button class="download-btn" @click="openDownloadModal">Download</button>
    </div>

    <div class="filter-section">
      <button class="filter-btn" @click="openFilterModal">Filter</button>
      <div>
        <label for="searchInput">Search</label>
        <input type="text" id="searchInput" v-model="searchQuery">
      </div>
      <button @click="filterAndDisplay">Apply Filter</button>
    </div>
    
    <div class="content">
      <div class="installment-section">
        <div class="installment-stats">
          <div class="stat-card">
            <div class="stat-icon">📅</div>
            <div class="stat-info">
              <h3>Due Today</h3>
              <p class="stat-value">{{ dueTodayCount }}</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">💰</div>
            <div class="stat-info">
              <h3>Total Due</h3>
              <p class="stat-value">${{ formatNumber(totalDueAmount) }}</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">⏰</div>
            <div class="stat-info">
              <h3>Overdue</h3>
              <p class="stat-value overdue">{{ overdueCount }}</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">✅</div>
            <div class="stat-info">
              <h3>Paid This Month</h3>
              <p class="stat-value">{{ paidThisMonthCount }}</p>
            </div>
          </div>
        </div>
        
        <div class="search-filter">
          <div class="search-box">
            <input type="text" v-model="searchQuery" placeholder="Search installments..." class="search-input">
            <button @click="searchInstallments" class="search-btn">Search</button>
          </div>
          <div class="filter-options">
            <select v-model="statusFilter" @change="filterInstallments" class="filter-select">
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
            <select v-model="dateFilter" @change="filterInstallments" class="filter-select">
              <option value="">All Dates</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>
        
        <div class="installments-table">
          <div class="table-header">
            <div class="header-cell">Customer</div>
            <div class="header-cell">Amount</div>
            <div class="header-cell">Due Date</div>
            <div class="header-cell">Status</div>
            <div class="header-cell">Payment Method</div>
            <div class="header-cell">Actions</div>
          </div>
          
          <div v-for="installment in filteredInstallments" :key="installment.id" class="table-row">
            <div class="cell customer">
              <div class="customer-info">
                <h4>{{ installment.customerName }}</h4>
                <p>{{ installment.customerPhone }}</p>
              </div>
            </div>
            <div class="cell amount">
              <span class="amount-value">${{ formatNumber(installment.amount) }}</span>
            </div>
            <div class="cell due-date">
              <span :class="{ 'overdue-date': installment.status === 'overdue' }">
                {{ formatDate(installment.dueDate) }}
              </span>
            </div>
            <div class="cell status">
              <span class="status-badge" :class="installment.status">{{ installment.status }}</span>
            </div>
            <div class="cell payment-method">
              {{ installment.paymentMethod || 'Not specified' }}
            </div>
            <div class="cell actions">
              <button v-if="installment.status !== 'paid'" @click="markAsPaid(installment)" class="action-btn pay">Pay</button>
              <button @click="viewInstallment(installment)" class="action-btn view">View</button>
              <button @click="editInstallment(installment)" class="action-btn edit">Edit</button>
              <button @click="deleteInstallment(installment.id)" class="action-btn delete">Delete</button>
            </div>
          </div>
        </div>
        
        <div v-if="filteredInstallments.length === 0" class="no-installments">
          <div class="no-installments-icon">💳</div>
          <h3>No Installments Found</h3>
          <p>Add your first installment to get started</p>
          <button @click="showAddModal = true" class="add-first-btn">Add Installment</button>
        </div>
      </div>
    </div>
    
    <!-- Add/Edit Installment Modal -->
    <div v-if="showAddModal || showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ showAddModal ? 'Add New Installment' : 'Edit Installment' }}</h2>
          <button @click="closeModal" class="close-btn">×</button>
        </div>
        
        <form @submit.prevent="saveInstallment" class="installment-form">
          <div class="form-row">
            <div class="form-group">
              <label for="customerName">Customer Name *</label>
              <input type="text" id="customerName" v-model="installmentForm.customerName" required>
            </div>
            <div class="form-group">
              <label for="customerPhone">Phone Number *</label>
              <input type="tel" id="customerPhone" v-model="installmentForm.customerPhone" required>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="amount">Installment Amount *</label>
              <input type="number" id="amount" v-model="installmentForm.amount" step="0.01" required>
            </div>
            <div class="form-group">
              <label for="dueDate">Due Date *</label>
              <input type="date" id="dueDate" v-model="installmentForm.dueDate" required>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="paymentMethod">Payment Method</label>
              <select id="paymentMethod" v-model="installmentForm.paymentMethod">
                <option value="">Select Method</option>
                <option value="cash">Cash</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="credit_card">Credit Card</option>
                <option value="mobile_payment">Mobile Payment</option>
              </select>
            </div>
            <div class="form-group">
              <label for="status">Status</label>
              <select id="status" v-model="installmentForm.status">
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>
          
          <div class="form-group">
            <label for="notes">Notes</label>
            <textarea id="notes" v-model="installmentForm.notes" rows="3"></textarea>
          </div>
          
          <div class="form-actions">
            <button type="button" @click="closeModal" class="cancel-btn">Cancel</button>
            <button type="submit" class="save-btn">Save Installment</button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Payment Modal -->
    <div v-if="showPaymentModal" class="modal-overlay" @click="closePaymentModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Record Payment</h2>
          <button @click="closePaymentModal" class="close-btn">×</button>
        </div>
        
        <form @submit.prevent="recordPayment" class="payment-form">
          <div class="payment-info">
            <h3>Payment Details</h3>
            <p><strong>Customer:</strong> {{ paymentInstallment.customerName }}</p>
            <p><strong>Amount:</strong> ${{ formatNumber(paymentInstallment.amount) }}</p>
            <p><strong>Due Date:</strong> {{ formatDate(paymentInstallment.dueDate) }}</p>
          </div>
          
          <div class="form-group">
            <label for="paymentAmount">Payment Amount *</label>
            <input type="number" id="paymentAmount" v-model="paymentForm.amount" step="0.01" required>
          </div>
          
          <div class="form-group">
            <label for="paymentMethod">Payment Method *</label>
            <select id="paymentMethod" v-model="paymentForm.method" required>
              <option value="">Select Method</option>
              <option value="cash">Cash</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="credit_card">Credit Card</option>
              <option value="mobile_payment">Mobile Payment</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="paymentDate">Payment Date *</label>
            <input type="date" id="paymentDate" v-model="paymentForm.date" required>
          </div>
          
          <div class="form-group">
            <label for="paymentNotes">Payment Notes</label>
            <textarea id="paymentNotes" v-model="paymentForm.notes" rows="3"></textarea>
          </div>
          
          <div class="form-actions">
            <button type="button" @click="closePaymentModal" class="cancel-btn">Cancel</button>
            <button type="submit" class="save-btn">Record Payment</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Installment Management'
})

const searchQuery = ref('')
const statusFilter = ref('')
const dateFilter = ref('')
const showAddModal = ref(false)
const showEditModal = ref(false)
const showPaymentModal = ref(false)
const editingInstallment = ref(null)
const paymentInstallment = ref(null)

const installmentForm = ref({
  customerName: '',
  customerPhone: '',
  amount: 0,
  dueDate: '',
  paymentMethod: '',
  status: 'pending',
  notes: ''
})

const paymentForm = ref({
  amount: 0,
  method: '',
  date: '',
  notes: ''
})

const installments = ref([
  {
    id: 1,
    customerName: 'আব্দুল হামিদ',
    customerPhone: '+880-1712-345678',
    amount: 500.00,
    dueDate: '2024-01-20',
    paymentMethod: 'bank_transfer',
    status: 'pending',
    notes: 'Monthly installment for loan #123'
  },
  {
    id: 2,
    customerName: 'সালমা খাতুন',
    customerPhone: '+880-1713-456789',
    amount: 750.00,
    dueDate: '2024-01-15',
    paymentMethod: 'cash',
    status: 'paid',
    notes: 'Paid on time'
  },
  {
    id: 3,
    customerName: 'রফিক উদ্দিন',
    customerPhone: '+880-1714-567890',
    amount: 300.00,
    dueDate: '2024-01-10',
    paymentMethod: 'credit_card',
    status: 'overdue',
    notes: 'Overdue payment'
  },
  {
    id: 4,
    customerName: 'নাজমা বেগম',
    customerPhone: '+880-1715-678901',
    amount: 1000.00,
    dueDate: '2024-01-25',
    paymentMethod: 'mobile_payment',
    status: 'pending',
    notes: 'Final installment'
  }
])

const filteredInstallments = computed(() => {
  let filtered = installments.value
  
  if (searchQuery.value) {
    filtered = filtered.filter(installment => 
      installment.customerName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      installment.customerPhone.includes(searchQuery.value)
    )
  }
  
  if (statusFilter.value) {
    filtered = filtered.filter(installment => installment.status === statusFilter.value)
  }
  
  if (dateFilter.value) {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const weekFromNow = new Date(today)
    weekFromNow.setDate(weekFromNow.getDate() + 7)
    const monthFromNow = new Date(today)
    monthFromNow.setMonth(monthFromNow.getMonth() + 1)
    
    filtered = filtered.filter(installment => {
      const dueDate = new Date(installment.dueDate)
      switch (dateFilter.value) {
        case 'today':
          return dueDate.toDateString() === today.toDateString()
        case 'week':
          return dueDate >= today && dueDate <= weekFromNow
        case 'month':
          return dueDate >= today && dueDate <= monthFromNow
        default:
          return true
      }
    })
  }
  
  return filtered
})

const dueTodayCount = computed(() => {
  const today = new Date().toDateString()
  return installments.value.filter(installment => 
    new Date(installment.dueDate).toDateString() === today && installment.status !== 'paid'
  ).length
})

const totalDueAmount = computed(() => {
  return installments.value
    .filter(installment => installment.status !== 'paid')
    .reduce((sum, installment) => sum + installment.amount, 0)
})

const overdueCount = computed(() => {
  const today = new Date()
  return installments.value.filter(installment => 
    installment.status === 'overdue' || 
    (new Date(installment.dueDate) < today && installment.status !== 'paid')
  ).length
})

const paidThisMonthCount = computed(() => {
  const thisMonth = new Date().getMonth()
  const thisYear = new Date().getFullYear()
  return installments.value.filter(installment => {
    const dueDate = new Date(installment.dueDate)
    return installment.status === 'paid' && 
           dueDate.getMonth() === thisMonth && 
           dueDate.getFullYear() === thisYear
  }).length
})

const goBack = () => {
  if (process.client) {
    window.location.href = '/'
  }
}

const searchInstallments = () => {
  // Search is handled by computed property
}

const filterInstallments = () => {
  // Filtering is handled by computed property
}

const markAsPaid = (installment: any) => {
  paymentInstallment.value = installment
  paymentForm.value.amount = installment.amount
  paymentForm.value.date = new Date().toISOString().split('T')[0]
  showPaymentModal.value = true
}

const viewInstallment = (installment: any) => {
  alert(`Viewing installment: ${installment.customerName} - $${formatNumber(installment.amount)}`)
}

const editInstallment = (installment: any) => {
  editingInstallment.value = installment
  installmentForm.value = { ...installment }
  showEditModal.value = true
}

const deleteInstallment = (id: number) => {
  if (confirm('Are you sure you want to delete this installment?')) {
    installments.value = installments.value.filter(installment => installment.id !== id)
    alert('Installment deleted successfully!')
  }
}

const saveInstallment = () => {
  if (showAddModal.value) {
    const newInstallment = {
      id: Date.now(),
      ...installmentForm.value
    }
    installments.value.push(newInstallment)
    alert('Installment added successfully!')
  } else {
    const index = installments.value.findIndex(installment => installment.id === editingInstallment.value.id)
    if (index !== -1) {
      installments.value[index] = { ...installments.value[index], ...installmentForm.value }
      alert('Installment updated successfully!')
    }
  }
  
  closeModal()
}

const recordPayment = () => {
  const index = installments.value.findIndex(installment => installment.id === paymentInstallment.value.id)
  if (index !== -1) {
    installments.value[index].status = 'paid'
    installments.value[index].paymentMethod = paymentForm.value.method
    alert('Payment recorded successfully!')
  }
  
  closePaymentModal()
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingInstallment.value = null
  installmentForm.value = {
    customerName: '',
    customerPhone: '',
    amount: 0,
    dueDate: '',
    paymentMethod: '',
    status: 'pending',
    notes: ''
  }
}

const closePaymentModal = () => {
  showPaymentModal.value = false
  paymentInstallment.value = null
  paymentForm.value = {
    amount: 0,
    method: '',
    date: '',
    notes: ''
  }
}

const formatNumber = (num: number) => {
  return num.toLocaleString('en-US', { minimumFractionDigits: 2 })
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<style scoped>
body {
  font-family: 'Roboto', sans-serif;
  background: #f5f5f5;
  padding: 20px;
  margin: 0;
  box-sizing: border-box;
}

.controls-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
  padding: 15px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.top-buttons {
  display: flex;
  gap: 10px;
  width: 100%;
}

.top-buttons button {
  flex: 1;
  padding: 10px;
  font-size: 14px;
  border: none;
  color: white;
  cursor: pointer;
  border-radius: 5px;
  transition: background 0.3s ease;
}

.home-btn {
  background: #009688;
}

.home-btn:hover {
  background: #007a6a;
}

.create-btn {
  background: #4caf50;
}

.create-btn:hover {
  background: #388e3c;
}

.download-btn {
  background: #007bff;
}

.download-btn:hover {
  background: #0056b3;
}

.filter-section {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  width: 100%;
  align-items: flex-end;
}

.filter-section > div {
  flex: 1 1 30%;
  min-width: 100px;
  position: relative;
}

.filter-section button {
  flex: 1 1 calc(33.33% - 10px);
  max-width: 100px;
  padding: 8px 15px;
  background: #444;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s ease;
  white-space: nowrap;
}

.filter-section button:hover {
  background: #555;
}

.filter-section label {
  position: absolute;
  top: 10px;
  left: 10px;
  background: transparent;
  padding: 0 5px;
  font-size: 14px;
  color: #888;
  pointer-events: none;
  transition: all 0.2s ease-out;
  font-weight: normal;
  z-index: 1;
}

.filter-section input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  background: #fff;
}

.filter-modal {
  display: flex;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
  justify-content: center;
  align-items: center;
}

.filter-modal-content {
  background-color: #fefefe;
  margin: auto;
  padding: 20px;
  border: 1px solid #888;
  width: 50%;
  max-width: 400px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  animation: animatetop 0.4s;
  display: flex;
  flex-direction: column;
  gap: 15px;
  text-align: center;
}

@keyframes animatetop {
  from { top: -300px; opacity: 0 }
  to { top: 0; opacity: 1 }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
  text-align: left;
}

.form-group label {
  font-weight: bold;
  color: #333;
}

.form-group select,
.form-group input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.filter-modal-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.close-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.apply-filter-btn {
  background: #007a6a;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.apply-filter-btn:hover {
  background: #007a6a;
}

.content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.installment-stats {
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

.stat-value.overdue {
  color: #dc3545;
}

.search-filter {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.search-box {
  display: flex;
  flex: 1;
  min-width: 300px;
}

.search-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
  font-size: 16px;
}

.search-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
}

.filter-select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  min-width: 150px;
}

.installments-table {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 2fr;
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
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 2fr;
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

.customer-info h4 {
  margin: 0 0 5px 0;
  color: #333;
  font-size: 16px;
}

.customer-info p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.amount-value {
  font-weight: bold;
  color: #28a745;
  font-size: 16px;
}

.overdue-date {
  color: #dc3545;
  font-weight: bold;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
}

.status-badge.pending {
  background: #fff3cd;
  color: #856404;
}

.status-badge.paid {
  background: #d4edda;
  color: #155724;
}

.status-badge.overdue {
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

.action-btn.pay {
  background: #28a745;
  color: white;
}

.action-btn.view {
  background: #17a2b8;
  color: white;
}

.action-btn.edit {
  background: #ffc107;
  color: #212529;
}

.action-btn.delete {
  background: #dc3545;
  color: white;
}

.no-installments {
  text-align: center;
  padding: 60px 20px;
}

.no-installments-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.no-installments h3 {
  margin-bottom: 10px;
  color: #333;
}

.no-installments p {
  margin-bottom: 20px;
  color: #666;
}

.add-first-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
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

.installment-form,
.payment-form {
  padding: 20px;
}

.payment-info {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.payment-info h3 {
  margin: 0 0 10px 0;
  color: #333;
}

.payment-info p {
  margin: 5px 0;
  color: #666;
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
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 30px;
}

.cancel-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.save-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .installments-table {
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
  
  .search-filter {
    flex-direction: column;
  }
  
  .search-box {
    min-width: auto;
  }
}
</style>
