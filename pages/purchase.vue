<template>
  <div class="page-container">
    <div class="header">
      <button class="back-btn" @click="goBack">← Back</button>
      <h1>Purchase</h1>
      </div>

    <div class="content">
      <div class="purchase-section">
        <h2>Purchase Management</h2>
        
        <div class="add-purchase">
          <h3>Add New Purchase</h3>
          <form @submit.prevent="addPurchase">
            <div class="form-row">
              <div class="form-group">
                <label for="supplier">Supplier</label>
                <select id="supplier" v-model="newPurchase.supplier" required>
                  <option value="">Select Supplier</option>
                  <option value="supplier1">Supplier 1</option>
                  <option value="supplier2">Supplier 2</option>
                </select>
        </div>
              
              <div class="form-group">
                <label for="product">Product</label>
                <input type="text" id="product" v-model="newPurchase.product" required>
      </div>
    </div>

            <div class="form-row">
              <div class="form-group">
                <label for="quantity">Quantity</label>
                <input type="number" id="quantity" v-model="newPurchase.quantity" required>
              </div>
              
              <div class="form-group">
                <label for="price">Price per Unit</label>
                <input type="number" id="price" v-model="newPurchase.price" required>
              </div>
        </div>
            
            <button type="submit" class="add-btn">Add Purchase</button>
          </form>
        </div>
        
        <div class="purchases-list">
          <h3>Purchase History</h3>
          <div v-if="purchases.length === 0" class="no-purchases">
            <p>No purchases recorded yet.</p>
          </div>
          <div v-else class="purchases-grid">
            <div v-for="purchase in purchases" :key="purchase.id" class="purchase-card">
              <h4>{{ purchase.product }}</h4>
              <p><strong>Supplier:</strong> {{ purchase.supplier }}</p>
              <p><strong>Quantity:</strong> {{ purchase.quantity }}</p>
              <p><strong>Price:</strong> {{ formatCurrency(purchase.price) }}</p>
              <p><strong>Total:</strong> {{ formatCurrency(purchase.quantity * purchase.price) }}</p>
              <div class="purchase-actions">
                <button @click="editPurchase(purchase)" class="edit-btn">Edit</button>
                <button @click="deletePurchase(purchase.id)" class="delete-btn">Delete</button>
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
  title: 'Purchase'
})

const newPurchase = ref({
  supplier: '',
  product: '',
  quantity: '',
  price: ''
})

const purchases = ref([
  {
    id: 1,
    supplier: 'Supplier 1',
    product: 'Product A',
    quantity: 10,
    price: 25.00
  },
  {
    id: 2,
    supplier: 'Supplier 2',
    product: 'Product B',
    quantity: 5,
    price: 50.00
  }
])

const goBack = () => {
  if (process.client) {
    window.location.href = '/'
  }
}

const addPurchase = () => {
  const purchase = {
    id: Date.now(),
    ...newPurchase.value,
    quantity: parseFloat(newPurchase.value.quantity),
    price: parseFloat(newPurchase.value.price)
  }
  
  purchases.value.push(purchase)
  
  // Reset form
  newPurchase.value = {
    supplier: '',
    product: '',
    quantity: '',
    price: ''
  }
  
  alert('Purchase added successfully!')
}

const editPurchase = (purchase: any) => {
  alert(`Edit purchase: ${purchase.product}`)
}

const deletePurchase = (id: number) => {
    if (confirm('Are you sure you want to delete this purchase?')) {
    purchases.value = purchases.value.filter(purchase => purchase.id !== id)
      alert('Purchase deleted successfully!')
    }
  }
  
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
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

.purchase-section h2 {
  margin-bottom: 30px;
  color: #333;
  text-align: center;
}

.add-purchase {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.add-purchase h3 {
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
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.add-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
}

.add-btn:hover {
  background: #0056b3;
}

.purchases-list h3 {
  margin-bottom: 20px;
  color: #333;
}

.no-purchases {
  text-align: center;
  padding: 40px;
  color: #666;
}

.purchases-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.purchase-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.purchase-card h4 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 18px;
}

.purchase-card p {
  margin: 5px 0;
  color: #666;
  font-size: 14px;
}

.purchase-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.edit-btn,
.delete-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
}

.edit-btn {
  background: #28a745;
  color: white;
}

.edit-btn:hover {
  background: #218838;
}

.delete-btn {
  background: #dc3545;
  color: white;
}

.delete-btn:hover {
  background: #c82333;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .purchases-grid {
    grid-template-columns: 1fr;
  }
}
</style>