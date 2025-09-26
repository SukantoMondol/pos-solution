<template>
  <div class="page-container">
    <div class="header">
      <button class="back-btn" @click="goBack">← Back</button>
      <h1>Return Management</h1>
    </div>
    
    <div class="content">
      <div class="return-section">
        <h2>Product Returns</h2>
        
        <div class="add-return">
          <h3>Process Return</h3>
          <form @submit.prevent="processReturn">
            <div class="form-row">
              <div class="form-group">
                <label for="orderNumber">Order Number</label>
                <input type="text" id="orderNumber" v-model="newReturn.orderNumber" required>
              </div>
              
              <div class="form-group">
                <label for="product">Product</label>
                <input type="text" id="product" v-model="newReturn.product" required>
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="quantity">Quantity</label>
                <input type="number" id="quantity" v-model="newReturn.quantity" required>
              </div>
              
              <div class="form-group">
                <label for="reason">Return Reason</label>
                <select id="reason" v-model="newReturn.reason" required>
                  <option value="">Select Reason</option>
                  <option value="defective">Defective Product</option>
                  <option value="wrong-item">Wrong Item</option>
                  <option value="damaged">Damaged in Shipping</option>
                  <option value="not-satisfied">Not Satisfied</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            
            <div class="form-group">
              <label for="description">Description</label>
              <textarea id="description" v-model="newReturn.description" rows="3"></textarea>
            </div>
            
            <button type="submit" class="process-btn">Process Return</button>
          </form>
        </div>
        
        <div class="returns-list">
          <h3>Recent Returns</h3>
          <div v-if="returns.length === 0" class="no-returns">
            <p>No returns processed yet.</p>
          </div>
          <div v-else class="returns-grid">
            <div v-for="returnItem in returns" :key="returnItem.id" class="return-card">
              <div class="return-header">
                <h4>Order #{{ returnItem.orderNumber }}</h4>
                <span class="status" :class="returnItem.status">{{ returnItem.status }}</span>
              </div>
              <div class="return-details">
                <p><strong>Product:</strong> {{ returnItem.product }}</p>
                <p><strong>Quantity:</strong> {{ returnItem.quantity }}</p>
                <p><strong>Reason:</strong> {{ returnItem.reason }}</p>
                <p><strong>Date:</strong> {{ formatDate(returnItem.date) }}</p>
              </div>
              <div class="return-actions">
                <button @click="viewReturn(returnItem)" class="view-btn">View</button>
                <button @click="updateStatus(returnItem)" class="update-btn">Update</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Return Management'
})

const newReturn = ref({
  orderNumber: '',
  product: '',
  quantity: '',
  reason: '',
  description: ''
})

const returns = ref([
  {
    id: 1,
    orderNumber: 'ORD-001',
    product: 'Laptop Computer',
    quantity: 1,
    reason: 'Defective Product',
    description: 'Screen flickering issue',
    status: 'pending',
    date: new Date('2024-01-20')
  },
  {
    id: 2,
    orderNumber: 'ORD-002',
    product: 'Wireless Mouse',
    quantity: 2,
    reason: 'Wrong Item',
    description: 'Ordered black, received white',
    status: 'approved',
    date: new Date('2024-01-18')
  }
])

const goBack = () => {
  if (process.client) {
    window.location.href = '/'
  }
}

const processReturn = () => {
  const returnItem = {
    id: Date.now(),
    ...newReturn.value,
    quantity: parseInt(newReturn.value.quantity),
    status: 'pending',
    date: new Date()
  }
  
  returns.value.unshift(returnItem)
  
  // Reset form
  newReturn.value = {
    orderNumber: '',
    product: '',
    quantity: '',
    reason: '',
    description: ''
  }
  
  alert('Return processed successfully!')
}

const viewReturn = (returnItem: any) => {
  alert(`View return details for Order #${returnItem.orderNumber}`)
}

const updateStatus = (returnItem: any) => {
  alert(`Update status for Order #${returnItem.orderNumber}`)
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
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
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
  margin-right: 15px;
}

.content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.return-section h2 {
  margin-bottom: 30px;
  color: #333;
  text-align: center;
}

.add-return {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.add-return h3 {
  margin-bottom: 20px;
  color: #333;
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

.process-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
}

.process-btn:hover {
  background: #c82333;
}

.returns-list h3 {
  margin-bottom: 20px;
  color: #333;
}

.no-returns {
  text-align: center;
  padding: 40px;
  color: #666;
}

.returns-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.return-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.return-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.return-header h4 {
  margin: 0;
  color: #333;
  font-size: 16px;
}

.status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
}

.status.pending {
  background: #fff3cd;
  color: #856404;
}

.status.approved {
  background: #d4edda;
  color: #155724;
}

.status.rejected {
  background: #f8d7da;
  color: #721c24;
}

.return-details p {
  margin: 5px 0;
  color: #666;
  font-size: 14px;
}

.return-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.view-btn,
.update-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
}

.view-btn {
  background: #17a2b8;
  color: white;
}

.view-btn:hover {
  background: #138496;
}

.update-btn {
  background: #ffc107;
  color: #212529;
}

.update-btn:hover {
  background: #e0a800;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .returns-grid {
    grid-template-columns: 1fr;
  }
}
</style>