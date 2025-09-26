<template>
  <div class="sales-container" :class="{ 'dark-mode': isDarkMode }">
    <div class="controls-container">
      <div class="top-buttons">
        <button class="filter-btn" @click="openFilterModal">Filter</button>
        <button class="create-btn" @click="openCreateModal">Sales</button>
        <button class="download-btn" @click="openDownloadModal">Download</button>
      </div>

      <div class="filter-section">
        <div style="display:none;">
          <label for="dataTypeFilter"></label>
          <select id="dataTypeFilter" v-model="dataTypeFilter" @change="updateUIForDataType">
            <option value="sales">Sales</option>
          </select>
        </div>
        <button class="home-btn" @click="handleHomeClick">Home</button>
        <div>
          <label for="searchInput">Search</label>
          <input 
            type="text" 
            id="searchInput" 
            v-model="searchQuery"
            @input="handleSearch"
            @focus="handleLabelAnimation"
            @blur="handleLabelAnimation"
            @change="handleLabelAnimation"
          >
        </div>
        <button @click="applyFilters">Apply Filter</button>
      </div>
    </div>

    <!-- Filter Modal -->
    <div id="filterModal" class="filter-modal" :style="{ display: showFilterModal ? 'flex' : 'none' }">
      <div class="filter-modal-content">
        <h3>Filter Data Date</h3>

        <div class="form-group">
          <select id="dateRangeFilter" v-model="dateRangeFilter" @change="toggleCustomDates">
            <option value="all">All Data</option>
            <option value="today">Today</option>
            <option value="last7days">Last 7 Days</option>
            <option value="thisMonth">This Month</option>
            <option value="thisYear">This Year</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        <div id="customDateFields" :style="{ display: showCustomDates ? 'block' : 'none' }">
          <div class="form-group">
            <label for="startDate">Start Date</label>
            <input type="date" id="startDate" v-model="customStartDate">
          </div>
          <div class="form-group">
            <label for="endDate">End Date</label>
            <input type="date" id="endDate" v-model="customEndDate">
          </div>
        </div>

        <div class="filter-modal-buttons">
          <button class="close-btn" @click="closeFilterModal">Close</button>
          <button class="apply-filter-btn" @click="applyDateFilter">Filter</button>
        </div>
      </div>
    </div>

    <!-- Create Modal -->
    <div id="createModal" class="create-modal-overlay" :style="{ display: showCreateModal ? 'flex' : 'none' }">
      <div class="create-modal-content">
        <h3>Create New Sales</h3>
        <div class="form-group" style="display:none;">
          <label for="createDataType">Select Data Type:</label>
          <select id="createDataType" v-model="createDataType">
            <option value="sales" selected>Sales</option>
          </select>
        </div>
        <div id="createFormFields">
          <div class="form-group">
            <label for="salesDate">Sales Date</label>
            <input type="date" id="salesDate" v-model="salesForm.salesDate" required>
          </div>
          <div class="form-group">
            <label for="invoiceNo">Invoice No</label>
            <input type="text" id="invoiceNo" v-model="salesForm.invoiceNo" required readonly>
          </div>
          <div class="form-group">
            <label for="customerSelect">Select Customer</label>
            <select id="customerSelect" v-model="salesForm.customerName" required>
              <option value=""></option>
              <option v-for="customer in customers" :key="customer.id" :value="customer.name">
                {{ customer.name }}
              </option>
            </select>
          </div>

          <h4>Product Details</h4>
          
          <div id="productFieldsContainer">
            <div v-for="(product, index) in salesProducts" :key="index" class="sales-items-container product-item">
              <button 
                v-if="salesProducts.length > 1" 
                type="button" 
                class="remove-btn" 
                @click="removeProductItem(index)"
              >
                -
              </button>

              <div class="form-group">
                <label :for="`productAdType_${index}`">Product Add Type</label>
                <select :id="`productAdType_${index}`" v-model="product.addType" @change="renderSpecificProductItem(index)">
                  <option value="select">Select</option>
                  <option value="scan">Scan</option>
                </select>
              </div>

              <div :id="`productItemDetails_${index}`"></div>
            </div>
          </div>
          
          <div class="add-product-btn-container">
            <button type="button" class="add-product-btn" @click="addNewProductItem">+ Add Product</button>
          </div>

          <div class="form-group">
            <label for="totalSales">Total Sales</label>
            <input type="number" id="totalSales" v-model="salesForm.totalSales" step="0.01" readonly>
          </div>
          <div class="form-group">
            <label for="discountType">Discount Type</label>
            <select id="discountType" v-model="salesForm.discountType" @change="toggleDiscountFields">
              <option value="no_discount">No Discount</option>
              <option value="fix">Fix Discount</option>
              <option value="percent">Percent</option>
            </select>
          </div>
          <div class="form-group" id="discountAmountGroup" :style="{ display: salesForm.discountType === 'no_discount' ? 'none' : 'flex' }">
            <label for="discountAmount">Discount Amount</label>
            <input type="number" id="discountAmount" v-model="salesForm.discountAmount" step="0.01" @input="calculateTotals">
          </div>
          <div class="form-group">
            <label for="afterDiscount">Total After Discount</label>
            <input type="number" id="afterDiscount" v-model="salesForm.afterDiscount" step="0.01" readonly>
          </div>
          <div class="form-group">
            <label for="creditAccount">Credit Account</label>
            <select id="creditAccount" v-model="salesForm.creditAccount" required>
              <option value=""></option>
              <option v-for="account in accounts" :key="account.id" :value="account.bankName">
                {{ account.bankName }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label for="avlBalance">Available Balance</label>
            <input type="number" id="avlBalance" :value="availableBalance" step="0.01" readonly>
          </div>
          <div class="form-group">
            <label for="receivedAmount">Received Amount</label>
            <input type="number" id="receivedAmount" v-model="salesForm.receivedAmount" step="0.01" @input="calculateDue">
          </div>
          <div class="form-group">
            <label for="totalDue">Total Due</label>
            <input type="number" id="totalDue" v-model="salesForm.totalDue" step="0.01" readonly>
          </div>
          <div class="form-group">
            <label for="receiveType">Receive Type</label>
            <select id="receiveType" v-model="salesForm.receiveType" @change="updateSubmitButtonText">
              <option value="Cash_Resive">Cash Resive</option>
              <option value="Bkash_Resive">Bkash Payment</option>
              <option value="Bank_Resive">Online Bank Resive</option>
            </select>
          </div>
        </div>
        <div class="create-modal-buttons">
          <button class="close-btn" @click="closeCreateModal">Close</button>
          <button class="submit-btn" :disabled="!canSubmit" @click="submitCreateForm">
            {{ submitButtonText }}
          </button>
        </div>
      </div>
    </div>

    <!-- Download Modal -->
    <div id="downloadModal" class="download-modal-overlay" :style="{ display: showDownloadModal ? 'flex' : 'none' }">
      <div class="download-modal-content">
        <h3>Download Sales Report</h3>

        <div class="form-group">
          <label for="downloadAccountType">Sales Type</label>
          <select id="downloadAccountType" v-model="downloadForm.salesType" @change="handleDownloadAccountTypeChange">
            <option value="all">All Sales</option>
            <option value="single">Single Customer</option>
          </select>
        </div>

        <div class="form-group download-account-group" :style="{ display: downloadForm.salesType === 'single' ? 'flex' : 'none' }">
          <label for="downloadAccount">Select Customer</label>
          <select id="downloadAccount" v-model="downloadForm.selectedCustomer">
            <option value=""></option>
            <option v-for="customer in customers" :key="customer.id" :value="customer.name">
              {{ customer.name }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="downloadSelectRange">Select Range</label>
          <select id="downloadSelectRange" v-model="downloadForm.selectRange" @change="handleDownloadRangeChange">
            <option value="current">Current Filtered Data</option>
            <option value="all">All Data</option>
            <option value="today">Today</option>
            <option value="last7days">Last 7 Days</option>
            <option value="thismonth">This Month</option>
            <option value="thisyear">This Year</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        <div class="download-date-range-inputs inline-inputs" :style="{ display: downloadForm.selectRange === 'custom' ? 'flex' : 'none' }">
          <div>
            <label for="downloadStartDate">Start Date</label>
            <input type="date" id="downloadStartDate" v-model="downloadForm.startDate">
          </div>
          <div>
            <label for="downloadEndDate">End Date</label>
            <input type="date" id="downloadEndDate" v-model="downloadForm.endDate">
          </div>
        </div>

        <div class="form-group">
          <label for="downloadPageSize">Select Page Size</label>
          <select id="downloadPageSize" v-model="downloadForm.pageSize" @change="handleDownloadPageSizeChange">
            <option value="A4">A4</option>
            <option value="Legal">Legal</option>
            <option value="Thermal">Thermal</option>
          </select>
        </div>

        <div class="form-group page-orientation-select" :style="{ display: ['A4', 'Legal'].includes(downloadForm.pageSize) ? 'flex' : 'none' }">
          <label for="downloadPageOrientation">Orientation</label>
          <select id="downloadPageOrientation" v-model="downloadForm.pageOrientation">
            <option value="Portrait">Portrait</option>
            <option value="Landscape">Landscape</option>
          </select>
        </div>

        <div class="form-group page-weight-input" :style="{ display: downloadForm.pageSize === 'Thermal' ? 'flex' : 'none' }">
          <label for="downloadPageWeight">Page Weight Size</label>
          <input type="number" id="downloadPageWeight" v-model="downloadForm.pageWeight" placeholder="e.g., 80 GSM">
        </div>

        <div class="form-group printer-model-select" :style="{ display: downloadForm.pageSize === 'Thermal' ? 'flex' : 'none' }">
          <label for="downloadPrinterModel">Printer Model</label>
          <select id="downloadPrinterModel" v-model="downloadForm.printerModel">
            <option value="">Select Printer</option>
            <option v-for="printer in printers" :key="printer.id" :value="printer.modelName">
              {{ printer.modelName }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="downloadExportType">Select Export Type</label>
          <select id="downloadExportType" v-model="downloadForm.exportType" @change="updateDownloadExportButtonText">
            <option value="PRINT">PRINT</option>
            <option value="PDF">PDF</option>
            <option value="CSV">CSV</option>
            <option value="SHARE">SHARE</option>
          </select>
        </div>

        <div class="download-modal-buttons">
          <button class="close-btn" @click="closeDownloadModal">Close</button>
          <button class="export-btn" @click="handleDownloadExport">{{ downloadForm.exportType }}</button>
        </div>
      </div>
    </div>

    <div class="summary-panel-container">
      <div id="summaryPanel" class="summary-panel">
        <div class="summary-item">
          <span class="title">Total Sales</span>
          <span class="amount">{{ formatCurrency(totalSales) }}</span>
        </div>
        <div class="summary-item">
          <span class="title">Sales Received</span>
          <span class="amount">{{ formatCurrency(totalReceived) }}</span>
        </div>
        <div class="summary-item" :class="{ 'profit': totalDue >= 0, 'loss': totalDue < 0 }">
          <span class="title">Sales Due</span>
          <span class="amount">{{ formatCurrency(totalDue) }}</span>
        </div>
      </div>
    </div>

    <div class="table-message" id="salesTypeMessage" :style="{ display: 'none' }">
      <p class="account-type-message"></p>
    </div>

    <div class="table-container" id="mainTableContainer">
      <table id="posTable">
        <thead>
          <tr>
            <th>SL</th>
            <th>Invoice No</th>
            <th>Sales Date</th>
            <th>Customer Name</th>
            <th>Category Name</th>
            <th>Product Name</th>
            <th>Qty</th>
            <th>Unit Price</th>
            <th>Total Sales</th>
            <th>Discount Type</th>
            <th>Discount Amount</th>
            <th>After Discount</th>
            <th>Credit Account</th>
            <th>Received Amount</th>
            <th>Total Due</th>
            <th>Receive Type</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoading">
            <td :colspan="17" class="loading-cell">
              <div class="loading-spinner">
                <div class="spinner"></div>
                <span>Loading sales...</span>
              </div>
            </td>
          </tr>
          <tr v-else-if="filteredSales.length === 0">
            <td :colspan="17" class="no-data-message">
              No sales found.
            </td>
          </tr>
          <tr v-else v-for="(sale, index) in filteredSales" :key="sale.id">
            <td>{{ index + 1 }}</td>
            <td>{{ sale.invoiceNo }}</td>
            <td>{{ formatDate(sale.salesDate) }}</td>
            <td>{{ sale.customerName }}</td>
            <td>{{ sale.products.map(p => p.categoryName).join(', ') }}</td>
            <td>{{ sale.products.map(p => p.productName).join(', ') }}</td>
            <td>{{ sale.products.map(p => p.qty).join(', ') }}</td>
            <td>{{ sale.products.map(p => p.unitPrice).join(', ') }}</td>
            <td>{{ formatCurrency(sale.totalSales) }}</td>
            <td>{{ sale.discountType }}</td>
            <td>{{ formatCurrency(sale.discountAmount) }}</td>
            <td>{{ formatCurrency(sale.afterDiscount) }}</td>
            <td>{{ sale.creditAccount }}</td>
            <td>{{ formatCurrency(sale.receivedAmount) }}</td>
            <td>{{ formatCurrency(sale.totalDue) }}</td>
            <td>{{ sale.receiveType }}</td>
            <td>
              <select
                @change="handleAction($event, sale.id)"
                class="action-select"
              >
                <option value="">Select Action</option>
                <option value="edit">Edit</option>
                <option value="delete">Delete</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Sales'
})

const showFilterModal = ref(false)
const showCreateModal = ref(false)
const showDownloadModal = ref(false)
const editingSale = ref(null)
const searchQuery = ref('')
const isLoading = ref(false)
const isDarkMode = ref(false)

// Filter and date range
const dataTypeFilter = ref('sales')
const dateRangeFilter = ref('all')
const customStartDate = ref('')
const customEndDate = ref('')
const showCustomDates = ref(false)

// Sales form
const salesForm = ref({
  salesDate: new Date().toISOString().split('T')[0],
  invoiceNo: '',
  customerName: '',
  totalSales: 0,
  discountType: 'no_discount',
  discountAmount: 0,
  afterDiscount: 0,
  creditAccount: '',
  receivedAmount: 0,
  totalDue: 0,
  receiveType: 'Cash_Resive'
})

const createDataType = ref('sales')
const salesProducts = ref([])
const availableBalance = ref(0)
const submitButtonText = ref('Cash')

// Download form
const downloadForm = ref({
  salesType: 'all',
  selectedCustomer: '',
  selectRange: 'current',
  startDate: '',
  endDate: '',
  pageSize: 'A4',
  pageOrientation: 'Portrait',
  pageWeight: '',
  printerModel: '',
  exportType: 'PRINT'
})

// Mock data
const sales = ref([
  {
    id: 1,
    invoiceNo: 'S-001',
    salesDate: '2024-01-15',
    customerName: 'John Doe',
    products: [
      { categoryName: 'Electronics', productName: 'Laptop', qty: 1, unitPrice: 1000 }
    ],
    totalSales: 1000,
    discountType: 'no_discount',
    discountAmount: 0,
    afterDiscount: 1000,
    creditAccount: 'Bank A',
    receivedAmount: 1000,
    totalDue: 0,
    receiveType: 'Cash Resive'
  },
  {
    id: 2,
    invoiceNo: 'S-002',
    salesDate: '2024-01-15',
    customerName: 'Jane Smith',
    products: [
      { categoryName: 'Clothing', productName: 'Shirt', qty: 2, unitPrice: 25 }
    ],
    totalSales: 50,
    discountType: 'percent',
    discountAmount: 5,
    afterDiscount: 45,
    creditAccount: 'Bank B',
    receivedAmount: 45,
    totalDue: 0,
    receiveType: 'Bkash Payment'
  }
])

const customers = ref([
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
  { id: 3, name: 'Bob Johnson' }
])

const accounts = ref([
  { id: 1, bankName: 'Bank A', initialBalance: 5000 },
  { id: 2, bankName: 'Bank B', initialBalance: 3000 }
])

const printers = ref([
  { id: 1, modelName: 'Epson TM-T20' },
  { id: 2, modelName: 'Star TSP143' }
])

// Computed
const filteredSales = computed(() => {
  let filtered = sales.value

  // Apply date filter
  if (dateRangeFilter.value !== 'all') {
    filtered = filtered.filter(sale => {
      const saleDate = new Date(sale.salesDate)
      const today = new Date()
      
      switch (dateRangeFilter.value) {
        case 'today':
          return saleDate.toDateString() === today.toDateString()
        case 'last7days':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
          return saleDate >= weekAgo
        case 'thisMonth':
          return saleDate.getMonth() === today.getMonth() && saleDate.getFullYear() === today.getFullYear()
        case 'thisYear':
          return saleDate.getFullYear() === today.getFullYear()
        case 'custom':
          if (customStartDate.value && customEndDate.value) {
            return saleDate >= new Date(customStartDate.value) && saleDate <= new Date(customEndDate.value)
          }
          return true
        default:
          return true
      }
    })
  }

  // Apply search filter
  if (searchQuery.value) {
    filtered = filtered.filter(sale => 
      sale.customerName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      sale.invoiceNo.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      sale.creditAccount.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  return filtered
})

const totalSales = computed(() => {
  return filteredSales.value.reduce((sum, sale) => sum + sale.totalSales, 0)
})

const totalReceived = computed(() => {
  return filteredSales.value.reduce((sum, sale) => sum + sale.receivedAmount, 0)
})

const totalDue = computed(() => {
  return totalSales.value - totalReceived.value
})

const canSubmit = computed(() => {
  return salesForm.value.salesDate && 
         salesForm.value.customerName && 
         salesProducts.value.length > 0 && 
         salesForm.value.creditAccount
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
  return amount.toFixed(2)
}

const openFilterModal = () => {
  showFilterModal.value = true
}

const closeFilterModal = () => {
  showFilterModal.value = false
}

const openCreateModal = () => {
  editingSale.value = null
  salesForm.value = {
    salesDate: new Date().toISOString().split('T')[0],
    invoiceNo: generateInvoiceNo(),
    customerName: '',
    totalSales: 0,
    discountType: 'no_discount',
    discountAmount: 0,
    afterDiscount: 0,
    creditAccount: '',
    receivedAmount: 0,
    totalDue: 0,
    receiveType: 'Cash_Resive'
  }
  salesProducts.value = []
  addNewProductItem()
  showCreateModal.value = true
}

const closeCreateModal = () => {
  showCreateModal.value = false
  editingSale.value = null
}

const openDownloadModal = () => {
  showDownloadModal.value = true
}

const closeDownloadModal = () => {
  showDownloadModal.value = false
}

const generateInvoiceNo = () => {
  const lastSale = sales.value.sort((a, b) => b.invoiceNo.localeCompare(a.invoiceNo)).find(s => s.invoiceNo.startsWith('S-'))
  if (lastSale) {
    const lastNumber = parseInt(lastSale.invoiceNo.split('-')[1])
    return 'S-' + String(lastNumber + 1).padStart(3, '0')
  }
  return 'S-001'
}

const toggleCustomDates = () => {
  showCustomDates.value = dateRangeFilter.value === 'custom'
}

const applyDateFilter = () => {
  closeFilterModal()
}

const applyFilters = () => {
  // Filters are applied automatically through computed properties
}

const handleSearch = () => {
  // Search is handled by computed property
}

const handleHomeClick = () => {
  if (process.client) {
    window.location.href = '/'
  }
}

const updateUIForDataType = () => {
  // Update UI based on data type
}

const addNewProductItem = () => {
  salesProducts.value.push({
    addType: 'select',
    categoryName: '',
    productName: '',
    qty: 0,
    unitPrice: 0
  })
}

const removeProductItem = (index: number) => {
  if (salesProducts.value.length > 1) {
    salesProducts.value.splice(index, 1)
  }
}

const renderSpecificProductItem = (index: number) => {
  // This would render the specific product item based on addType
  // For now, just a placeholder
}

const calculateTotals = () => {
  let total = 0
  salesProducts.value.forEach(product => {
    total += (product.qty || 0) * (product.unitPrice || 0)
  })
  salesForm.value.totalSales = total
  calculateAfterDiscount()
}

const calculateAfterDiscount = () => {
  const total = salesForm.value.totalSales
  let discountAmount = salesForm.value.discountAmount
  
  if (salesForm.value.discountType === 'percent') {
    discountAmount = (total * discountAmount) / 100
  }
  
  salesForm.value.afterDiscount = total - discountAmount
  calculateDue()
}

const calculateDue = () => {
  salesForm.value.totalDue = salesForm.value.afterDiscount - salesForm.value.receivedAmount
}

const toggleDiscountFields = () => {
  // Toggle discount fields visibility
}

const updateSubmitButtonText = () => {
  switch (salesForm.value.receiveType) {
    case 'Cash_Resive':
      submitButtonText.value = 'Cash'
      break
    case 'Bkash_Resive':
      submitButtonText.value = 'Bkash'
      break
    case 'Bank_Resive':
      submitButtonText.value = 'Bank'
      break
  }
}

const submitCreateForm = async () => {
  try {
    const newSale = {
      id: Date.now(),
      ...salesForm.value,
      products: salesProducts.value
    }
    
    sales.value.unshift(newSale)
    alert('Sales created successfully!')
    closeCreateModal()
  } catch (error: any) {
    alert(`Error creating sale: ${error.message}`)
  }
}

const handleDownloadAccountTypeChange = () => {
  // Handle download account type change
}

const handleDownloadRangeChange = () => {
  // Handle download range change
}

const handleDownloadPageSizeChange = () => {
  // Handle download page size change
}

const updateDownloadExportButtonText = () => {
  // Update download export button text
}

const handleDownloadExport = () => {
  alert(`Exporting as ${downloadForm.value.exportType}`)
  closeDownloadModal()
}

const handleAction = async (event: Event, saleId: number) => {
  const target = event.target as HTMLSelectElement
  const action = target.value
  
  if (action === 'edit') {
    const sale = sales.value.find(s => s.id === saleId)
    if (sale) {
      editingSale.value = sale
      salesForm.value = { ...sale }
      salesProducts.value = [...sale.products]
      showCreateModal.value = true
    }
  } else if (action === 'delete') {
    if (confirm('Are you sure you want to delete this sale?')) {
      sales.value = sales.value.filter(s => s.id !== saleId)
      alert('Sale deleted successfully!')
    }
  }
  
  target.value = ''
}

const handleLabelAnimation = (event: Event) => {
  const input = event.target as HTMLInputElement
  const parentDiv = input.closest('.form-group') || input.closest('.filter-section > div')
  
  if (parentDiv) {
    if (input.value !== '' || input.type === 'date') {
      parentDiv.classList.add('has-value')
      parentDiv.classList.remove('focused')
    } else {
      parentDiv.classList.remove('has-value')
    }

    if (event.type === 'focus') {
      parentDiv.classList.add('focused')
    } else if (event.type === 'blur') {
      parentDiv.classList.remove('focused')
      if (input.value === '') {
        parentDiv.classList.remove('has-value')
      }
    }
  }
}

onMounted(() => {
  // Setup label animations
  nextTick(() => {
    const inputs = document.querySelectorAll('input, select')
    inputs.forEach(input => {
      input.addEventListener('focus', handleLabelAnimation)
      input.addEventListener('blur', handleLabelAnimation)
      input.addEventListener('change', handleLabelAnimation)
    })
  })
})
</script>

<style scoped>
.sales-container {
  font-family: 'Roboto', sans-serif;
  background: #f5f5f5;
  padding: 20px;
  margin: 0;
  box-sizing: border-box;
  transition: background-color 0.3s, color 0.3s;
}

.sales-container.dark-mode {
  background: #1e1e1e;
  color: #e0e0e0;
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

.dark-mode .controls-container {
  background: #2d2d2d;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
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

.filter-btn {
  background: #009688;
}

.filter-btn:hover {
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

/* Filter Modal Styles */
.filter-modal {
  display: none;
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
  from {
    top: -300px;
    opacity: 0
  }
  to {
    top: 0;
    opacity: 1
  }
}

.filter-modal-content h3 {
  margin-top: 0;
  color: #333;
  text-align: center;
}

/* Form group styles */
.form-group {
  position: relative;
  margin-bottom: 20px;
}

.form-group label {
  position: absolute;
  top: 10px;
  left: 10px;
  background: transparent;
  padding: 0 5px;
  font-size: 14px;
  color: #888;
  pointer-events: none;
  transition: all 0.2s ease-out;
  text-align: left;
  width: auto;
  display: inline-block;
  font-weight: normal;
  transform: translateY(0);
  z-index: 1;
}

.form-group.focused label,
.form-group.has-value label {
  top: -12px;
  font-size: 12px;
  color: #007bff;
  background: #fefefe;
}

.form-group select,
.form-group input[type="date"],
.form-group input[type="text"],
.form-group input[type="number"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
  display: block;
  font-size: 14px;
  background-color: white;
}

.filter-modal-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.filter-modal-buttons button {
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s ease;
}

.filter-modal-buttons .close-btn {
  background: #ccc;
  color: #333;
}

.filter-modal-buttons .close-btn:hover {
  background: #bbb;
}

.filter-modal-buttons .apply-filter-btn {
  background: #009688;
  color: white;
}

.filter-modal-buttons .apply-filter-btn:hover {
  background: #007a6a;
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
  background: #444;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s ease;
  white-space: nowrap;
}

.filter-section .home-btn {
  background: #555;
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

.filter-section > div.focused label,
.filter-section > div.has-value label {
  top: -12px;
  font-size: 12px;
  color: #007bff;
  background: #f5f5f5;
}

.filter-section select,
.filter-section input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  box-sizing: border-box;
  background-color: white;
}

/* Summary Panel Styles */
.summary-panel-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  margin-bottom: 10px;
  padding-right: 0;
}

.summary-panel {
  background: #fff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  width: 30%;
  max-width: 300px;
  box-sizing: border-box;
}

.dark-mode .summary-panel {
  background: #2d2d2d;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
}

.summary-item {
  display: flex;
  column-gap: 10px;
  margin-bottom: 5px;
  font-size: 14px;
  position: relative;
}

.summary-item .title {
  font-weight: bold;
  color: #555;
  flex-grow: 1;
  text-align: left;
}

.dark-mode .summary-item .title {
  color: #bbb;
}

.summary-item .amount {
  font-weight: bold;
  color: #333;
  text-align: right;
  flex-shrink: 0;
  max-width: 80px;
}

.dark-mode .summary-item .amount {
  color: #e0e0e0;
}

.summary-item::after {
  content: ":";
  display: block;
  position: absolute;
  left: 60%;
  transform: translateX(-50%);
  color: #555;
  font-weight: bold;
}

.dark-mode .summary-item::after {
  color: #bbb;
}

.summary-item.profit .amount {
  color: #4CAF50;
}

.summary-item.loss .amount {
  color: #E53935;
}

/* Table Container */
.table-container {
  overflow-x: auto;
  margin-top: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  width: 100%;
  box-sizing: border-box;
}

.dark-mode .table-container {
  background: #2d2d2d;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
}

table {
  width: 100%;
  border-collapse: collapse;
  white-space: nowrap;
}

th,
td {
  border: 1px solid #e0e0e0;
  padding: 10px;
  text-align: left;
  vertical-align: middle;
  font-size: 14px;
}

.dark-mode th,
.dark-mode td {
  border-color: #555;
  color: #e0e0e0;
}

th {
  background: #f0f0f0;
  font-weight: bold;
  color: #333;
}

.dark-mode th {
  background: #3d3d3d;
  color: #e0e0e0;
}

.action-select {
  padding: 5px;
  border-radius: 4px;
  border: 1px solid #ccc;
  background-color: white;
  cursor: pointer;
  font-size: 12px;
}

.dark-mode .action-select {
  background-color: #2d2d2d;
  border-color: #555;
  color: #e0e0e0;
}

.action-select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.no-data-message {
  text-align: center;
  padding: 20px;
}

.loading-cell {
  text-align: center;
  padding: 20px;
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
  border-top: 2px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Create Modal Styles */
.create-modal-overlay {
  display: none;
  position: fixed;
  z-index: 1002;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  justify-content: center;
  align-items: center;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.create-modal-content {
  background-color: #fefefe;
  margin: 20px auto;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  width: 70%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
}

.dark-mode .create-modal-content {
  background-color: #2d2d2d;
  color: #e0e0e0;
}

.create-modal-content h3 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.dark-mode .create-modal-content h3 {
  color: #e0e0e0;
}

.create-modal-content .form-group input[type="text"],
.create-modal-content .form-group input[type="number"],
.create-modal-content .form-group input[type="date"],
.create-modal-content .form-group input[type="email"],
.create-modal-content .form-group input[type="tel"],
.create-modal-content .form-group select {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 0;
  background-color: white;
}

.dark-mode .create-modal-content .form-group input,
.dark-mode .create-modal-content .form-group select {
  background-color: #3d3d3d;
  border-color: #555;
  color: #e0e0e0;
}

.create-modal-buttons {
  display: flex;
  gap: 10px;
  justify-content: space-between;
  margin-top: 20px;
}

.create-modal-buttons button {
  padding: 12px 25px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  flex: 1;
}

.create-modal-buttons .close-btn {
  background: #e53935;
  color: white;
}

.create-modal-buttons .submit-btn {
  background: #4CAF50;
  color: white;
}

.create-modal-buttons .submit-btn:disabled {
  background: #a5d6a7;
  cursor: not-allowed;
}

/* Sales Items Container */
.sales-items-container .product-item {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  background-color: #f9f9f9;
  position: relative;
}

.dark-mode .sales-items-container .product-item {
  background-color: #3d3d3d;
  border-color: #555;
}

.sales-items-container .product-item .remove-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  background: #e53935;
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  cursor: pointer;
  font-size: 12px;
}

.add-product-btn-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.add-product-btn {
  padding: 5px 10px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

/* Download Modal Styles */
.download-modal-overlay {
  display: none;
  position: fixed;
  z-index: 1001;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  justify-content: center;
  align-items: center;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.download-modal-content {
  background-color: #fefefe;
  margin: 20px auto;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  width: 70%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
}

.dark-mode .download-modal-content {
  background-color: #2d2d2d;
  color: #e0e0e0;
}

.download-modal-content h3 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.dark-mode .download-modal-content h3 {
  color: #e0e0e0;
}

.download-modal-content .form-group select,
.download-modal-content .form-group input[type="date"],
.download-modal-content .form-group input[type="number"] {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 0;
  background-color: white;
}

.dark-mode .download-modal-content .form-group input,
.dark-mode .download-modal-content .form-group select {
  background-color: #3d3d3d;
  border-color: #555;
  color: #e0e0e0;
}

.download-modal-buttons {
  display: flex;
  gap: 10px;
  justify-content: space-between;
  margin-top: 20px;
}

.download-modal-buttons button {
  padding: 12px 25px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  flex: 1;
}

.download-modal-buttons .close-btn {
  background: #e53935;
  color: white;
}

.download-modal-buttons .export-btn {
  background: #4CAF50;
  color: white;
}

/* Inline form group */
.inline-form-group {
  display: flex;
  gap: 10px;
  width: 100%;
  margin-bottom: 20px;
}

.inline-form-group > div {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0;
  position: relative;
}

.inline-form-group > div label {
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

.inline-form-group > div.focused label,
.inline-form-group > div.has-value label {
  top: -12px;
  font-size: 12px;
  color: #007bff;
  background: #fefefe;
}

.inline-form-group > div input,
.inline-form-group > div select {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 0;
  background-color: white;
}

.dark-mode .inline-form-group > div input,
.dark-mode .inline-form-group > div select {
  background-color: #3d3d3d;
  border-color: #555;
  color: #e0e0e0;
}

/* Download date range inputs */
.download-date-range-inputs.inline-inputs {
  display: flex;
  flex-direction: row;
  gap: 15px;
  justify-content: space-between;
}

.download-date-range-inputs.inline-inputs > div {
  flex: 1;
  position: relative;
}

.download-date-range-inputs.inline-inputs > div label {
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

.download-date-range-inputs.inline-inputs > div.focused label,
.download-date-range-inputs.inline-inputs > div.has-value label {
  top: -12px;
  font-size: 12px;
  color: #007bff;
  background: #fefefe;
}

.download-date-range-inputs.inline-inputs > div input[type="date"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  box-sizing: border-box;
  margin-bottom: 0;
  background-color: white;
}

.dark-mode .download-date-range-inputs.inline-inputs > div input[type="date"] {
  background-color: #3d3d3d;
  border-color: #555;
  color: #e0e0e0;
}

/* Hide elements by default */
.download-account-group,
.page-orientation-select,
.page-weight-input,
.printer-model-select {
  display: none;
}

/* Print specific styles */
@media print {
  body {
    padding: 0;
    margin: 0;
    -webkit-print-color-adjust: exact;
  }

  .controls-container,
  .summary-panel-container,
  .table-message {
    display: none;
  }

  .table-container {
    margin: 0;
    box-shadow: none;
    overflow-x: visible;
    width: 100%;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    table-layout: auto;
  }

  th,
  td {
    border: 1px solid #000;
    padding: 5px;
    font-size: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  th {
    background-color: #e0e0e0;
    color: #000;
  }

  table th:last-child,
  table td:last-child {
    display: none;
  }

  h2 {
    text-align: center;
    font-size: 18px;
    margin-bottom: 15px;
  }

  @page {
    margin: 1cm;
  }
}

@media (max-width: 768px) {
  .controls-container {
    flex-direction: column;
    align-items: stretch;
  }

  .top-buttons,
  .filter-section {
    flex: 1 1 100%;
    min-width: unset;
    flex-direction: row;
    gap: 10px;
  }

  .filter-section > div {
    flex: 1 1 30%;
    min-width: unset;
  }

  .filter-section button {
    width: 18%;
  }

  .summary-panel-container {
    justify-content: center;
    padding-right: 0;
  }

  .summary-panel {
    width: 90%;
    max-width: unset;
  }

  .summary-item::after {
    left: 55%;
  }

  .create-modal-content {
    width: 70%;
  }

  .inline-form-group {
    flex-direction: column;
    align-items: stretch;
  }

  .inline-form-group .size-input,
  .inline-form-group .type-select {
    flex: 1 1 100%;
  }

  .download-date-range-inputs.inline-inputs {
    flex-direction: column;
    gap: 15px;
  }
}
</style>

