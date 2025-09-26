<template>
  <div class="controls-container">
    <div class="top-buttons">
      <button class="home-btn" @click="goToHomePage">Home</button>
      <button class="buy-btn" @click="openBuyModal">Buy SMS</button>
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
      <div class="sms-section">
        <div class="sms-stats">
          <div class="stat-card">
            <div class="stat-icon">📱</div>
            <div class="stat-info">
              <h4>Total SMS</h4>
              <p>{{ totalSMS }}</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">💰</div>
            <div class="stat-info">
              <h4>Total Cost</h4>
              <p>{{ formatCurrency(totalCost) }}</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">✅</div>
            <div class="stat-info">
              <h4>Used SMS</h4>
              <p>{{ usedSMS }}</p>
            </div>
          </div>
        </div>

        <div class="sms-list">
          <h3>SMS Purchase History</h3>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Package</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="sms in filteredSMS" :key="sms.id">
                <td>{{ formatDate(sms.date) }}</td>
                <td>{{ sms.package }}</td>
                <td>{{ sms.quantity }}</td>
                <td>{{ formatCurrency(sms.price) }}</td>
                <td>
                  <span :class="['status', sms.status]">{{ sms.status }}</span>
                </td>
                <td>
                  <button @click="viewSMS(sms)">View</button>
                  <button @click="downloadSMS(sms)">Download</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Buy SMS Modal -->
    <div v-if="showBuyModal" class="modal-overlay" @click="closeBuyModal">
      <div class="modal-content" @click.stop>
        <h3>Buy SMS Package</h3>
        <form @submit.prevent="buySMS">
          <div class="form-group">
            <label for="smsPackage">SMS Package</label>
            <select id="smsPackage" v-model="smsForm.package" required>
              <option value="">Select Package</option>
              <option value="basic">Basic (100 SMS) - $5.00</option>
              <option value="standard">Standard (500 SMS) - $20.00</option>
              <option value="premium">Premium (1000 SMS) - $35.00</option>
              <option value="enterprise">Enterprise (5000 SMS) - $150.00</option>
            </select>
          </div>
          <div class="form-group">
            <label for="paymentMethod">Payment Method</label>
            <select id="paymentMethod" v-model="smsForm.paymentMethod" required>
              <option value="">Select Payment</option>
              <option value="bKash">bKash</option>
              <option value="nagad">Nagad</option>
              <option value="rocket">Rocket</option>
              <option value="bank">Bank Transfer</option>
            </select>
          </div>
          <div class="form-group">
            <label for="phoneNumber">Phone Number</label>
            <input type="tel" id="phoneNumber" v-model="smsForm.phoneNumber" placeholder="+880-1712-345678" required>
          </div>
          <div class="modal-buttons">
            <button type="button" @click="closeBuyModal">Cancel</button>
            <button type="submit">Buy SMS</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Filter Modal -->
    <div v-if="showFilterModal" class="filter-modal" @click="closeFilterModal">
      <div class="filter-modal-content" @click.stop>
        <h3>Filter SMS Data</h3>
        
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
            <option value="active">Active</option>
            <option value="used">Used</option>
            <option value="expired">Expired</option>
          </select>
        </div>

        <div class="filter-modal-buttons">
          <button class="close-btn" @click="closeFilterModal">Close</button>
          <button class="apply-filter-btn" @click="applyDateFilter">Apply Filter</button>
        </div>
      </div>
    </div>

    <!-- Download Modal -->
    <div v-if="showDownloadModal" class="modal-overlay" @click="closeDownloadModal">
      <div class="modal-content" @click.stop>
        <h3>Download SMS Report</h3>
        <div class="form-group">
          <label for="reportType">Report Type</label>
          <select id="reportType" v-model="downloadReportType">
            <option value="sms">SMS Report</option>
            <option value="usage">Usage Report</option>
          </select>
        </div>
        <div class="form-group">
          <label for="fileFormat">File Format</label>
          <select id="fileFormat" v-model="downloadFileFormat">
            <option value="pdf">PDF</option>
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
  title: 'SMS Management'
})

const searchQuery = ref('')
const statusFilter = ref('')
const showBuyModal = ref(false)
const showFilterModal = ref(false)
const showDownloadModal = ref(false)
const dateRangeFilter = ref('all')
const startDate = ref('')
const endDate = ref('')
const downloadReportType = ref('sms')
const downloadFileFormat = ref('pdf')

const smsForm = ref({
  package: '',
  paymentMethod: '',
  phoneNumber: ''
})

