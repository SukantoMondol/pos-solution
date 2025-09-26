<template>
  <div class="products-container" :class="{ 'dark-mode': isDarkMode }">
    <!-- Controls Container -->
    <div class="controls-container">
      <!-- Top Buttons -->
      <div class="top-buttons">
        <NuxtLink to="/" class="home-btn">Home</NuxtLink>
        <button @click="openCreateModal" class="add-btn">Add Product</button>
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
            placeholder="Search products..."
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
          <span class="title">Total Products</span>
          <span class="amount">{{ totalProducts }}</span>
        </div>
        <div class="summary-item">
          <span class="title">Low Stock</span>
          <span class="amount">{{ lowStockCount }}</span>
        </div>
        <div class="summary-item profit">
          <span class="title">Total Value</span>
          <span class="amount">{{ formatCurrency(totalValue) }}</span>
        </div>
      </div>
    </div>

    <!-- Table Container -->
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>SL</th>
            <th>Product Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoading">
            <td :colspan="7" class="loading-cell">
              <div class="loading-spinner">
                <div class="spinner"></div>
                <span>Loading products...</span>
              </div>
            </td>
          </tr>
          <tr v-else-if="filteredProducts.length === 0">
            <td :colspan="7" class="no-data-cell">
              No products found.
            </td>
          </tr>
          <tr v-else v-for="(product, index) in filteredProducts" :key="product.id">
            <td>{{ index + 1 }}</td>
            <td>{{ product.name }}</td>
            <td>{{ product.category }}</td>
            <td>{{ formatCurrency(product.price) }}</td>
            <td :class="{ 'low-stock': product.stock < 10 }">{{ product.stock }}</td>
            <td>
              <span 
                :class="product.stock > 10 ? 'status-in-stock' : 'status-low-stock'"
                class="status-badge"
              >
                {{ product.stock > 10 ? 'In Stock' : 'Low Stock' }}
              </span>
            </td>
            <td>
              <select 
                @change="handleAction($event, product.id)"
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
        <h3>Filter Products</h3>
        <div class="filter-options">
          <div class="filter-group">
            <label>Category:</label>
            <select v-model="filterCategory" class="filter-select">
              <option value="">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Furniture">Furniture</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>
          <div class="filter-group">
            <label>Stock Status:</label>
            <select v-model="filterStock" class="filter-select">
              <option value="">All</option>
              <option value="in-stock">In Stock</option>
              <option value="low-stock">Low Stock</option>
            </select>
          </div>
          <div class="filter-group">
            <label>Price Range:</label>
            <div class="price-range">
              <input v-model="minPrice" type="number" placeholder="Min" class="price-input">
              <span>-</span>
              <input v-model="maxPrice" type="number" placeholder="Max" class="price-input">
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
        <h3>{{ editingProduct ? 'Edit Product' : 'Add New Product' }}</h3>
        <form @submit.prevent="handleSaveProduct" class="product-form">
          <div class="form-group">
            <label>Product Name:</label>
            <input v-model="productForm.name" type="text" required class="form-input">
          </div>
          <div class="form-group">
            <label>Category:</label>
            <select v-model="productForm.category" required class="form-select">
              <option value="">Select Category</option>
              <option value="Electronics">Electronics</option>
              <option value="Furniture">Furniture</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>
          <div class="form-group">
            <label>Price:</label>
            <input v-model="productForm.price" type="number" step="0.01" required class="form-input">
          </div>
          <div class="form-group">
            <label>Stock:</label>
            <input v-model="productForm.stock" type="number" required class="form-input">
          </div>
          <div class="form-group">
            <label>Description:</label>
            <textarea v-model="productForm.description" class="form-textarea"></textarea>
          </div>
          <div class="modal-buttons">
            <button type="button" @click="closeCreateModal" class="cancel-btn">Cancel</button>
            <button type="submit" class="save-btn">Save Product</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Download Modal -->
    <div v-if="showDownloadModal" class="modal-overlay" @click="closeDownloadModal">
      <div class="modal-content" @click.stop>
        <h3>Download Products</h3>
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
  title: 'Products'
})

// Reactive data
const showFilterModal = ref(false)
const showCreateModal = ref(false)
const showDownloadModal = ref(false)
const editingProduct = ref(null)
const searchQuery = ref('')
const isLoading = ref(false)
const isDarkMode = ref(false)

// Filter data
const filterCategory = ref('')
const filterStock = ref('')
const minPrice = ref('')
const maxPrice = ref('')

// Product form
const productForm = ref({
  name: '',
  category: '',
  price: '',
  stock: '',
  description: ''
})

// Mock data for demonstration
const products = ref([
  {
    id: 1,
    name: 'Laptop Computer',
    category: 'Electronics',
    price: 999.99,
    stock: 15,
    description: 'High-performance laptop'
  },
  {
    id: 2,
    name: 'Office Chair',
    category: 'Furniture',
    price: 199.99,
    stock: 8,
    description: 'Ergonomic office chair'
  },
  {
    id: 3,
    name: 'Wireless Mouse',
    category: 'Electronics',
    price: 29.99,
    stock: 3,
    description: 'Bluetooth wireless mouse'
  },
  {
    id: 4,
    name: 'Desk Lamp',
    category: 'Furniture',
    price: 49.99,
    stock: 25,
    description: 'LED desk lamp'
  },
  {
    id: 5,
    name: 'Keyboard',
    category: 'Electronics',
    price: 79.99,
    stock: 12,
    description: 'Mechanical keyboard'
  }
])

