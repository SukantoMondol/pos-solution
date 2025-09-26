<template>
  <div class="page-container">
    <div class="header">
      <button class="back-btn" @click="goBack">← Back</button>
      <h1>Bank Management</h1>
      <button class="add-btn" @click="showAddModal = true">+ Add Bank</button>
    </div>
    
    <div class="content">
      <div class="bank-section">
        <div class="search-filter">
          <div class="search-box">
            <input type="text" v-model="searchQuery" placeholder="Search banks..." class="search-input">
            <button @click="searchBanks" class="search-btn">Search</button>
          </div>
          <div class="filter-options">
            <select v-model="statusFilter" @change="filterBanks" class="filter-select">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
        
        <div class="banks-grid">
          <div v-for="bank in filteredBanks" :key="bank.id" class="bank-card">
            <div class="bank-header">
              <div class="bank-logo">
                <img :src="bank.logo" :alt="bank.name" v-if="bank.logo">
                <div v-else class="default-logo">{{ bank.name.charAt(0) }}</div>
              </div>
              <div class="bank-info">
                <h3>{{ bank.name }}</h3>
                <p class="bank-type">{{ bank.type }}</p>
                <p class="bank-account">{{ bank.accountNumber }}</p>
              </div>
              <div class="bank-status" :class="bank.status">
                {{ bank.status }}
              </div>
            </div>
            
            <div class="bank-details">
              <div class="detail-row">
                <span class="label">Branch:</span>
                <span class="value">{{ bank.branch }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Balance:</span>
                <span class="value balance">${{ formatNumber(bank.balance) }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Last Transaction:</span>
                <span class="value">{{ formatDate(bank.lastTransaction) }}</span>
              </div>
            </div>
            
            <div class="bank-actions">
              <button @click="viewBank(bank)" class="action-btn view">View</button>
              <button @click="editBank(bank)" class="action-btn edit">Edit</button>
              <button @click="deleteBank(bank.id)" class="action-btn delete">Delete</button>
            </div>
          </div>
        </div>
        
        <div v-if="filteredBanks.length === 0" class="no-banks">
          <div class="no-banks-icon">🏦</div>
          <h3>No Banks Found</h3>
          <p>Add your first bank to get started</p>
          <button @click="showAddModal = true" class="add-first-btn">Add Bank</button>
        </div>
      </div>
    </div>
    
    <!-- Add/Edit Bank Modal -->
    <div v-if="showAddModal || showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ showAddModal ? 'Add New Bank' : 'Edit Bank' }}</h2>
          <button @click="closeModal" class="close-btn">×</button>
        </div>
        
        <form @submit.prevent="saveBank" class="bank-form">
          <div class="form-row">
            <div class="form-group">
              <label for="bankName">Bank Name *</label>
              <input type="text" id="bankName" v-model="bankForm.name" required>
            </div>
            <div class="form-group">
              <label for="bankType">Bank Type *</label>
              <select id="bankType" v-model="bankForm.type" required>
                <option value="">Select Type</option>
                <option value="Commercial">Commercial Bank</option>
                <option value="Investment">Investment Bank</option>
                <option value="Central">Central Bank</option>
                <option value="Credit Union">Credit Union</option>
              </select>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="accountNumber">Account Number *</label>
              <input type="text" id="accountNumber" v-model="bankForm.accountNumber" required>
            </div>
            <div class="form-group">
              <label for="routingNumber">Routing Number</label>
              <input type="text" id="routingNumber" v-model="bankForm.routingNumber">
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="branch">Branch</label>
              <input type="text" id="branch" v-model="bankForm.branch">
            </div>
            <div class="form-group">
              <label for="swiftCode">SWIFT Code</label>
              <input type="text" id="swiftCode" v-model="bankForm.swiftCode">
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="initialBalance">Initial Balance</label>
              <input type="number" id="initialBalance" v-model="bankForm.balance" step="0.01">
            </div>
            <div class="form-group">
              <label for="status">Status</label>
              <select id="status" v-model="bankForm.status">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          
          <div class="form-actions">
            <button type="button" @click="closeModal" class="cancel-btn">Cancel</button>
            <button type="submit" class="save-btn">Save Bank</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Bank Management'
})

const searchQuery = ref('')
const statusFilter = ref('')
const showAddModal = ref(false)
const showEditModal = ref(false)
const editingBank = ref(null)

const bankForm = ref({
  name: '',
  type: '',
  accountNumber: '',
  routingNumber: '',
  branch: '',
  swiftCode: '',
  balance: 0,
  status: 'active'
})

