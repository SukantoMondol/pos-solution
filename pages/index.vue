<template>
  <div class="home-container">
    <!-- Main Controls Container -->
    <div class="controls-container">
      <div class="top-header-row">
        <div class="app-name">POS SOLUTION</div>
        <div class="notification-icon" @click="showNotification">
          🔔
        </div>
        <button class="balance-btn" @click="toggleBalanceSwipe">Balance</button>
      </div>

      <div class="top-buttons">
        <button class="settings-btn" @click="toggleSettingsModal">Settings</button>
        <button class="menu-btn" @click="toggleMenuModal">Menu</button>
        <button class="statement-btn" @click="toggleStatementModal">Statement</button>
    </div>

    <!-- Settings Modal -->
      <div v-if="showSettingsModal" class="modal-overlay" @click="closeAllModals">
        <div class="modal-content" @click.stop>
          <h3>Settings</h3>
          <div class="modal-buttons">
            <button @click="toggleDarkMode">Dark Mode</button>
            <button @click="navigateTo('/currency')">Currency</button>
            <button @click="navigateTo('/profile')">Edit Profile</button>
            <button @click="navigateTo('/details')">App Details</button>
            <button @click="navigateTo('/upgrade')">Upgrade</button>
            <button @click="navigateTo('/languages')">Languages</button>
            <button @click="navigateTo('/printer')">Ad Printer</button>
            <button @click="navigateTo('/export')">Export</button>
            <button @click="handleLogout">Logout</button>
          </div>
        </div>
      </div>

      <!-- Menu Modal -->
      <div v-if="showMenuModal" class="modal-overlay" @click="closeAllModals">
        <div class="modal-content" @click.stop>
          <h3>Menu</h3>
          <div class="modal-buttons">
            <button @click="navigateTo('/accounts')">Account</button>
            <button @click="navigateTo('/expense')">Expense</button>
            <button @click="navigateTo('/products')">Product</button>
            <button @click="navigateTo('/supplier')">Supplier</button>
            <button @click="navigateTo('/customers')">Customer</button>
            <button @click="navigateTo('/purchase')">Purchase</button>
            <button @click="navigateTo('/sales')">Sales</button>
            <button @click="navigateTo('/return')">Return</button>
            <button @click="navigateTo('/payment')">Payment</button>
            <button @click="navigateTo('/bank')">Bank</button>
            <button @click="navigateTo('/loan')">Bank Loan</button>
            <button @click="navigateTo('/installment')">Installment</button>
            <button @click="navigateTo('/employee')">Employee</button>
            <button @click="navigateTo('/salary')">Salary</button>
            <button @click="navigateTo('/reset')">Reset Account</button>
            <button @click="navigateTo('/sms')">SMS Service</button>
    </div>
      </div>
    </div>

    <!-- Statement Modal -->
      <div v-if="showStatementModal" class="modal-overlay" @click="closeAllModals">
        <div class="modal-content" @click.stop>
        <h3>Account Report</h3>
          <div class="form-group">
            <label>Transaction Type</label>
            <select v-model="selectedTransactionType">
              <option value="all">All Transaction</option>
              <option value="ad-money">Ad Money</option>
              <option value="send-money">Send Money</option>
              <option value="cash-out">Cash Out</option>
            </select>
          </div>
          <div class="form-group">
            <label>Export Type</label>
            <select v-model="exportType">
              <option value="PRINT">PRINT</option>
              <option value="PDF">PDF</option>
            </select>
          </div>
          <div class="modal-buttons">
            <button @click="closeAllModals">Close</button>
            <button @click="handleStatementExport">Export</button>
          </div>
        </div>
      </div>

      <!-- Filter Section -->
      <div class="filter-section">
        <div>
          <select v-model="selectedDataType">
            <option value="home">Select Page</option>
            <option value="account">Account</option>
            <option value="expense">Expense</option>
            <option value="customer">Customer</option>
            <option value="supplier">Supplier</option>
            <option value="purchase">Purchase</option>
            <option value="sales">Sales</option>
            <option value="bank">Bank</option>
            <option value="loan">Bank Loan</option>
            <option value="installment">Installment</option>
            <option value="employee">Employee</option>
            <option value="salary">Salary</option>
            <option value="bangla">Bangla</option>
            <option value="sslecomerz">SSL eCommerce</option>
            <option value="return">Return</option>
            <option value="payment">Payment</option>
            <option value="admoney">Ad Money</option>
            <option value="sendmoney">Send Money</option>
            <option value="cashout">Cash Out</option>
            <option value="qrcode">QR Code</option>
            <option value="profit">Profit</option>
            <option value="recharge">Recharge</option>
            <option value="electricity">Electricity</option>
            <option value="document">Documents</option>
            <option value="currency">Currency</option>
            <option value="profile">Profile</option>
            <option value="details">App Details</option>
            <option value="upgrade">Upgrade</option>
            <option value="languages">Languages</option>
            <option value="printer">Printer</option>
            <option value="export">Export</option>
            <option value="reports">Reports</option>
          </select>
        </div>
        <div>
          <input type="text" v-model="searchQuery" placeholder="Search" @keyup.enter="filterAndDisplay">
        </div>
        <button @click="filterAndDisplay">Apply Filter</button>
      </div>
    </div>

    <!-- Balance Swipe Container -->
    <div v-if="showBalanceSwipe" class="balance-swipe-container">
      <button class="close-swipe-btn" @click="toggleBalanceSwipe">×</button>
      <div class="balance-content">
        <h3>Total Balance</h3>
        <p>{{ formatCurrency(totalBalance) }}</p>
      </div>
    </div>

    <!-- Home Content -->
    <div class="home-content">
      <!-- Banner Container -->
    <div class="banner-container">
        <div v-for="(banner, index) in banners" :key="index" 
             :class="['banner-slide', { active: currentBannerIndex === index }]">
          <img :src="banner.src" :alt="banner.alt">
      </div>
    </div>

    <!-- Quick Actions Grid -->
      <div class="home-buttons-grid">
        <button class="button-kyc" @click="navigateTo('/admoney')">Ad Money</button>
        <button class="button-cash-in" @click="navigateTo('/sendmoney')">Send Money</button>
        <button class="button-cash-out" @click="navigateTo('/cashout')">Cash Out</button>

        <button class="button-balance" @click="navigateTo('/reports')">Report</button>
        <button class="button-profit" @click="navigateTo('/qrcode')">Qr Code</button>
        <button class="button-reports" @click="navigateTo('/profit')">Profit</button>

        <button class="button-topup" @click="navigateTo('/recharge')">Recharge</button>
        <button class="button-pay-bill" @click="navigateTo('/electricity')">Electricity</button>
        <button class="button-receive" @click="navigateTo('/document')">Document</button>
      </div>
      
      <!-- About Section -->
      <div class="about-section">
        <div class="about-content-single">
          <img src="https://480025.fs1.hubspotusercontent-na1.net/hubfs/480025/COMPANY%20LOGO%20%2860%29-1.png" 
               alt="Business Logo" class="about-image">
          <h4 class="about-text-content">
            Use our pos solution app to manage your business with ease.
          </h4>
          <a href="tel:+8801725514030" class="about-contact-btn">Help Line</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Page meta
