<template>
  <div class="controls-container">
    <div class="top-buttons">
      <button class="home-btn" @click="goToHomePage">Home</button>
      <button class="create-btn" @click="openCreateModal">Employee</button>
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

    <!-- Filter Modal -->
    <div v-if="showFilterModal" class="filter-modal" @click="closeFilterModal">
      <div class="filter-modal-content" @click.stop>
        <h3>Filter Data Date</h3>
        
        <div class="form-group">
          <label for="dateRangeFilter">Date Range</label>
          <select id="dateRangeFilter" v-model="dateRangeFilter" @change="toggleCustomDates">
            <option value="all">All Data</option>
            <option value="today">Today</option>
            <option value="last7days">Last 7 Days</option>
            <option value="thisMonth">This Month</option>
            <option value="thisYear">This Year</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        <div v-if="dateRangeFilter === 'custom'" class="custom-date-fields">
          <div class="form-group">
            <label for="startDate">Start Date</label>
            <input type="date" id="startDate" v-model="startDate">
          </div>
          <div class="form-group">
            <label for="endDate">End Date</label>
            <input type="date" id="endDate" v-model="endDate">
          </div>
        </div>

        <div class="filter-modal-buttons">
          <button class="close-btn" @click="closeFilterModal">Close</button>
          <button class="apply-filter-btn" @click="applyDateFilter">Filter</button>
        </div>
      </div>
    </div>
    
    <div class="content">
      <div class="employee-section">
        <div class="employee-stats">
          <div class="stat-card">
            <div class="stat-icon">👥</div>
            <div class="stat-info">
              <h3>Total Employees</h3>
              <p class="stat-value">{{ totalEmployees }}</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">✅</div>
            <div class="stat-info">
              <h3>Active</h3>
              <p class="stat-value">{{ activeEmployees }}</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">⏸️</div>
            <div class="stat-info">
              <h3>Inactive</h3>
              <p class="stat-value">{{ inactiveEmployees }}</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">💰</div>
            <div class="stat-info">
              <h3>Total Payroll</h3>
              <p class="stat-value">${{ formatNumber(totalPayroll) }}</p>
            </div>
          </div>
        </div>
        
        <div class="search-filter">
          <div class="search-box">
            <input type="text" v-model="searchQuery" placeholder="Search employees..." class="search-input">
            <button @click="searchEmployees" class="search-btn">Search</button>
          </div>
          <div class="filter-options">
            <select v-model="statusFilter" @change="filterEmployees" class="filter-select">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <select v-model="departmentFilter" @change="filterEmployees" class="filter-select">
              <option value="">All Departments</option>
              <option value="sales">Sales</option>
              <option value="admin">Administration</option>
              <option value="support">Support</option>
              <option value="management">Management</option>
            </select>
          </div>
        </div>
        
        <div class="employees-grid">
          <div v-for="employee in filteredEmployees" :key="employee.id" class="employee-card">
            <div class="employee-header">
              <div class="employee-avatar">
                <img :src="employee.avatar" :alt="employee.name" v-if="employee.avatar">
                <div v-else class="default-avatar">{{ employee.name.charAt(0) }}</div>
              </div>
              <div class="employee-info">
                <h3>{{ employee.name }}</h3>
                <p class="position">{{ employee.position }}</p>
                <p class="department">{{ employee.department }}</p>
              </div>
              <div class="employee-status" :class="employee.status">
                {{ employee.status }}
              </div>
            </div>
            
            <div class="employee-details">
              <div class="detail-row">
                <span class="label">Employee ID:</span>
                <span class="value">{{ employee.employeeId }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Email:</span>
                <span class="value">{{ employee.email }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Phone:</span>
                <span class="value">{{ employee.phone }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Hire Date:</span>
                <span class="value">{{ formatDate(employee.hireDate) }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Salary:</span>
                <span class="value salary">${{ formatNumber(employee.salary) }}</span>
              </div>
            </div>
            
            <div class="employee-actions">
              <button @click="viewEmployee(employee)" class="action-btn view">View</button>
              <button @click="editEmployee(employee)" class="action-btn edit">Edit</button>
              <button @click="deleteEmployee(employee.id)" class="action-btn delete">Delete</button>
            </div>
          </div>
        </div>
        
        <div v-if="filteredEmployees.length === 0" class="no-employees">
          <div class="no-employees-icon">👥</div>
          <h3>No Employees Found</h3>
          <p>Add your first employee to get started</p>
          <button @click="showAddModal = true" class="add-first-btn">Add Employee</button>
        </div>
      </div>
    </div>
    
    <!-- Add/Edit Employee Modal -->
    <div v-if="showAddModal || showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ showAddModal ? 'Add New Employee' : 'Edit Employee' }}</h2>
          <button @click="closeModal" class="close-btn">×</button>
        </div>
        
        <form @submit.prevent="saveEmployee" class="employee-form">
          <div class="form-row">
            <div class="form-group">
              <label for="name">Full Name *</label>
              <input type="text" id="name" v-model="employeeForm.name" required>
            </div>
            <div class="form-group">
              <label for="employeeId">Employee ID *</label>
              <input type="text" id="employeeId" v-model="employeeForm.employeeId" required>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="email">Email Address *</label>
              <input type="email" id="email" v-model="employeeForm.email" required>
            </div>
            <div class="form-group">
              <label for="phone">Phone Number *</label>
              <input type="tel" id="phone" v-model="employeeForm.phone" required>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="position">Position *</label>
              <input type="text" id="position" v-model="employeeForm.position" required>
            </div>
            <div class="form-group">
              <label for="department">Department *</label>
              <select id="department" v-model="employeeForm.department" required>
                <option value="">Select Department</option>
                <option value="sales">Sales</option>
                <option value="admin">Administration</option>
                <option value="support">Support</option>
                <option value="management">Management</option>
              </select>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="salary">Salary *</label>
              <input type="number" id="salary" v-model="employeeForm.salary" step="0.01" required>
            </div>
            <div class="form-group">
              <label for="hireDate">Hire Date *</label>
              <input type="date" id="hireDate" v-model="employeeForm.hireDate" required>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="address">Address</label>
              <textarea id="address" v-model="employeeForm.address" rows="3"></textarea>
            </div>
            <div class="form-group">
              <label for="status">Status</label>
              <select id="status" v-model="employeeForm.status">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          
          <div class="form-actions">
            <button type="button" @click="closeModal" class="cancel-btn">Cancel</button>
            <button type="submit" class="save-btn">Save Employee</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Employee Management'
})

const searchQuery = ref('')
const statusFilter = ref('')
const departmentFilter = ref('')
const showAddModal = ref(false)
const showEditModal = ref(false)
const showFilterModal = ref(false)
const showDownloadModal = ref(false)
const editingEmployee = ref(null)
const dateRangeFilter = ref('all')
const startDate = ref('')
const endDate = ref('')

const employeeForm = ref({
  name: '',
  employeeId: '',
  email: '',
  phone: '',
  position: '',
  department: '',
  salary: 0,
  hireDate: '',
  address: '',
  status: 'active'
})

const employees = ref([
  {
    id: 1,
    name: 'আহমেদ রহমান',
    employeeId: 'EMP001',
    email: 'ahmed.rahman@company.com',
    phone: '+880-1712-345678',
    position: 'Sales Manager',
    department: 'sales',
    salary: 60000.00,
    hireDate: '2023-01-15',
    address: 'ধানমন্ডি, ঢাকা 1205',
    status: 'active',
    avatar: null
  },
  {
    id: 2,
    name: 'ফাতেমা খাতুন',
    employeeId: 'EMP002',
    email: 'fatema.khatun@company.com',
    phone: '+880-1713-456789',
    position: 'Administrative Assistant',
    department: 'admin',
    salary: 45000.00,
    hireDate: '2023-03-20',
    address: 'গুলশান, ঢাকা 1212',
    status: 'active',
    avatar: null
  },
  {
    id: 3,
    name: 'করিম উদ্দিন',
    employeeId: 'EMP003',
    email: 'karim.uddin@company.com',
    phone: '+880-1714-567890',
    position: 'Customer Support',
    department: 'support',
    salary: 40000.00,
    hireDate: '2023-06-10',
    address: 'মিরপুর, ঢাকা 1216',
    status: 'active',
    avatar: null
  },
  {
    id: 4,
    name: 'নাসিরা বেগম',
    employeeId: 'EMP004',
    email: 'nasira.begum@company.com',
    phone: '+880-1715-678901',
    position: 'General Manager',
    department: 'management',
    salary: 80000.00,
    hireDate: '2022-11-01',
    address: 'বনানী, ঢাকা 1213',
    status: 'inactive',
    avatar: null
  }
])

const filteredEmployees = computed(() => {
  let filtered = employees.value
  
  if (searchQuery.value) {
    filtered = filtered.filter(employee => 
      employee.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      employee.employeeId.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }
  
  if (statusFilter.value) {
    filtered = filtered.filter(employee => employee.status === statusFilter.value)
  }
  
  if (departmentFilter.value) {
    filtered = filtered.filter(employee => employee.department === departmentFilter.value)
  }
  
  return filtered
})

const totalEmployees = computed(() => employees.value.length)

const activeEmployees = computed(() => {
  return employees.value.filter(employee => employee.status === 'active').length
})

const inactiveEmployees = computed(() => {
  return employees.value.filter(employee => employee.status === 'inactive').length
})

const totalPayroll = computed(() => {
  return employees.value
    .filter(employee => employee.status === 'active')
    .reduce((sum, employee) => sum + employee.salary, 0)
})

const goToHomePage = () => {
  if (process.client) {
    window.location.href = '/'
  }
}

const openCreateModal = () => {
  showAddModal.value = true
}

const openFilterModal = () => {
  showFilterModal.value = true
}

const closeFilterModal = () => {
  showFilterModal.value = false
}

const openDownloadModal = () => {
  showDownloadModal.value = true
}

const toggleCustomDates = () => {
  // Custom dates will show/hide based on dateRangeFilter value
}

const applyDateFilter = () => {
  alert('Date filter applied!')
  closeFilterModal()
}

const searchEmployees = () => {
  // Search is handled by computed property
}

const filterEmployees = () => {
  // Filtering is handled by computed property
}

const viewEmployee = (employee: any) => {
  alert(`Viewing employee: ${employee.name} (${employee.employeeId})`)
}

const editEmployee = (employee: any) => {
  editingEmployee.value = employee
  employeeForm.value = { ...employee }
  showEditModal.value = true
}

const deleteEmployee = (id: number) => {
  if (confirm('Are you sure you want to delete this employee?')) {
    employees.value = employees.value.filter(employee => employee.id !== id)
    alert('Employee deleted successfully!')
  }
}

const saveEmployee = () => {
  if (showAddModal.value) {
    const newEmployee = {
      id: Date.now(),
      ...employeeForm.value,
      avatar: null
    }
    employees.value.push(newEmployee)
    alert('Employee added successfully!')
  } else {
    const index = employees.value.findIndex(employee => employee.id === editingEmployee.value.id)
    if (index !== -1) {
      employees.value[index] = { ...employees.value[index], ...employeeForm.value }
      alert('Employee updated successfully!')
    }
  }
  
  closeModal()
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingEmployee.value = null
  employeeForm.value = {
    name: '',
    employeeId: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    salary: 0,
    hireDate: '',
    address: '',
    status: 'active'
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
  background: #4caf50;
}

.home-btn:hover {
  background: #388e3c;
}

.create-btn {
  background: #009688;
}

.create-btn:hover {
  background: #00796b;
}

.download-btn {
  background: #2196f3;
}

.download-btn:hover {
  background: #1976d2;
}

.filter-section {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  width: 100%;
  align-items: flex-end;
}

.filter-section > div {
  flex: 1 1 calc(33.33% - 10px);
  min-width: 100px;
  position: relative;
}

.filter-section button {
  flex: 1 1 calc(33.33% - 10px);
  max-width: 100px;
  padding: 8px 15px;
  background: #ff9800;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s ease;
  white-space: nowrap;
}

.filter-section button:hover {
  background: #e68900;
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

.employee-stats {
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

.employees-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;
}

.employee-card {
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.3s ease;
}

.employee-card:hover {
  border-color: #007bff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.employee-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.employee-avatar {
  width: 60px;
  height: 60px;
  margin-right: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.employee-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.default-avatar {
  width: 60px;
  height: 60px;
  background: #007bff;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
}

.employee-info {
  flex: 1;
}

.employee-info h3 {
  margin: 0 0 5px 0;
  color: #333;
  font-size: 18px;
}

.position {
  margin: 0 0 5px 0;
  color: #666;
  font-size: 14px;
  font-weight: bold;
}

.department {
  margin: 0;
  color: #666;
  font-size: 14px;
  text-transform: capitalize;
}

.employee-status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
}

.employee-status.active {
  background: #d4edda;
  color: #155724;
}

.employee-status.inactive {
  background: #f8d7da;
  color: #721c24;
}

.employee-details {
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

.value.salary {
  font-weight: bold;
  color: #28a745;
}

.employee-actions {
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

.no-employees {
  text-align: center;
  padding: 60px 20px;
}

.no-employees-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.no-employees h3 {
  margin-bottom: 10px;
  color: #333;
}

.no-employees p {
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

.employee-form {
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
  .employees-grid {
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
