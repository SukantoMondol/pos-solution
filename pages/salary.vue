<template>
  <div class="controls-container">
    <div class="top-buttons">
      <button class="filter-btn" @click="openFilterModal">Filter</button>
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
    
    <div class="content">
      <div class="salary-section">
        <div class="salary-stats">
          <div class="stat-card">
            <div class="stat-icon">💰</div>
            <div class="stat-info">
              <h3>Total Payroll</h3>
              <p class="stat-value">${{ formatNumber(totalPayroll) }}</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">👥</div>
            <div class="stat-info">
              <h3>Employees Paid</h3>
              <p class="stat-value">{{ paidEmployeesCount }}</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">📅</div>
            <div class="stat-info">
              <h3>This Month</h3>
              <p class="stat-value">${{ formatNumber(thisMonthPayroll) }}</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">⏰</div>
            <div class="stat-info">
              <h3>Pending</h3>
              <p class="stat-value pending">${{ formatNumber(pendingPayroll) }}</p>
            </div>
          </div>
        </div>
        
        <div class="search-filter">
          <div class="search-box">
            <input type="text" v-model="searchQuery" placeholder="Search salaries..." class="search-input">
            <button @click="searchSalaries" class="search-btn">Search</button>
          </div>
          <div class="filter-options">
            <select v-model="statusFilter" @change="filterSalaries" class="filter-select">
              <option value="">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>
            <select v-model="monthFilter" @change="filterSalaries" class="filter-select">
              <option value="">All Months</option>
              <option v-for="month in months" :key="month.value" :value="month.value">
                {{ month.label }}
              </option>
            </select>
          </div>
        </div>
        
        <div class="salaries-table">
          <div class="table-header">
            <div class="header-cell">Employee</div>
            <div class="header-cell">Basic Salary</div>
            <div class="header-cell">Allowances</div>
            <div class="header-cell">Deductions</div>
            <div class="header-cell">Net Salary</div>
            <div class="header-cell">Status</div>
            <div class="header-cell">Actions</div>
          </div>
          
          <div v-for="salary in filteredSalaries" :key="salary.id" class="table-row">
            <div class="cell employee">
              <div class="employee-info">
                <h4>{{ salary.employeeName }}</h4>
                <p>{{ salary.employeeId }}</p>
              </div>
            </div>
            <div class="cell basic-salary">
              ${{ formatNumber(salary.basicSalary) }}
            </div>
            <div class="cell allowances">
              ${{ formatNumber(salary.allowances) }}
            </div>
            <div class="cell deductions">
              ${{ formatNumber(salary.deductions) }}
            </div>
            <div class="cell net-salary">
              <span class="net-amount">${{ formatNumber(salary.netSalary) }}</span>
            </div>
            <div class="cell status">
              <span class="status-badge" :class="salary.status">{{ salary.status }}</span>
            </div>
            <div class="cell actions">
              <button @click="viewSalary(salary)" class="action-btn view">View</button>
              <button @click="editSalary(salary)" class="action-btn edit">Edit</button>
              <button v-if="salary.status !== 'paid'" @click="processPayment(salary)" class="action-btn pay">Pay</button>
              <button @click="deleteSalary(salary.id)" class="action-btn delete">Delete</button>
            </div>
          </div>
        </div>
        
        <div v-if="filteredSalaries.length === 0" class="no-salaries">
          <div class="no-salaries-icon">💰</div>
          <h3>No Salary Records Found</h3>
          <p>Process salaries for your employees</p>
          <button @click="showAddModal = true" class="add-first-btn">Process Salary</button>
        </div>
      </div>
    </div>
    
    <!-- Add/Edit Salary Modal -->
    <div v-if="showAddModal || showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ showAddModal ? 'Process Salary' : 'Edit Salary' }}</h2>
          <button @click="closeModal" class="close-btn">×</button>
        </div>
        
        <form @submit.prevent="saveSalary" class="salary-form">
          <div class="form-row">
            <div class="form-group">
              <label for="employeeId">Employee *</label>
              <select id="employeeId" v-model="salaryForm.employeeId" @change="updateEmployeeDetails" required>
                <option value="">Select Employee</option>
                <option v-for="employee in employees" :key="employee.id" :value="employee.id">
                  {{ employee.name }} ({{ employee.employeeId }})
                </option>
              </select>
            </div>
            <div class="form-group">
              <label for="payPeriod">Pay Period *</label>
              <select id="payPeriod" v-model="salaryForm.payPeriod" required>
                <option value="">Select Period</option>
                <option value="monthly">Monthly</option>
                <option value="bi-weekly">Bi-weekly</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="basicSalary">Basic Salary *</label>
              <input type="number" id="basicSalary" v-model="salaryForm.basicSalary" step="0.01" required>
            </div>
            <div class="form-group">
              <label for="allowances">Allowances</label>
              <input type="number" id="allowances" v-model="salaryForm.allowances" step="0.01">
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="overtime">Overtime Pay</label>
              <input type="number" id="overtime" v-model="salaryForm.overtime" step="0.01">
            </div>
            <div class="form-group">
              <label for="bonus">Bonus</label>
              <input type="number" id="bonus" v-model="salaryForm.bonus" step="0.01">
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="tax">Tax Deduction</label>
              <input type="number" id="tax" v-model="salaryForm.tax" step="0.01">
            </div>
            <div class="form-group">
              <label for="insurance">Insurance</label>
              <input type="number" id="insurance" v-model="salaryForm.insurance" step="0.01">
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="otherDeductions">Other Deductions</label>
              <input type="number" id="otherDeductions" v-model="salaryForm.otherDeductions" step="0.01">
            </div>
            <div class="form-group">
              <label for="status">Status</label>
              <select id="status" v-model="salaryForm.status">
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>
          
          <div class="form-group">
            <label for="notes">Notes</label>
            <textarea id="notes" v-model="salaryForm.notes" rows="3"></textarea>
          </div>
          
          <div class="salary-summary">
            <h3>Salary Summary</h3>
            <div class="summary-row">
              <span>Basic Salary:</span>
              <span>${{ formatNumber(salaryForm.basicSalary || 0) }}</span>
            </div>
            <div class="summary-row">
              <span>Allowances:</span>
              <span>${{ formatNumber(salaryForm.allowances || 0) }}</span>
            </div>
            <div class="summary-row">
              <span>Overtime:</span>
              <span>${{ formatNumber(salaryForm.overtime || 0) }}</span>
            </div>
            <div class="summary-row">
              <span>Bonus:</span>
              <span>${{ formatNumber(salaryForm.bonus || 0) }}</span>
            </div>
            <div class="summary-row total">
              <span>Gross Salary:</span>
              <span>${{ formatNumber(grossSalary) }}</span>
            </div>
            <div class="summary-row">
              <span>Tax:</span>
              <span>-${{ formatNumber(salaryForm.tax || 0) }}</span>
            </div>
            <div class="summary-row">
              <span>Insurance:</span>
              <span>-${{ formatNumber(salaryForm.insurance || 0) }}</span>
            </div>
            <div class="summary-row">
              <span>Other Deductions:</span>
              <span>-${{ formatNumber(salaryForm.otherDeductions || 0) }}</span>
            </div>
            <div class="summary-row net-total">
              <span>Net Salary:</span>
              <span>${{ formatNumber(netSalary) }}</span>
            </div>
          </div>
          
          <div class="form-actions">
            <button type="button" @click="closeModal" class="cancel-btn">Cancel</button>
            <button type="submit" class="save-btn">Save Salary</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Salary Management'
})

