<template>
  <div class="page-container">
    <div class="header">
      <button class="back-btn" @click="goBack">← Back</button>
      <h1>Ad Money</h1>
    </div>
    
    <div class="content">
      <div class="form-section">
        <h2>Add Money</h2>
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="amount">Amount</label>
            <input type="number" id="amount" v-model="form.amount" required>
          </div>
          
          <div class="form-group">
            <label for="method">Payment Method</label>
            <select id="method" v-model="form.method" required>
              <option value="">Select Method</option>
              <option value="bank">Bank Transfer</option>
              <option value="mobile">Mobile Banking</option>
              <option value="cash">Cash</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" v-model="form.description" rows="3"></textarea>
          </div>
          
          <button type="submit" class="submit-btn">Add Money</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Ad Money'
})

const form = ref({
  amount: '',
  method: '',
  description: ''
})

const goBack = () => {
  if (process.client) {
    window.location.href = '/'
  }
}

const handleSubmit = () => {
  alert('Money added successfully!')
  goBack()
}
</script>

<style scoped>
.page-container {
  padding: 20px;
  max-width: 600px;
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

.form-section h2 {
  margin-bottom: 20px;
  color: #333;
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

.submit-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  width: 100%;
}

.submit-btn:hover {
  background: #0056b3;
}
</style>