const banks = ref([
  {
    id: 1,
    name: 'সোনালী ব্যাংক লিমিটেড',
    type: 'Commercial Bank',
    accountNumber: '****1234',
    routingNumber: '123456789',
    branch: 'ধানমন্ডি শাখা',
    swiftCode: 'SBLBDDH',
    balance: 50000.00,
    status: 'active',
    lastTransaction: new Date('2024-01-15'),
    logo: null
  },
  {
    id: 2,
    name: 'ঢাকা ব্যাংক লিমিটেড',
    type: 'Commercial Bank',
    accountNumber: '****5678',
    routingNumber: '987654321',
    branch: 'গুলশান শাখা',
    swiftCode: 'DABLBDDH',
    balance: 25000.00,
    status: 'active',
    lastTransaction: new Date('2024-01-10'),
    logo: null
  },
  {
    id: 3,
    name: 'ইসলামী ব্যাংক বাংলাদেশ লিমিটেড',
    type: 'Islamic Bank',
    accountNumber: '****9012',
    routingNumber: '456789123',
    branch: 'মিরপুর শাখা',
    swiftCode: 'IBBLBDDH',
    balance: 100000.00,
    status: 'inactive',
    lastTransaction: new Date('2023-12-20'),
    logo: null
  }
])

const filteredBanks = computed(() => {
  let filtered = banks.value
  
  if (searchQuery.value) {
    filtered = filtered.filter(bank => 
      bank.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      bank.accountNumber.includes(searchQuery.value) ||
      bank.branch.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }
  
  if (statusFilter.value) {
    filtered = filtered.filter(bank => bank.status === statusFilter.value)
  }
  
  return filtered
})

const goBack = () => {
  if (process.client) {
    window.location.href = '/'
  }
}

const searchBanks = () => {
  // Search is handled by computed property
}

const filterBanks = () => {
  // Filtering is handled by computed property
}

const viewBank = (bank: any) => {
  alert(`Viewing bank: ${bank.name}`)
}

const editBank = (bank: any) => {
  editingBank.value = bank
  bankForm.value = { ...bank }
  showEditModal.value = true
}

const deleteBank = (id: number) => {
  if (confirm('Are you sure you want to delete this bank?')) {
    banks.value = banks.value.filter(bank => bank.id !== id)
    alert('Bank deleted successfully!')
  }
}

const saveBank = () => {
  if (showAddModal.value) {
    const newBank = {
      id: Date.now(),
      ...bankForm.value,
      lastTransaction: new Date()
    }
    banks.value.push(newBank)
    alert('Bank added successfully!')
  } else {
    const index = banks.value.findIndex(bank => bank.id === editingBank.value.id)
    if (index !== -1) {
      banks.value[index] = { ...banks.value[index], ...bankForm.value }
      alert('Bank updated successfully!')
    }
  }
  
  closeModal()
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingBank.value = null
  bankForm.value = {
    name: '',
    type: '',
    accountNumber: '',
    routingNumber: '',
    branch: '',
    swiftCode: '',
    balance: 0,
    status: 'active'
  }
}

const formatNumber = (num: number) => {
  return num.toLocaleString('en-US', { minimumFractionDigits: 2 })
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

.banks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;
}

.bank-card {
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.3s ease;
}

.bank-card:hover {
  border-color: #007bff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.bank-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.bank-logo {
  width: 50px;
  height: 50px;
  margin-right: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bank-logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.default-logo {
  width: 50px;
  height: 50px;
  background: #007bff;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
}

.bank-info {
  flex: 1;
}

.bank-info h3 {
  margin: 0 0 5px 0;
  color: #333;
  font-size: 18px;
}

.bank-type {
  margin: 0 0 5px 0;
  color: #666;
  font-size: 14px;
}

.bank-account {
  margin: 0;
  color: #666;
  font-size: 14px;
  font-family: monospace;
}

.bank-status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
}

.bank-status.active {
  background: #d4edda;
  color: #155724;
}

.bank-status.inactive {
  background: #f8d7da;
  color: #721c24;
}

.bank-details {
  margin-bottom: 15px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.label {
  font-weight: bold;
  color: #666;
}

.value {
  color: #333;
}

.value.balance {
  font-weight: bold;
  color: #28a745;
}

.bank-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
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

.no-banks {
  text-align: center;
  padding: 60px 20px;
}

.no-banks-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.no-banks h3 {
  margin-bottom: 10px;
  color: #333;
}

.no-banks p {
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

.bank-form {
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
.form-group select {
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
  .banks-grid {
    grid-template-columns: 1fr;
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