const searchQuery = ref('')
const statusFilter = ref('')
const monthFilter = ref('')
const showAddModal = ref(false)
const showEditModal = ref(false)
const editingSalary = ref(null)

const salaryForm = ref({
  employeeId: '',
  employeeName: '',
  employeeIdNumber: '',
  payPeriod: '',
  basicSalary: 0,
  allowances: 0,
  overtime: 0,
  bonus: 0,
  tax: 0,
  insurance: 0,
  otherDeductions: 0,
  status: 'pending',
  notes: ''
})

const employees = ref([
  { id: 1, name: 'আহমেদ রহমান', employeeId: 'EMP001', salary: 60000 },
  { id: 2, name: 'ফাতেমা খাতুন', employeeId: 'EMP002', salary: 45000 },
  { id: 3, name: 'করিম উদ্দিন', employeeId: 'EMP003', salary: 40000 },
  { id: 4, name: 'নাসিরা বেগম', employeeId: 'EMP004', salary: 80000 }
])

const months = ref([
  { value: '2024-01', label: 'January 2024' },
  { value: '2024-02', label: 'February 2024' },
  { value: '2024-03', label: 'March 2024' },
  { value: '2024-04', label: 'April 2024' },
  { value: '2024-05', label: 'May 2024' },
  { value: '2024-06', label: 'June 2024' }
])

