<template>
  <div class="controls-container">
    <div class="top-buttons">
      <button class="home-btn" @click="goToHomePage">Home</button>
      <button class="generate-btn" @click="openGenerateModal">Generate Report</button>
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
    
    <!-- Report Type Selection -->
    <div class="report-types">
      <h3>Select Report Type</h3>
      <div class="report-type-grid">
        <button class="report-type-btn" @click="selectReportType('account')" :class="{ active: selectedReportType === 'account' }">
          <div class="report-icon">📊</div>
          <div class="report-title">Account Invoice</div>
          <div class="report-desc">Cash In/Out, Income, Expense, Transfer, Purchase, Sales, Bank Loan, Installment, Salary</div>
        </button>
        
        <button class="report-type-btn" @click="selectReportType('purchase')" :class="{ active: selectedReportType === 'purchase' }">
          <div class="report-icon">🛒</div>
          <div class="report-title">Purchase Invoice</div>
          <div class="report-desc">Only Purchase transactions</div>
        </button>
        
        <button class="report-type-btn" @click="selectReportType('sales')" :class="{ active: selectedReportType === 'sales' }">
          <div class="report-icon">💰</div>
          <div class="report-title">Sales Invoice</div>
          <div class="report-desc">Only Sales transactions</div>
        </button>
        
        <button class="report-type-btn" @click="selectReportType('customer')" :class="{ active: selectedReportType === 'customer' }">
          <div class="report-icon">👥</div>
          <div class="report-title">Customer Reports</div>
          <div class="report-desc">Sales, Sales Return, Sales Payment</div>
        </button>
        
        <button class="report-type-btn" @click="selectReportType('supplier')" :class="{ active: selectedReportType === 'supplier' }">
          <div class="report-icon">🏪</div>
          <div class="report-title">Supplier Reports</div>
          <div class="report-desc">Purchase, Purchase Return, Purchase Payment</div>
        </button>
        
        <button class="report-type-btn" @click="selectReportType('bank-loan')" :class="{ active: selectedReportType === 'bank-loan' }">
          <div class="report-icon">🏦</div>
          <div class="report-title">Bank Loan Reports</div>
          <div class="report-desc">Bank Loan, Installment</div>
        </button>
        
        <button class="report-type-btn" @click="selectReportType('installment')" :class="{ active: selectedReportType === 'installment' }">
          <div class="report-icon">📅</div>
          <div class="report-title">Installment Reports</div>
          <div class="report-desc">Bank Loan, Installment</div>
        </button>
        
        <button class="report-type-btn" @click="selectReportType('employee')" :class="{ active: selectedReportType === 'employee' }">
          <div class="report-icon">👨‍💼</div>
          <div class="report-title">Employee Reports</div>
          <div class="report-desc">Employee, Salary</div>
        </button>
        
        <button class="report-type-btn" @click="selectReportType('income')" :class="{ active: selectedReportType === 'income' }">
          <div class="report-icon">📈</div>
          <div class="report-title">Income Reports</div>
          <div class="report-desc">Income, Expense</div>
        </button>
        
        <button class="report-type-btn" @click="selectReportType('expense')" :class="{ active: selectedReportType === 'expense' }">
          <div class="report-icon">📉</div>
          <div class="report-title">Expense Reports</div>
          <div class="report-desc">Income, Expense</div>
        </button>
        
        <button class="report-type-btn" @click="selectReportType('transfer')" :class="{ active: selectedReportType === 'transfer' }">
          <div class="report-icon">🔄</div>
          <div class="report-title">Transfer Reports</div>
          <div class="report-desc">Only Transfer transactions</div>
        </button>
      </div>
    </div>

    <!-- Report Content -->
    <div v-if="selectedReportType" class="content">
      <div class="report-header">
        <h2>{{ getReportTitle() }}</h2>
        <div class="report-actions">
          <button class="print-btn" @click="printReport">🖨️ Print</button>
          <button class="pdf-btn" @click="downloadPDF">📄 PDF</button>
          <button class="excel-btn" @click="downloadExcel">📊 Excel</button>
          <button class="share-btn" @click="shareReport">📤 Share</button>
        </div>
      </div>

      <!-- Report Summary -->
      <div class="report-summary">
        <div class="summary-card">
          <h4>Total Transactions</h4>
          <p>{{ getTotalTransactions() }}</p>
        </div>
        <div class="summary-card">
          <h4>Total Amount</h4>
          <p>{{ formatCurrency(getTotalAmount()) }}</p>
        </div>
        <div class="summary-card">
          <h4>Date Range</h4>
          <p>{{ getDateRange() }}</p>
        </div>
      </div>

      <!-- Report Table -->
      <div class="report-table-container">
        <table class="report-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Reference</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="transaction in getFilteredTransactions()" :key="transaction.id">
              <td>{{ formatDate(transaction.date) }}</td>
              <td>{{ transaction.type }}</td>
              <td>{{ transaction.description }}</td>
              <td :class="transaction.amount >= 0 ? 'positive' : 'negative'">
                {{ formatCurrency(transaction.amount) }}
              </td>
              <td>
                <span :class="['status', transaction.status]">{{ transaction.status }}</span>
              </td>
              <td>{{ transaction.reference }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Filter Modal -->
    <div v-if="showFilterModal" class="filter-modal" @click="closeFilterModal">
      <div class="filter-modal-content" @click.stop>
        <h3>Filter Report Data</h3>
        
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

        <div class="form-group">
          <label for="statusFilter">Status</label>
          <select id="statusFilter" v-model="statusFilter">
            <option value="">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <div class="filter-modal-buttons">
          <button class="close-btn" @click="closeFilterModal">Close</button>
          <button class="apply-filter-btn" @click="applyDateFilter">Apply Filter</button>
        </div>
      </div>
    </div>

    <!-- Generate Report Modal -->
    <div v-if="showGenerateModal" class="modal-overlay" @click="closeGenerateModal">
      <div class="modal-content" @click.stop>
        <h3>Generate New Report</h3>
        <form @submit.prevent="generateReport">
          <div class="form-group">
            <label for="reportName">Report Name</label>
            <input type="text" id="reportName" v-model="reportForm.name" required>
          </div>
          <div class="form-group">
            <label for="reportType">Report Type</label>
            <select id="reportType" v-model="reportForm.type" required>
              <option value="account">Account Invoice</option>
              <option value="purchase">Purchase Invoice</option>
              <option value="sales">Sales Invoice</option>
              <option value="customer">Customer Reports</option>
              <option value="supplier">Supplier Reports</option>
              <option value="bank-loan">Bank Loan Reports</option>
              <option value="installment">Installment Reports</option>
              <option value="employee">Employee Reports</option>
              <option value="income">Income Reports</option>
              <option value="expense">Expense Reports</option>
              <option value="transfer">Transfer Reports</option>
            </select>
          </div>
          <div class="form-group">
            <label for="reportPeriod">Period</label>
            <select id="reportPeriod" v-model="reportForm.period">
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          <div class="modal-buttons">
            <button type="button" @click="closeGenerateModal">Cancel</button>
            <button type="submit">Generate Report</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Download Modal -->
    <div v-if="showDownloadModal" class="modal-overlay" @click="closeDownloadModal">
      <div class="modal-content" @click.stop>
        <h3>Download Report</h3>
        <div class="form-group">
          <label for="downloadFormat">File Format</label>
          <select id="downloadFormat" v-model="downloadFormat">
            <option value="pdf">PDF</option>
            <option value="excel">Excel</option>
            <option value="csv">CSV</option>
            <option value="print">Print</option>
          </select>
        </div>
        <div class="modal-buttons">
          <button @click="closeDownloadModal">Cancel</button>
          <button @click="handleDownload">Download</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Reports & Invoices'
})

