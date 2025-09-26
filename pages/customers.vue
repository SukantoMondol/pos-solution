<template>
  <div class="customers-container" :class="{ 'dark-mode': isDarkMode }">
    <!-- Controls Container -->
    <div class="controls-container">
      <!-- Top Buttons -->
      <div class="top-buttons">
        <NuxtLink to="/" class="home-btn">Home</NuxtLink>
        <button @click="openCreateModal" class="add-btn">Add Customer</button>
        <button @click="openDownloadModal" class="download-btn">Download</button>
      </div>

      <!-- Filter Section -->
      <div class="filter-section">
        <button @click="openFilterModal" class="filter-btn">Filter</button>
        <div class="search-container">
          <input 
            v-model="searchQuery"
            @input="handleSearch"
            type="text" 
            placeholder="Search customers..."
            class="search-input"
          />
        </div>
        <button @click="applyFilters" class="apply-btn">Apply Filter</button>
      </div>
    </div>

    <!-- Summary Panel -->
    <div class="summary-panel-container">
      <div class="summary-panel">
        <div class="summary-item">
          <span class="title">Total Customers</span>
          <span class="amount">{{ totalCustomers }}</span>
        </div>
        <div class="summary-item">
          <span class="title">Active Customers</span>
          <span class="amount">{{ activeCustomers }}</span>
        </div>
        <div class="summary-item profit">
          <span class="title">Total Sales</span>
          <span class="amount">{{ formatCurrency(totalSales) }}</span>
        </div>
      </div>
    </div>

    <!-- Table Container -->
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>SL</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Total Purchases</th>
            <th>Last Purchase</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoading">
            <td :colspan="8" class="loading-cell">
              <div class="loading-spinner">
                <div class="spinner"></div>
                <span>Loading customers...</span>
              </div>
            </td>
          </tr>
          <tr v-else-if="filteredCustomers.length === 0">
            <td :colspan="8" class="no-data-cell">
              No customers found.
            </td>
          </tr>
          <tr v-else v-for="(customer, index) in filteredCustomers" :key="customer.id">
            <td>{{ index + 1 }}</td>
            <td>{{ customer.name }}</td>
            <td>{{ customer.email }}</td>
            <td>{{ customer.phone }}</td>
            <td>{{ customer.purchaseCount }}</td>
            <td>{{ formatDate(customer.lastPurchase) }}</td>
            <td>
              <span 
                :class="customer.status === 'Active' ? 'status-active' : 'status-inactive'"
                class="status-badge"
              >
                {{ customer.status }}
              </span>
            </td>
            <td>
              <select 
                @change="handleAction($event, customer.id)"
                class="action-select"
              >
                <option value="">Select Action</option>
                <option value="view">View</option>
                <option value="edit">Edit</option>
                <option value="delete">Delete</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Filter Modal -->
    <div v-if="showFilterModal" class="modal-overlay" @click="closeFilterModal">
      <div class="modal-content" @click.stop>
        <h3>Filter Customers</h3>
        <div class="filter-options">
          <div class="filter-group">
            <label>Status:</label>
            <select v-model="filterStatus" class="filter-select">
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div class="filter-group">
            <label>Purchase Range:</label>
            <div class="purchase-range">
              <input v-model="minPurchases" type="number" placeholder="Min" class="purchase-input">
              <span>-</span>
              <input v-model="maxPurchases" type="number" placeholder="Max" class="purchase-input">
            </div>
          </div>
          <div class="filter-group">
            <label>Date Range:</label>
            <div class="date-range">
              <input v-model="startDate" type="date" class="date-input">
              <span>to</span>
              <input v-model="endDate" type="date" class="date-input">
            </div>
          </div>
        </div>
        <div class="modal-buttons">
          <button @click="closeFilterModal" class="cancel-btn">Cancel</button>
          <button @click="applyDateFilter" class="apply-btn">Apply Filter</button>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showCreateModal" class="modal-overlay" @click="closeCreateModal">
      <div class="modal-content" @click.stop>
        <h3>{{ editingCustomer ? 'Edit Customer' : 'Add New Customer' }}</h3>
        <form @submit.prevent="handleSaveCustomer" class="customer-form">
          <div class="form-group">
            <label>Customer Name:</label>
            <input v-model="customerForm.name" type="text" required class="form-input">
          </div>
          <div class="form-group">
            <label>Email:</label>
            <input v-model="customerForm.email" type="email" required class="form-input">
          </div>
          <div class="form-group">
            <label>Phone:</label>
            <input v-model="customerForm.phone" type="tel" required class="form-input">
          </div>
          <div class="form-group">
            <label>Address:</label>
            <textarea v-model="customerForm.address" class="form-textarea"></textarea>
          </div>
          <div class="form-group">
            <label>Status:</label>
            <select v-model="customerForm.status" required class="form-select">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div class="modal-buttons">
            <button type="button" @click="closeCreateModal" class="cancel-btn">Cancel</button>
            <button type="submit" class="save-btn">Save Customer</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Download Modal -->
    <div v-if="showDownloadModal" class="modal-overlay" @click="closeDownloadModal">
      <div class="modal-content" @click.stop>
        <h3>Download Customers</h3>
        <div class="download-options">
          <button @click="downloadCSV" class="download-option-btn">Download as CSV</button>
          <button @click="downloadExcel" class="download-option-btn">Download as Excel</button>
          <button @click="downloadPDF" class="download-option-btn">Download as PDF</button>
        </div>
        <div class="modal-buttons">
          <button @click="closeDownloadModal" class="cancel-btn">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Page meta