definePageMeta({
  title: 'Home'
})

// Reactive data
const showSettingsModal = ref(false)
const showMenuModal = ref(false)
const showStatementModal = ref(false)
const showBalanceSwipe = ref(false)
const isDarkMode = ref(false)
const selectedDataType = ref('home')
const searchQuery = ref('')
const selectedTransactionType = ref('all')
const exportType = ref('PRINT')
const currentBannerIndex = ref(0)

// Mock data
const totalBalance = ref(50000)

// Banner images
const banners = ref([
  { src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1EIiYJgMKTkO_Th1ibkvyHi9kVcESse6ETpP4lpV_Ehh-BbOO_K658wk&s=10', alt: 'Banner 1' },
  { src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWwozyS3Cu8t5LzjMDVk1WKqI_wy5qTI0rk0xF6EEPbZdIYKseR5boLiKP&s=10', alt: 'Banner 2' },
  { src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlfZgKALAC7Hju7rJL8-qVDRcCquQfk0O75g&s', alt: 'Banner 3' }
])

// Methods
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

const showNotification = () => {
  alert('Notification clicked!')
}

const toggleBalanceSwipe = () => {
  showBalanceSwipe.value = !showBalanceSwipe.value
}

const toggleSettingsModal = () => {
  console.log('Settings clicked')
  showSettingsModal.value = !showSettingsModal.value
  showMenuModal.value = false
  showStatementModal.value = false
}

const toggleMenuModal = () => {
  console.log('Menu clicked')
  showMenuModal.value = !showMenuModal.value
  showSettingsModal.value = false
  showStatementModal.value = false
}

const toggleStatementModal = () => {
  console.log('Statement clicked')
  showStatementModal.value = !showStatementModal.value
  showSettingsModal.value = false
  showMenuModal.value = false
}

const closeAllModals = () => {
  showSettingsModal.value = false
  showMenuModal.value = false
  showStatementModal.value = false
}

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  if (process.client) {
    document.body.classList.toggle('dark-mode', isDarkMode.value)
    localStorage.setItem('darkMode', isDarkMode.value.toString())
  }
  closeAllModals()
}

const handleStatementExport = () => {
  alert(`Exporting as ${exportType.value}`)
  closeAllModals()
}

const onPageSelect = () => {
  // Automatically navigate when a page is selected from dropdown
  if (selectedDataType.value && selectedDataType.value !== 'home') {
    navigateTo(`/${selectedDataType.value}`)
  }
}

const filterAndDisplay = () => {
  console.log('Filtering with:', { selectedDataType: selectedDataType.value, searchQuery: searchQuery.value })
  
  // Navigate to the selected page
  if (selectedDataType.value && selectedDataType.value !== 'home') {
    navigateTo(`/${selectedDataType.value}`)
  }
}

const handleLogout = () => {
  if (process.client) {
    window.location.href = '/login'
  }
}

const navigateTo = (path: string) => {
  if (process.client) {
    window.location.href = path
  }
  closeAllModals()
}

// Banner rotation
let bannerInterval: NodeJS.Timeout | null = null

const startBannerRotation = () => {
  bannerInterval = setInterval(() => {
    currentBannerIndex.value = (currentBannerIndex.value + 1) % banners.value.length
  }, 3000)
}

const stopBannerRotation = () => {
  if (bannerInterval) {
    clearInterval(bannerInterval)
    bannerInterval = null
  }
}

// Lifecycle
onMounted(() => {
  // Initialize dark mode
  if (process.client) {
    const saved = localStorage.getItem('darkMode')
    isDarkMode.value = saved === 'true'
    document.body.classList.toggle('dark-mode', isDarkMode.value)
  }
  
  // Start banner rotation
  startBannerRotation()
})

onUnmounted(() => {
  stopBannerRotation()
})
</script>

<style scoped>
.home-container {
  font-family: 'Roboto', sans-serif;
  background: #f5f5f5;
  padding: 10px;
  margin: 0;
  box-sizing: border-box;
  min-height: 100vh;
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
}

.top-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 10px;
}

.app-name {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  padding: 5px 10px;
  border: 0.3px solid #ccc;
  border-radius: 5px;
  flex-grow: 1;
  text-align: left;
  margin-right: 10px;
}

.notification-icon {
  width: 24px;
  height: 24px;
  color: #555;
  cursor: pointer;
  position: relative;
  padding: 5px;
  margin-right: 10px;
  border: 0.2px solid #ccc;
  border-radius: 50%;
  font-size: 16px;
}

.balance-btn {
  background: #FFC107;
  color: #333;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  white-space: nowrap;
}

.top-buttons {
  display: flex;
  gap: 10px;
  width: 100%;
}

.top-buttons button {
  flex: 1;
  padding: 15px 10px;
  font-size: 14px;
  border: none;
  color: white;
  cursor: pointer;
  border-radius: 5px;
  transition: background 0.3s ease;
  min-height: 50px;
}

.settings-btn {
  background: #e67e22;
}

.settings-btn:hover {
  background: #d35400;
}

.menu-btn {
  background: #4caf50;
}

.menu-btn:hover {
  background: #388e3c;
}

.statement-btn {
  background: #007bff;
}

.statement-btn:hover {
  background: #0056b3;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  max-width: 400px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-content h3 {
  margin: 0 0 20px 0;
  color: #333;
  text-align: center;
  font-size: 24px;
}

.modal-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.modal-buttons button {
  padding: 12px 20px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #f8f9fa;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
}

.modal-buttons button:hover {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.filter-section {
  display: flex;
  gap: 10px;
  align-items: end;
  margin-top: 10px;
}

.filter-section > div {
  flex: 1;
}

.filter-section input,
.filter-section select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.filter-section button {
  background: #6c757d;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
  font-size: 14px;
  min-height: 45px;
}

.balance-swipe-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 80%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(5px);
  z-index: 2000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.close-swipe-btn {
  background: none;
  border: none;
  font-size: 30px;
  color: #888;
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
}

.balance-content {
  text-align: center;
}

.balance-content h3 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 24px;
}

.balance-content p {
  font-size: 36px;
  font-weight: bold;
  color: #4CAF50;
  margin: 0;
}

.home-content {
  background: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.banner-container {
  position: relative;
  width: 100%;
  height: 130px;
  overflow: hidden;
  border-radius: 8px;
  margin-bottom: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.banner-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.8s ease-in-out;
}

.banner-slide.active {
  opacity: 1;
}

.banner-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.home-buttons-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  justify-content: center;
  margin-top: 30px;
  margin-bottom: 20px;
}

.home-buttons-grid button {
  padding: 6px 4px;
  font-size: 11px;
  font-weight: bold;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  border: 1px solid;
  background-color: #fff;
  min-height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.button-kyc { border-color: #2196F3; color: #2196F3; }
.button-cash-in { border-color: #4CAF50; color: #4CAF50; }
.button-cash-out { border-color: #E53935; color: #E53935; }
.button-balance { border-color: #FF4081; color: #FF4081; }
.button-profit { border-color: #8BC34A; color: #8BC34A; }
.button-reports { border-color: #795548; color: #795548; }
.button-topup { border-color: #FF9800; color: #FF9800; }
.button-pay-bill { border-color: #9C27B0; color: #9C27B0; }
.button-receive { border-color: #00BCD4; color: #00BCD4; }

.home-buttons-grid button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.about-section {
  text-align: center;
  padding: 20px 0;
}

.about-content-single {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.about-image {
  width: 250px;
  height: 250px;
  border-radius: 50%;
  object-fit: cover;
}

.about-text-content {
  font-size: 16px;
  color: #333;
  margin: 0;
  line-height: 1.5;
}

.about-contact-btn {
  background: #007bff;
  color: white;
  padding: 10px 20px;
  border-radius: 25px;
  text-decoration: none;
  font-weight: bold;
  transition: background 0.3s ease;
}

.about-contact-btn:hover {
  background: #0056b3;
}

@media (max-width: 768px) {
  .home-buttons-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .filter-section {
    flex-direction: column;
    gap: 10px;
  }
}
</style>