const searchQuery = ref('')
const selectedReportType = ref('')
const showFilterModal = ref(false)
const showGenerateModal = ref(false)
const showDownloadModal = ref(false)
const dateRangeFilter = ref('all')
const startDate = ref('')
const endDate = ref('')
const statusFilter = ref('')
const downloadFormat = ref('pdf')

const reportForm = ref({
  name: '',
  type: '',
  period: 'month'
})

// Sample transaction data
const transactions = ref([
  {
    id: 1,
    date: '2024-01-20',
    type: 'Cash In',
    description: 'আহমেদ রহমান থেকে নগদ গ্রহণ',
    amount: 5000.00,
    status: 'completed',
    reference: 'CASH-001'
  },
  {
    id: 2,
    date: '2024-01-20',
    type: 'Sales',
    description: 'পণ্য বিক্রয় - মোহাম্মদ হাসান',
    amount: 2500.00,
    status: 'completed',
    reference: 'SALE-001'
  },
  {
    id: 3,
    date: '2024-01-19',
    type: 'Purchase',
    description: 'কাঁচামাল ক্রয় - রোকসানা আক্তার',
    amount: -1500.00,
    status: 'completed',
    reference: 'PUR-001'
  },
  {
    id: 4,
    date: '2024-01-19',
    type: 'Bank Loan',
    description: 'ব্যাংক লোন - আবুল কালাম',
    amount: 10000.00,
    status: 'completed',
    reference: 'LOAN-001'
  },
  {
    id: 5,
    date: '2024-01-18',
    type: 'Installment',
    description: 'কিস্তি পরিশোধ - নাসিরা খাতুন',
    amount: -500.00,
    status: 'completed',
    reference: 'INST-001'
  },
  {
    id: 6,
    date: '2024-01-18',
    type: 'Salary',
    description: 'বেতন প্রদান - ফাতেমা খাতুন',
    amount: -4500.00,
    status: 'completed',
    reference: 'SAL-001'
  },
  {
    id: 7,
    date: '2024-01-17',
    type: 'Expense',
    description: 'অফিস খরচ',
    amount: -200.00,
    status: 'completed',
    reference: 'EXP-001'
  },
  {
    id: 8,
    date: '2024-01-17',
    type: 'Transfer',
    description: 'অ্যাকাউন্ট স্থানান্তর',
    amount: -1000.00,
    status: 'completed',
    reference: 'TRF-001'
  }
])