definePageMeta({
  title: 'Customers'
})

// Reactive data
const showFilterModal = ref(false)
const showCreateModal = ref(false)
const showDownloadModal = ref(false)
const editingCustomer = ref(null)
const searchQuery = ref('')
const isLoading = ref(false)
const isDarkMode = ref(false)

// Filter data
const filterStatus = ref('')
const minPurchases = ref('')
const maxPurchases = ref('')
const startDate = ref('')
const endDate = ref('')

// Customer form
const customerForm = ref({
  name: '',
  email: '',
  phone: '',
  address: '',
  status: 'Active'
})

// Mock data for demonstration
const customers = ref([
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1234567890',
    purchaseCount: 5,
    lastPurchase: '2024-01-15',
    status: 'Active',
    totalSpent: 750.00,
    address: '123 Main St, City, State'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@email.com',
    phone: '+1234567891',
    purchaseCount: 3,
    lastPurchase: '2024-01-14',
    status: 'Active',
    totalSpent: 450.50,
    address: '456 Oak Ave, City, State'
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob.johnson@email.com',
    phone: '+1234567892',
    purchaseCount: 1,
    lastPurchase: '2024-01-10',
    status: 'Inactive',
    totalSpent: 125.00,
    address: '789 Pine Rd, City, State'
  },
  {
    id: 4,
    name: 'Alice Brown',
    email: 'alice.brown@email.com',
    phone: '+1234567893',
    purchaseCount: 8,
    lastPurchase: '2024-01-16',
    status: 'Active',
    totalSpent: 1200.75
  }
])

// Computed
const filteredCustomers = computed(() => {
  let filtered = customers.value

  // Search filter
  if (searchQuery.value) {
    filtered = filtered.filter(customer => 
    customer.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    customer.phone.includes(searchQuery.value)
  )
  }

  // Status filter
  if (filterStatus.value) {
    filtered = filtered.filter(customer => customer.status === filterStatus.value)
  }

  // Purchase count filter
  if (minPurchases.value) {
    filtered = filtered.filter(customer => customer.purchaseCount >= parseInt(minPurchases.value))
  }
  if (maxPurchases.value) {
    filtered = filtered.filter(customer => customer.purchaseCount <= parseInt(maxPurchases.value))
  }

  // Date range filter
  if (startDate.value) {
    filtered = filtered.filter(customer => new Date(customer.lastPurchase) >= new Date(startDate.value))
  }
  if (endDate.value) {
    filtered = filtered.filter(customer => new Date(customer.lastPurchase) <= new Date(endDate.value))
  }

  return filtered
})

const totalCustomers = computed(() => customers.value.length)

const activeCustomers = computed(() => {
  return customers.value.filter(customer => customer.status === 'Active').length
})

const totalSales = computed(() => {
  return customers.value.reduce((sum, customer) => sum + customer.totalSpent, 0)
})