const salaries = ref([
  {
    id: 1,
    employeeId: 1,
    employeeName: 'আহমেদ রহমান',
    employeeIdNumber: 'EMP001',
    payPeriod: 'monthly',
    basicSalary: 5000.00,
    allowances: 500.00,
    overtime: 200.00,
    bonus: 0.00,
    tax: 800.00,
    insurance: 200.00,
    otherDeductions: 100.00,
    netSalary: 4600.00,
    status: 'paid',
    payDate: '2024-01-15',
    month: '2024-01'
  },
  {
    id: 2,
    employeeId: 2,
    employeeName: 'ফাতেমা খাতুন',
    employeeIdNumber: 'EMP002',
    payPeriod: 'monthly',
    basicSalary: 3750.00,
    allowances: 300.00,
    overtime: 0.00,
    bonus: 100.00,
    tax: 600.00,
    insurance: 150.00,
    otherDeductions: 50.00,
    netSalary: 3350.00,
    status: 'paid',
    payDate: '2024-01-15',
    month: '2024-01'
  },
  {
    id: 3,
    employeeId: 3,
    employeeName: 'করিম উদ্দিন',
    employeeIdNumber: 'EMP003',
    payPeriod: 'monthly',
    basicSalary: 3333.33,
    allowances: 200.00,
    overtime: 150.00,
    bonus: 0.00,
    tax: 500.00,
    insurance: 100.00,
    otherDeductions: 0.00,
    netSalary: 3083.33,
    status: 'pending',
    payDate: null,
    month: '2024-02'
  },
  {
    id: 4,
    employeeId: 4,
    employeeName: 'নাসিরা বেগম',
    employeeIdNumber: 'EMP004',
    payPeriod: 'monthly',
    basicSalary: 6666.67,
    allowances: 1000.00,
    overtime: 0.00,
    bonus: 500.00,
    tax: 1200.00,
    insurance: 300.00,
    otherDeductions: 200.00,
    netSalary: 5866.67,
    status: 'overdue',
    payDate: null,
    month: '2024-01'
  }
])