// Computed
const filteredProducts = computed(() => {
  let filtered = products.value

  // Search filter
  if (searchQuery.value) {
    filtered = filtered.filter(product => 
    product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
  }

  // Category filter
  if (filterCategory.value) {
    filtered = filtered.filter(product => product.category === filterCategory.value)
  }

  // Stock filter
  if (filterStock.value === 'in-stock') {
    filtered = filtered.filter(product => product.stock > 10)
  } else if (filterStock.value === 'low-stock') {
    filtered = filtered.filter(product => product.stock <= 10)
  }

  // Price range filter
  if (minPrice.value) {
    filtered = filtered.filter(product => product.price >= parseFloat(minPrice.value))
  }
  if (maxPrice.value) {
    filtered = filtered.filter(product => product.price <= parseFloat(maxPrice.value))
  }

  return filtered
})

const totalProducts = computed(() => products.value.length)

const lowStockCount = computed(() => {
  return products.value.filter(product => product.stock < 10).length
})

const totalValue = computed(() => {
  return products.value.reduce((sum, product) => sum + (product.price * product.stock), 0)
})

// Methods
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
  editingProduct.value = null
  productForm.value = {
    name: '',
    category: '',
    price: '',
    stock: '',
    description: ''
  }
  showCreateModal.value = true
}

const closeCreateModal = () => {
  showCreateModal.value = false
  editingProduct.value = null
  productForm.value = {
    name: '',
    category: '',
    price: '',
    stock: '',
    description: ''
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

const handleAction = async (event: Event, productId: number) => {
  const target = event.target as HTMLSelectElement
  const action = target.value
  
  if (action === 'view') {
    alert(`Viewing product ${productId}`)
  } else if (action === 'edit') {
    const product = products.value.find(p => p.id === productId)
    if (product) {
      editingProduct.value = product
      productForm.value = {
        name: product.name,
        category: product.category,
        price: product.price.toString(),
        stock: product.stock.toString(),
        description: product.description
      }
      showCreateModal.value = true
    }
  } else if (action === 'delete') {
    if (confirm('Are you sure you want to delete this product?')) {
      products.value = products.value.filter(p => p.id !== productId)
      alert('Product deleted successfully!')
    }
  }
  
  // Reset select value
  target.value = ''
}

const handleSaveProduct = async () => {
  try {
    const productData = {
      name: productForm.value.name,
      category: productForm.value.category,
      price: parseFloat(productForm.value.price),
      stock: parseInt(productForm.value.stock),
      description: productForm.value.description
    }

    if (editingProduct.value) {
      // Update existing product
      const index = products.value.findIndex(p => p.id === editingProduct.value.id)
      if (index !== -1) {
        products.value[index] = { ...editingProduct.value, ...productData }
        alert('Product updated successfully!')
      }
    } else {
      // Add new product
      const newProduct = {
        id: Math.max(...products.value.map(p => p.id)) + 1,
        ...productData
      }
      products.value.push(newProduct)
      alert('Product added successfully!')
    }
    
    closeCreateModal()
  } catch (error) {
    console.error('Error saving product:', error)
    alert('Error saving product. Please try again.')
  }
}

const downloadCSV = () => {
  const csvContent = [
    ['Name', 'Category', 'Price', 'Stock', 'Description'],
    ...filteredProducts.value.map(product => [
      product.name,
      product.category,
      product.price,
      product.stock,
      product.description
    ])
  ].map(row => row.join(',')).join('\n')
  
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'products.csv'
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
.products-container {
  font-family: 'Roboto', sans-serif;
  background: #f5f5f5;
  padding: 10px;
  margin: 0;
  box-sizing: border-box;
  transition: background-color 0.3s, color 0.3s;
}

.products-container.dark-mode {
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

.products-container.dark-mode .controls-container {
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

.products-container.dark-mode .summary-panel {
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

.products-container.dark-mode .summary-item {
  background: #2a2a2a;
}

.summary-item.profit {
  background: #e8f5e8;
}

.products-container.dark-mode .summary-item.profit {
  background: #1b5e20;
}

.summary-item .title {
  display: block;
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.products-container.dark-mode .summary-item .title {
  color: #ccc;
}

.summary-item .amount {
  display: block;
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.products-container.dark-mode .summary-item .amount {
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

.products-container.dark-mode .table-container {
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

.products-container.dark-mode .table-container th {
  background: #2a2a2a;
  color: #e0e0e0;
  border-bottom-color: #444;
}

.table-container td {
  padding: 15px 10px;
  border-bottom: 1px solid #dee2e6;
  transition: border-color 0.3s;
}

.products-container.dark-mode .table-container td {
  border-bottom-color: #444;
}

.table-container tr:hover {
  background: #f8f9fa;
}

.products-container.dark-mode .table-container tr:hover {
  background: #2a2a2a;
}

.low-stock {
  color: #dc3545;
  font-weight: bold;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-in-stock {
  background: #d4edda;
  color: #155724;
}

.status-low-stock {
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

.products-container.dark-mode .modal-content {
  background: #1e1e1e;
  color: #e0e0e0;
}

.modal-content h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
}

.products-container.dark-mode .modal-content h3 {
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

.products-container.dark-mode .filter-group label {
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

.price-range {
  display: flex;
  align-items: center;
  gap: 10px;
}

.price-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.price-input:focus {
  outline: none;
  border-color: #2196f3;
}

.product-form {
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

.products-container.dark-mode .form-group label {
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