// Methods
const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  }).replace(/\//g, '-')
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

const openFilterModal = () => {
  showFilterModal.value = true
}

const closeFilterModal = () => {
  showFilterModal.value = false
}

const openCreateModal = () => {
  editingCustomer.value = null
  customerForm.value = {
    name: '',
    email: '',
    phone: '',
    address: '',
    status: 'Active'
  }
  showCreateModal.value = true
}

const closeCreateModal = () => {
  showCreateModal.value = false
  editingCustomer.value = null
  customerForm.value = {
    name: '',
    email: '',
    phone: '',
    address: '',
    status: 'Active'
  }
}

const openDownloadModal = () => {
  showDownloadModal.value = true
}

const closeDownloadModal = () => {
  showDownloadModal.value = false
}

const handleSearch = () => {
  // Search is handled by computed property
}

const applyFilters = () => {
  // Filters are applied automatically through computed properties
  closeFilterModal()
}

const applyDateFilter = () => {
  // Apply the current filter settings
  applyFilters()
}

const handleAction = async (event: Event, customerId: number) => {
  const target = event.target as HTMLSelectElement
  const action = target.value
  
  if (action === 'view') {
    alert(`Viewing customer ${customerId}`)
  } else if (action === 'edit') {
    const customer = customers.value.find(c => c.id === customerId)
    if (customer) {
      editingCustomer.value = customer
      customerForm.value = {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address || '',
        status: customer.status
      }
      showCreateModal.value = true
    }
  } else if (action === 'delete') {
    if (confirm('Are you sure you want to delete this customer?')) {
      customers.value = customers.value.filter(c => c.id !== customerId)
      alert('Customer deleted successfully!')
    }
  }
  
  // Reset select value
  target.value = ''
}

const handleSaveCustomer = async () => {
  try {
    const customerData = {
      name: customerForm.value.name,
      email: customerForm.value.email,
      phone: customerForm.value.phone,
      address: customerForm.value.address,
      status: customerForm.value.status
    }

    if (editingCustomer.value) {
      // Update existing customer
      const index = customers.value.findIndex(c => c.id === editingCustomer.value.id)
      if (index !== -1) {
        customers.value[index] = { ...editingCustomer.value, ...customerData }
        alert('Customer updated successfully!')
      }
    } else {
      // Add new customer
      const newCustomer = {
        id: Math.max(...customers.value.map(c => c.id)) + 1,
        purchaseCount: 0,
        lastPurchase: '',
        totalSpent: 0,
        ...customerData
      }
      customers.value.push(newCustomer)
      alert('Customer added successfully!')
    }
    
    closeCreateModal()
  } catch (error) {
    console.error('Error saving customer:', error)
    alert('Error saving customer. Please try again.')
  }
}

const downloadCSV = () => {
  const csvContent = [
    ['Name', 'Email', 'Phone', 'Address', 'Status', 'Purchase Count', 'Last Purchase', 'Total Spent'],
    ...filteredCustomers.value.map(customer => [
      customer.name,
      customer.email,
      customer.phone,
      customer.address || '',
      customer.status,
      customer.purchaseCount,
      customer.lastPurchase,
      customer.totalSpent
    ])
  ].map(row => row.join(',')).join('\n')
  
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'customers.csv'
  a.click()
  window.URL.revokeObjectURL(url)
}

const downloadExcel = () => {
  alert('Excel download functionality would be implemented here')
}

const downloadPDF = () => {
  alert('PDF download functionality would be implemented here')
}
</script>

<style scoped>
.customers-container {
  font-family: 'Roboto', sans-serif;
  background: #f5f5f5;
  padding: 10px;
  margin: 0;
  box-sizing: border-box;
  transition: background-color 0.3s, color 0.3s;
}

.customers-container.dark-mode {
  background: #121212;
  color: #e0e0e0;
}

.controls-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 15px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  position: relative;
  margin-bottom: 10px;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.customers-container.dark-mode .controls-container {
  background: #1e1e1e;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
}

.top-buttons {
  display: flex;
  gap: 10px;
  width: 100%;
  margin-bottom: 10px;
}

.top-buttons button,
.top-buttons a {
  flex: 1;
  padding: 10px;
  font-size: 14px;
  border: none;
  color: white;
  cursor: pointer;
  border-radius: 5px;
  transition: background 0.3s ease;
  text-decoration: none;
  text-align: center;
}

.home-btn {
  background: #009688;
}

.home-btn:hover {
  background: #007a6a;
}

.add-btn {
  background: #4caf50;
}

.add-btn:hover {
  background: #388e3c;
}

.download-btn {
  background: #2196f3;
}

.download-btn:hover {
  background: #1976d2;
}

.filter-section {
  display: flex;
  gap: 10px;
  width: 100%;
  align-items: center;
}

.filter-btn {
  background: #ff9800;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s ease;
}

.filter-btn:hover {
  background: #f57c00;
}

.search-container {
  flex: 1;
}

.search-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #2196f3;
}