const goToHomePage = () => {
  if (process.client) {
    window.location.href = '/'
  }
}

const selectReportType = (type: string) => {
  selectedReportType.value = type
}

const getReportTitle = () => {
  const titles = {
    'account': 'Account Invoice Report',
    'purchase': 'Purchase Invoice Report',
    'sales': 'Sales Invoice Report',
    'customer': 'Customer Reports',
    'supplier': 'Supplier Reports',
    'bank-loan': 'Bank Loan Reports',
    'installment': 'Installment Reports',
    'employee': 'Employee Reports',
    'income': 'Income Reports',
    'expense': 'Expense Reports',
    'transfer': 'Transfer Reports'
  }
  return titles[selectedReportType.value] || 'Report'
}

const getFilteredTransactions = () => {
  let filtered = transactions.value

  if (selectedReportType.value === 'account') {
    // All transactions
  } else if (selectedReportType.value === 'purchase') {
    filtered = filtered.filter(t => t.type === 'Purchase')
  } else if (selectedReportType.value === 'sales') {
    filtered = filtered.filter(t => t.type === 'Sales')
  } else if (selectedReportType.value === 'customer') {
    filtered = filtered.filter(t => ['Sales', 'Sales Return', 'Sales Payment'].includes(t.type))
  } else if (selectedReportType.value === 'supplier') {
    filtered = filtered.filter(t => ['Purchase', 'Purchase Return', 'Purchase Payment'].includes(t.type))
  } else if (selectedReportType.value === 'bank-loan') {
    filtered = filtered.filter(t => ['Bank Loan', 'Installment'].includes(t.type))
  } else if (selectedReportType.value === 'installment') {
    filtered = filtered.filter(t => ['Bank Loan', 'Installment'].includes(t.type))
  } else if (selectedReportType.value === 'employee') {
    filtered = filtered.filter(t => ['Employee', 'Salary'].includes(t.type))
  } else if (selectedReportType.value === 'income') {
    filtered = filtered.filter(t => ['Income', 'Expense'].includes(t.type))
  } else if (selectedReportType.value === 'expense') {
    filtered = filtered.filter(t => ['Income', 'Expense'].includes(t.type))
  } else if (selectedReportType.value === 'transfer') {
    filtered = filtered.filter(t => t.type === 'Transfer')
  }

  if (searchQuery.value) {
    filtered = filtered.filter(t => 
      t.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      t.type.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      t.reference.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  return filtered
}

const getTotalTransactions = () => {
  return getFilteredTransactions().length
}

const getTotalAmount = () => {
  return getFilteredTransactions().reduce((sum, t) => sum + t.amount, 0)
}

const getDateRange = () => {
  const dates = getFilteredTransactions().map(t => new Date(t.date))
  if (dates.length === 0) return 'No data'
  const min = new Date(Math.min(...dates.map(d => d.getTime())))
  const max = new Date(Math.max(...dates.map(d => d.getTime())))
  return `${formatDate(min.toISOString().split('T')[0])} - ${formatDate(max.toISOString().split('T')[0])}`
}

const openFilterModal = () => {
  showFilterModal.value = true
}

const closeFilterModal = () => {
  showFilterModal.value = false
}

const openGenerateModal = () => {
  showGenerateModal.value = true
}

const closeGenerateModal = () => {
  showGenerateModal.value = false
}

const openDownloadModal = () => {
  showDownloadModal.value = true
}

const closeDownloadModal = () => {
  showDownloadModal.value = false
}

const toggleCustomDates = () => {
  // Custom dates will show/hide based on dateRangeFilter value
}

const applyDateFilter = () => {
  alert('Date filter applied!')
  closeFilterModal()
}

const filterAndDisplay = () => {
  // Search is handled by computed property
}

const generateReport = () => {
  alert(`Generating ${reportForm.value.type} report for ${reportForm.value.period}`)
  closeGenerateModal()
}

const printReport = () => {
  window.print()
}

const downloadPDF = () => {
  alert('Downloading PDF report...')
}

const downloadExcel = () => {
  alert('Downloading Excel report...')
}

const shareReport = () => {
  alert('Sharing report...')
}

const handleDownload = () => {
  alert(`Downloading report as ${downloadFormat.value}`)
  closeDownloadModal()
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

const formatDate = (dateString: string) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
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

.generate-btn {
  background: #4caf50;
}

.generate-btn:hover {
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

.report-types {
  margin: 20px 0;
}

.report-types h3 {
  margin-bottom: 15px;
  color: #333;
}

.report-type-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.report-type-btn {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.report-type-btn:hover {
  border-color: #007bff;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.report-type-btn.active {
  border-color: #007bff;
  background: #f0f8ff;
}

.report-icon {
  font-size: 24px;
  margin-bottom: 10px;
}

.report-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.report-desc {
  font-size: 12px;
  color: #666;
  line-height: 1.4;
}

.content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e0e0e0;
}

.report-header h2 {
  margin: 0;
  color: #333;
}

.report-actions {
  display: flex;
  gap: 10px;
}

.report-actions button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background: white;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.report-actions button:hover {
  background: #f5f5f5;
}

.print-btn:hover { background: #e3f2fd; }
.pdf-btn:hover { background: #ffebee; }
.excel-btn:hover { background: #e8f5e9; }
.share-btn:hover { background: #fff3e0; }

.report-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.summary-card {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  border: 1px solid #e0e0e0;
}

.summary-card h4 {
  margin: 0 0 10px 0;
  color: #666;
  font-size: 14px;
}

.summary-card p {
  margin: 0;
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.report-table-container {
  overflow-x: auto;
}

.report-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}

.report-table th,
.report-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
  font-size: 14px;
}

.report-table th {
  background-color: #f2f2f2;
  font-weight: bold;
  color: #333;
  position: sticky;
  top: 0;
}

.report-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.report-table tr:hover {
  background-color: #f1f1f1;
}

.positive {
  color: #28a745;
  font-weight: bold;
}

.negative {
  color: #dc3545;
  font-weight: bold;
}

.status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.status.completed {
  background: #d4edda;
  color: #155724;
}

.status.pending {
  background: #fff3cd;
  color: #856404;
}

.status.failed {
  background: #f8d7da;
  color: #721c24;
}

/* Modals */
.filter-modal,
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.filter-modal-content,
.modal-content {
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

.filter-modal-buttons,
.modal-buttons {
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

.modal-buttons button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s ease;
}

.modal-buttons button[type="button"] {
  background: #6c757d;
  color: white;
}

.modal-buttons button[type="button"]:hover {
  background: #5a6268;
}

.modal-buttons button[type="submit"] {
  background: #007bff;
  color: white;
}

.modal-buttons button[type="submit"]:hover {
  background: #0056b3;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .report-type-grid {
    grid-template-columns: 1fr;
  }
  
  .report-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
  
  .report-actions {
    justify-content: center;
  }
  
  .filter-section > div {
    flex: 1 1 45%;
  }
  
  .filter-section button {
    flex: 1 1 45%;
    max-width: unset;
  }
}

@media (max-width: 480px) {
  .top-buttons {
    flex-direction: column;
  }
  
  .filter-section {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-section > div,
  .filter-section button {
    flex: 1 1 100%;
    max-width: unset;
  }
}
</style>