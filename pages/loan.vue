<template>
  <div class="controls-container">
    <div class="top-buttons">
      <button class="home-btn" @click="goToHomePage">Home</button>
      <button class="installment-btn" @click="openCreateModal">Cteate Loan</button>
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
      <div class="loan-section">
        <div class="loan-stats">
          <div class="stat-card">
            <div class="stat-icon">💰</div>
            <div class="stat-info">
              <h3>Total Loans</h3>
              <p class="stat-value">${{ formatNumber(totalLoans) }}</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">📊</div>
            <div class="stat-info">
              <h3>Active Loans</h3>
              <p class="stat-value">{{ activeLoansCount }}</p>
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
              <h3>Paid Off</h3>
              <p class="stat-value">{{ paidOffCount }}</p>
            </div>
          </div>
        </div>
        
        <div class="search-filter">
          <div class="search-box">
            <input type="text" v-model="searchQuery" placeholder="Search loans..." class="search-input">
            <button @click="searchLoans" class="search-btn">Search</button>
          </div>
          <div class="filter-options">
            <select v-model="statusFilter" @change="filterLoans" class="filter-select">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="overdue">Overdue</option>
              <option value="paid">Paid Off</option>
            </select>
          </div>
        </div>
        
        <div class="loans-table">
          <div class="table-header">
            <div class="header-cell">Borrower</div>
            <div class="header-cell">Amount</div>
            <div class="header-cell">Interest Rate</div>
            <div class="header-cell">Term</div>
            <div class="header-cell">Status</div>
            <div class="header-cell">Actions</div>
          </div>
          
          <div v-for="loan in filteredLoans" :key="loan.id" class="table-row">
            <div class="cell borrower">
              <div class="borrower-info">
                <h4>{{ loan.borrowerName }}</h4>
                <p>{{ loan.borrowerPhone }}</p>
              </div>
            </div>
            <div class="cell amount">
              <span class="amount-value">${{ formatNumber(loan.amount) }}</span>
            </div>
            <div class="cell interest">
              {{ loan.interestRate }}%
            </div>
            <div class="cell term">
              {{ loan.term }} months
            </div>
            <div class="cell status">
              <span class="status-badge" :class="loan.status">{{ loan.status }}</span>
            </div>
            <div class="cell actions">
              <button @click="viewLoan(loan)" class="action-btn view">View</button>
              <button @click="editLoan(loan)" class="action-btn edit">Edit</button>
              <button @click="deleteLoan(loan.id)" class="action-btn delete">Delete</button>
            </div>
          </div>
        </div>
        
        <div v-if="filteredLoans.length === 0" class="no-loans">
          <div class="no-loans-icon">💳</div>
          <h3>No Loans Found</h3>
          <p>Add your first loan to get started</p>
          <button @click="showAddModal = true" class="add-first-btn">Add Loan</button>
        </div>
      </div>
    </div>
    
    <!-- Add/Edit Loan Modal -->
    <div v-if="showAddModal || showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ showAddModal ? 'Add New Loan' : 'Edit Loan' }}</h2>
          <button @click="closeModal" class="close-btn">×</button>
        </div>
        
        <form @submit.prevent="saveLoan" class="loan-form">
          <div class="form-row">
            <div class="form-group">
              <label for="borrowerName">Borrower Name *</label>
              <input type="text" id="borrowerName" v-model="loanForm.borrowerName" required>
            </div>
            <div class="form-group">
              <label for="borrowerPhone">Phone Number *</label>
              <input type="tel" id="borrowerPhone" v-model="loanForm.borrowerPhone" required>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="amount">Loan Amount *</label>
              <input type="number" id="amount" v-model="loanForm.amount" step="0.01" required>
            </div>
            <div class="form-group">
              <label for="interestRate">Interest Rate (%) *</label>
              <input type="number" id="interestRate" v-model="loanForm.interestRate" step="0.01" required>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="term">Loan Term (months) *</label>
              <input type="number" id="term" v-model="loanForm.term" required>
            </div>
            <div class="form-group">
              <label for="startDate">Start Date *</label>
              <input type="date" id="startDate" v-model="loanForm.startDate" required>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="loanType">Loan Type</label>
              <select id="loanType" v-model="loanForm.loanType">
                <option value="personal">Personal Loan</option>
                <option value="business">Business Loan</option>
                <option value="mortgage">Mortgage</option>
                <option value="auto">Auto Loan</option>
              </select>
            </div>
            <div class="form-group">
              <label for="status">Status</label>
              <select id="status" v-model="loanForm.status">
                <option value="active">Active</option>
                <option value="overdue">Overdue</option>
                <option value="paid">Paid Off</option>
              </select>
            </div>
          </div>
          
          <div class="form-group">
            <label for="notes">Notes</label>
            <textarea id="notes" v-model="loanForm.notes" rows="3"></textarea>
          </div>
          
          <div class="form-actions">
            <button type="button" @click="closeModal" class="cancel-btn">Cancel</button>
            <button type="submit" class="save-btn">Save Loan</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Loan Management'
})