const smsPackages = ref([
  { id: 1, date: '2024-01-20', package: 'Standard', quantity: 500, price: 20.00, status: 'active' },
  { id: 2, date: '2024-01-15', package: 'Basic', quantity: 100, price: 5.00, status: 'used' },
  { id: 3, date: '2024-01-10', package: 'Premium', quantity: 1000, price: 35.00, status: 'active' },
  { id: 4, date: '2024-01-05', package: 'Enterprise', quantity: 5000, price: 150.00, status: 'expired' }
])

const filteredSMS = computed(() => {
  let filtered = smsPackages.value

  if (searchQuery.value) {
    filtered = filtered.filter(sms =>
      sms.package.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      sms.status.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(sms => sms.status === statusFilter.value)
  }

  return filtered
})

const totalSMS = computed(() => smsPackages.value.reduce((sum, sms) => sum + sms.quantity, 0))
const usedSMS = computed(() => smsPackages.value.filter(sms => sms.status === 'used').reduce((sum, sms) => sum + sms.quantity, 0))
const totalCost = computed(() => smsPackages.value.reduce((sum, sms) => sum + sms.price, 0))

const goToHomePage = () => {
  if (process.client) {
    window.location.href = '/'
  }
}

const openBuyModal = () => {
  showBuyModal.value = true
}

const closeBuyModal = () => {
  showBuyModal.value = false
  smsForm.value = {
    package: '',
    paymentMethod: '',
    phoneNumber: ''
  }
}

const buySMS = () => {
  const newId = smsPackages.value.length > 0 ? Math.max(...smsPackages.value.map(s => s.id)) + 1 : 1
  const packageInfo = {
    basic: { quantity: 100, price: 5.00 },
    standard: { quantity: 500, price: 20.00 },
    premium: { quantity: 1000, price: 35.00 },
    enterprise: { quantity: 5000, price: 150.00 }
  }
  
  const selectedPackage = packageInfo[smsForm.value.package]
  smsPackages.value.push({
    id: newId,
    date: new Date().toISOString().split('T')[0],
    package: smsForm.value.package.charAt(0).toUpperCase() + smsForm.value.package.slice(1),
    quantity: selectedPackage.quantity,
    price: selectedPackage.price,
    status: 'active'
  })
  
  closeBuyModal()
  alert('SMS package purchased successfully!')
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

const viewSMS = (sms) => {
  alert(`Viewing SMS package: ${sms.package}`)
}

const downloadSMS = (sms) => {
  alert(`Downloading SMS package: ${sms.package}`)
}

const handleDownload = () => {
  alert(`Downloading ${downloadReportType.value} as ${downloadFileFormat.value}`)
  closeDownloadModal()
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value)
}

const formatDate = (dateString) => {
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

.buy-btn {
  background: #4caf50;
}

.buy-btn:hover {
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

.content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.sms-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sms-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.stat-card {
  background: #e0f7fa;
  padding: 15px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.stat-card:nth-child(2) {
  background: #fff3e0;
}

.stat-card:nth-child(3) {
  background: #e8f5e9;
}

.stat-icon {
  font-size: 24px;
}

.stat-info h4 {
  margin: 0;
  color: #333;
  font-size: 16px;
}

.stat-info p {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
  color: #00796b;
}

.sms-list h3 {
  margin-top: 0;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  margin-bottom: 15px;
}

.sms-list table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}

.sms-list th,
.sms-list td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
  font-size: 14px;
}

.sms-list th {
  background-color: #f2f2f2;
  font-weight: bold;
  color: #333;
}

.sms-list tr:nth-child(even) {
  background-color: #f9f9f9;
}

.sms-list tr:hover {
  background-color: #f1f1f1;
}

.sms-list td button {
  background: #2196f3;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 5px;
  font-size: 12px;
}

.sms-list td button:hover {
  background: #1976d2;
}

.sms-list td button:last-child {
  background: #f44336;
}

.sms-list td button:last-child:hover {
  background: #d32f2f;
}

.status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.status.active {
  background: #d4edda;
  color: #155724;
}

.status.used {
  background: #fff3cd;
  color: #856404;
}

.status.expired {
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
  .filter-section > div {
    flex: 1 1 45%;
  }
  .filter-section button {
    flex: 1 1 45%;
    max-width: unset;
  }
  .sms-stats {
    grid-template-columns: 1fr;
  }
  .sms-list th, .sms-list td {
    padding: 8px;
    font-size: 12px;
  }
  .modal-content {
    width: 95%;
    padding: 20px;
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