.apply-btn {
  background: #4caf50;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s ease;
}

.apply-btn:hover {
  background: #388e3c;
}

/* Summary Panel */
.summary-panel-container {
  margin: 10px 0;
}

.summary-panel {
  display: flex;
  gap: 15px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s, box-shadow 0.3s;
}

.customers-container.dark-mode .summary-panel {
  background: #1e1e1e;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
}

.summary-item {
  flex: 1;
  text-align: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  transition: background-color 0.3s;
}

.customers-container.dark-mode .summary-item {
  background: #2a2a2a;
}

.summary-item.profit {
  background: #e8f5e8;
}

.customers-container.dark-mode .summary-item.profit {
  background: #1b5e20;
}

.summary-item .title {
  display: block;
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.customers-container.dark-mode .summary-item .title {
  color: #ccc;
}

.summary-item .amount {
  display: block;
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.customers-container.dark-mode .summary-item .amount {
  color: #e0e0e0;
}

/* Table Container */
.table-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.customers-container.dark-mode .table-container {
  background: #1e1e1e;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
}

.table-container table {
  width: 100%;
  border-collapse: collapse;
}

.table-container th {
  background: #f8f9fa;
  padding: 15px 10px;
  text-align: left;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #dee2e6;
  transition: background-color 0.3s, color 0.3s;
}

.customers-container.dark-mode .table-container th {
  background: #2a2a2a;
  color: #e0e0e0;
  border-bottom-color: #444;
}

.table-container td {
  padding: 15px 10px;
  border-bottom: 1px solid #dee2e6;
  transition: border-color 0.3s;
}

.customers-container.dark-mode .table-container td {
  border-bottom-color: #444;
}

.table-container tr:hover {
  background: #f8f9fa;
}

.customers-container.dark-mode .table-container tr:hover {
  background: #2a2a2a;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-active {
  background: #d4edda;
  color: #155724;
}

.status-inactive {
  background: #f8d7da;
  color: #721c24;
}

.action-select {
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  font-size: 12px;
  cursor: pointer;
  transition: border-color 0.3s;
}

.action-select:focus {
  outline: none;
  border-color: #2196f3;
}

.loading-cell,
.no-data-cell {
  text-align: center;
  padding: 40px;
  color: #666;
}

.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #2196f3;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.customers-container.dark-mode .modal-content {
  background: #1e1e1e;
  color: #e0e0e0;
}

.modal-content h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
}

.customers-container.dark-mode .modal-content h3 {
  color: #e0e0e0;
}

.filter-options {
  margin-bottom: 20px;
}

.filter-group {
  margin-bottom: 15px;
}

.filter-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #333;
}

.customers-container.dark-mode .filter-group label {
  color: #e0e0e0;
}

.filter-select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  font-size: 14px;
  transition: border-color 0.3s;
}

.filter-select:focus {
  outline: none;
  border-color: #2196f3;
}

.purchase-range,
.date-range {
  display: flex;
  align-items: center;
  gap: 10px;
}

.purchase-input,
.date-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.purchase-input:focus,
.date-input:focus {
  outline: none;
  border-color: #2196f3;
}

.customer-form {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #333;
}

.customers-container.dark-mode .form-group label {
  color: #e0e0e0;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #2196f3;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.download-options {
  display: flex;
    flex-direction: column;
    gap: 10px;
  margin-bottom: 20px;
}

.download-option-btn {
  padding: 12px 20px;
  background: #2196f3;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s ease;
}

.download-option-btn:hover {
  background: #1976d2;
}

.modal-buttons {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.cancel-btn {
  padding: 10px 20px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s ease;
}

.cancel-btn:hover {
  background: #5a6268;
}

.save-btn {
  padding: 10px 20px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s ease;
}

.save-btn:hover {
  background: #218838;
}
</style>