const searchQuery = ref('')
const statusFilter = ref('')
const showAddModal = ref(false)
const showEditModal = ref(false)
const editingLoan = ref(null)

const loanForm = ref({
  borrowerName: '',
  borrowerPhone: '',
  amount: 0,
  interestRate: 0,
  term: 0,
  startDate: '',
  loanType: 'personal',
  status: 'active',
  notes: ''
})

const loans = ref([
  {
    id: 1,
    borrowerName: 'মোহাম্মদ আলী',
    borrowerPhone: '+880-1712-345678',
    amount: 10000.00,
    interestRate: 5.5,
    term: 24,
    startDate: '2024-01-01',
    loanType: 'personal',
    status: 'active',
    notes: 'Personal loan for home improvement'
  },
  {
    id: 2,
    borrowerName: 'রোকসানা পারভীন',
    borrowerPhone: '+880-1713-456789',
    amount: 25000.00,
    interestRate: 4.2,
    term: 36,
    startDate: '2023-12-15',
    loanType: 'business',
    status: 'active',
    notes: 'Business expansion loan'
  },
  {
    id: 3,
    borrowerName: 'আবুল কালাম',
    borrowerPhone: '+880-1714-567890',
    amount: 15000.00,
    interestRate: 6.0,
    term: 12,
    startDate: '2023-10-01',
    loanType: 'personal',
    status: 'overdue',
    notes: 'Emergency personal loan'
  },
  {
    id: 4,
    borrowerName: 'রাবেয়া খাতুন',
    borrowerPhone: '+880-1715-678901',
    amount: 5000.00,
    interestRate: 7.5,
    term: 18,
    startDate: '2023-06-01',
    loanType: 'personal',
    status: 'paid',
    notes: 'Paid off early'
  }
])

const filteredLoans = computed(() => {
  let filtered = loans.value
  
  if (searchQuery.value) {
    filtered = filtered.filter(loan => 
      loan.borrowerName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      loan.borrowerPhone.includes(searchQuery.value)
    )
  }
  
  if (statusFilter.value) {
    filtered = filtered.filter(loan => loan.status === statusFilter.value)
  }
  
  return filtered
})

const totalLoans = computed(() => {
  return loans.value.reduce((sum, loan) => sum + loan.amount, 0)
})

const activeLoansCount = computed(() => {
  return loans.value.filter(loan => loan.status === 'active').length
})

const overdueCount = computed(() => {
  return loans.value.filter(loan => loan.status === 'overdue').length
})

const paidOffCount = computed(() => {
  return loans.value.filter(loan => loan.status === 'paid').length
})

const goBack = () => {
  if (process.client) {
    window.location.href = '/'
  }
}

const searchLoans = () => {
  // Search is handled by computed property
}

const filterLoans = () => {
  // Filtering is handled by computed property
}

const viewLoan = (loan: any) => {
  alert(`Viewing loan: ${loan.borrowerName} - $${formatNumber(loan.amount)}`)
}

const editLoan = (loan: any) => {
  editingLoan.value = loan
  loanForm.value = { ...loan }
  showEditModal.value = true
}

const deleteLoan = (id: number) => {
  if (confirm('Are you sure you want to delete this loan?')) {
    loans.value = loans.value.filter(loan => loan.id !== id)
    alert('Loan deleted successfully!')
  }
}

const saveLoan = () => {
  if (showAddModal.value) {
    const newLoan = {
      id: Date.now(),
      ...loanForm.value
    }
    loans.value.push(newLoan)
    alert('Loan added successfully!')
  } else {
    const index = loans.value.findIndex(loan => loan.id === editingLoan.value.id)
    if (index !== -1) {
      loans.value[index] = { ...loans.value[index], ...loanForm.value }
      alert('Loan updated successfully!')
    }
  }
  
  closeModal()
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingLoan.value = null
  loanForm.value = {
    borrowerName: '',
    borrowerPhone: '',
    amount: 0,
    interestRate: 0,
    term: 0,
    startDate: '',
    loanType: 'personal',
    status: 'active',
    notes: ''
  }
}

const formatNumber = (num: number) => {
  return num.toLocaleString('en-US', { minimumFractionDigits: 2 })
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

.installment-btn {
  background: #4caf50;
}

.installment-btn:hover {
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

.loan-stats {
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

.loans-table {
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

.borrower-info h4 {
  margin: 0 0 5px 0;
  color: #333;
  font-size: 16px;
}

.borrower-info p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.amount-value {
  font-weight: bold;
  color: #28a745;
  font-size: 16px;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
}

.status-badge.active {
  background: #d4edda;
  color: #155724;
}

.status-badge.overdue {
  background: #f8d7da;
  color: #721c24;
}

.status-badge.paid {
  background: #d1ecf1;
  color: #0c5460;
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

.action-btn.edit {
  background: #ffc107;
  color: #212529;
}

.action-btn.delete {
  background: #dc3545;
  color: white;
}

.no-loans {
  text-align: center;
  padding: 60px 20px;
}

.no-loans-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.no-loans h3 {
  margin-bottom: 10px;
  color: #333;
}

.no-loans p {
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

.loan-form {
  padding: 20px;
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
  .loans-table {
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
