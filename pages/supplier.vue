<template>
  <div class="page-container">
    <div class="header">
      <button class="back-btn" @click="goBack">← Back</button>
      <h1>Supplier Management</h1>
    </div>
    
    <div class="content">
      <div class="supplier-section">
        <h2>Suppliers</h2>
        
        <div class="add-supplier">
          <h3>Add New Supplier</h3>
          <form @submit.prevent="addSupplier">
            <div class="form-row">
              <div class="form-group">
                <label for="name">Supplier Name</label>
                <input type="text" id="name" v-model="newSupplier.name" required>
              </div>
              
              <div class="form-group">
                <label for="contact">Contact Person</label>
                <input type="text" id="contact" v-model="newSupplier.contact" required>
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" v-model="newSupplier.email" required>
              </div>
              
              <div class="form-group">
                <label for="phone">Phone</label>
                <input type="tel" id="phone" v-model="newSupplier.phone" required>
              </div>
            </div>
            
            <div class="form-group">
              <label for="address">Address</label>
              <textarea id="address" v-model="newSupplier.address" rows="3"></textarea>
            </div>
            
            <button type="submit" class="add-btn">Add Supplier</button>
          </form>
        </div>
        
        <div class="suppliers-list">
          <h3>Supplier List</h3>
          <div v-if="suppliers.length === 0" class="no-suppliers">
            <p>No suppliers added yet.</p>
          </div>
          <div v-else class="suppliers-grid">
            <div v-for="supplier in suppliers" :key="supplier.id" class="supplier-card">
              <h4>{{ supplier.name }}</h4>
              <p><strong>Contact:</strong> {{ supplier.contact }}</p>
              <p><strong>Email:</strong> {{ supplier.email }}</p>
              <p><strong>Phone:</strong> {{ supplier.phone }}</p>
              <p><strong>Address:</strong> {{ supplier.address }}</p>
              <div class="supplier-actions">
                <button @click="editSupplier(supplier)" class="edit-btn">Edit</button>
                <button @click="deleteSupplier(supplier.id)" class="delete-btn">Delete</button>
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
  title: 'Supplier Management'
})

const newSupplier = ref({
  name: '',
  contact: '',
  email: '',
  phone: '',
  address: ''
})

const suppliers = ref([
  {
    id: 1,
    name: 'ABC Electronics',
    contact: 'John Smith',
    email: 'john@abcelectronics.com',
    phone: '+1 234 567 8900',
    address: '123 Tech Street, Silicon Valley, CA 94000'
  },
  {
    id: 2,
    name: 'XYZ Supplies',
    contact: 'Jane Doe',
    email: 'jane@xyzsupplies.com',
    phone: '+1 234 567 8901',
    address: '456 Supply Ave, New York, NY 10001'
  }
])

const goBack = () => {
  if (process.client) {
    window.location.href = '/'
  }
}

const addSupplier = () => {
  const supplier = {
    id: Date.now(),
    ...newSupplier.value
  }
  
  suppliers.value.push(supplier)
  
  // Reset form
  newSupplier.value = {
    name: '',
    contact: '',
    email: '',
    phone: '',
    address: ''
  }
  
  alert('Supplier added successfully!')
}

const editSupplier = (supplier: any) => {
  alert(`Edit supplier: ${supplier.name}`)
}

const deleteSupplier = (id: number) => {
  if (confirm('Are you sure you want to delete this supplier?')) {
    suppliers.value = suppliers.value.filter(supplier => supplier.id !== id)
    alert('Supplier deleted successfully!')
  }
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

.supplier-section h2 {
  margin-bottom: 30px;
  color: #333;
  text-align: center;
}

.add-supplier {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.add-supplier h3 {
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
.form-group textarea {
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

.suppliers-list h3 {
  margin-bottom: 20px;
  color: #333;
}

.no-suppliers {
  text-align: center;
  padding: 40px;
  color: #666;
}

.suppliers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.supplier-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.supplier-card h4 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 18px;
}

.supplier-card p {
  margin: 5px 0;
  color: #666;
  font-size: 14px;
}

.supplier-actions {
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
  
  .suppliers-grid {
    grid-template-columns: 1fr;
  }
}
</style>