const filteredSalaries = computed(() => {
  let filtered = salaries.value
  
  if (searchQuery.value) {
    filtered = filtered.filter(salary => 
      salary.employeeName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      salary.employeeIdNumber.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }
  
  if (statusFilter.value) {
    filtered = filtered.filter(salary => salary.status === statusFilter.value)
  }
  
  if (monthFilter.value) {
    filtered = filtered.filter(salary => salary.month === monthFilter.value)
  }
  
  return filtered
})

const totalPayroll = computed(() => {
  return salaries.value.reduce((sum, salary) => sum + salary.netSalary, 0)
})

const paidEmployeesCount = computed(() => {
  return salaries.value.filter(salary => salary.status === 'paid').length
})

const thisMonthPayroll = computed(() => {
  const currentMonth = new Date().toISOString().slice(0, 7)
  return salaries.value
    .filter(salary => salary.month === currentMonth)
    .reduce((sum, salary) => sum + salary.netSalary, 0)
})

const pendingPayroll = computed(() => {
  return salaries.value
    .filter(salary => salary.status === 'pending')
    .reduce((sum, salary) => sum + salary.netSalary, 0)
})

const grossSalary = computed(() => {
  return (salaryForm.value.basicSalary || 0) + 
         (salaryForm.value.allowances || 0) + 
         (salaryForm.value.overtime || 0) + 
         (salaryForm.value.bonus || 0)
})

const netSalary = computed(() => {
  return grossSalary.value - 
         (salaryForm.value.tax || 0) - 
         (salaryForm.value.insurance || 0) - 
         (salaryForm.value.otherDeductions || 0)
})

const goBack = () => {
  if (process.client) {
    window.location.href = '/'
  }
}

const searchSalaries = () => {
  // Search is handled by computed property
}

const filterSalaries = () => {
  // Filtering is handled by computed property
}

const updateEmployeeDetails = () => {
  const employee = employees.value.find(emp => emp.id === parseInt(salaryForm.value.employeeId))
  if (employee) {
    salaryForm.value.employeeName = employee.name
    salaryForm.value.employeeIdNumber = employee.employeeId
    salaryForm.value.basicSalary = employee.salary / 12 // Convert annual to monthly
  }
}

const viewSalary = (salary: any) => {
  alert(`Viewing salary: ${salary.employeeName} - $${formatNumber(salary.netSalary)}`)
}

const editSalary = (salary: any) => {
  editingSalary.value = salary
  salaryForm.value = { ...salary }
  showEditModal.value = true
}

const processPayment = (salary: any) => {
  if (confirm(`Process payment of $${formatNumber(salary.netSalary)} for ${salary.employeeName}?`)) {
    const index = salaries.value.findIndex(s => s.id === salary.id)
    if (index !== -1) {
      salaries.value[index].status = 'paid'
      salaries.value[index].payDate = new Date().toISOString().split('T')[0]
      alert('Payment processed successfully!')
    }
  }
}

const deleteSalary = (id: number) => {
  if (confirm('Are you sure you want to delete this salary record?')) {
    salaries.value = salaries.value.filter(salary => salary.id !== id)
    alert('Salary record deleted successfully!')
  }
}

const saveSalary = () => {
  if (showAddModal.value) {
    const newSalary = {
      id: Date.now(),
      ...salaryForm.value,
      netSalary: netSalary.value,
      payDate: salaryForm.value.status === 'paid' ? new Date().toISOString().split('T')[0] : null,
      month: new Date().toISOString().slice(0, 7)
    }
    salaries.value.push(newSalary)
    alert('Salary processed successfully!')
  } else {
    const index = salaries.value.findIndex(salary => salary.id === editingSalary.value.id)
    if (index !== -1) {
      salaries.value[index] = { 
        ...salaries.value[index], 
        ...salaryForm.value,
        netSalary: netSalary.value
      }
      alert('Salary updated successfully!')
    }
  }
  
  closeModal()
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingSalary.value = null
  salaryForm.value = {
    employeeId: '',
    employeeName: '',
    employeeIdNumber: '',
    payPeriod: '',
    basicSalary: 0,
    allowances: 0,
    overtime: 0,
    bonus: 0,
    tax: 0,
    insurance: 0,
    otherDeductions: 0,
    status: 'pending',
    notes: ''
  }
}

const formatNumber = (num: number) => {
  return num.toLocaleString('en-US', { minimumFractionDigits: 2 })
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

.salary-stats {
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

.stat-value.pending {
  color: #ffc107;
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

.salaries-table {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr 2fr;
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
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr 2fr;
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

.employee-info h4 {
  margin: 0 0 5px 0;
  color: #333;
  font-size: 16px;
}

.employee-info p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.net-amount {
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

.status-badge.paid {
  background: #d4edda;
  color: #155724;
}

.status-badge.pending {
  background: #fff3cd;
  color: #856404;
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

.action-btn.view {
  background: #17a2b8;
  color: white;
}

.action-btn.edit {
  background: #ffc107;
  color: #212529;
}

.action-btn.pay {
  background: #28a745;
  color: white;
}

.action-btn.delete {
  background: #dc3545;
  color: white;
}

.no-salaries {
  text-align: center;
  padding: 60px 20px;
}

.no-salaries-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.no-salaries h3 {
  margin-bottom: 10px;
  color: #333;
}

.no-salaries p {
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
  max-width: 800px;
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

.salary-form {
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

.salary-summary {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
}

.salary-summary h3 {
  margin: 0 0 15px 0;
  color: #333;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 5px 0;
}

.summary-row.total {
  border-top: 1px solid #ddd;
  padding-top: 10px;
  font-weight: bold;
}

.summary-row.net-total {
  border-top: 2px solid #007bff;
  padding-top: 10px;
  font-weight: bold;
  font-size: 18px;
  color: #007bff;
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
  .salaries-table {
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
