<template>
  <div class="page-container">
    <div class="header">
      <button class="back-btn" @click="goBack">← Back</button>
      <h1>Accounts</h1>
      </div>

    <div class="content">
      <div class="accounts-section">
        <h2>Bank Accounts</h2>
        
        <div class="add-account">
          <h3>Add New Account</h3>
          <form @submit.prevent="addAccount">
            <div class="form-row">
              <div class="form-group">
                <label for="bankName">Bank Name</label>
                <input type="text" id="bankName" v-model="newAccount.bankName" required>
        </div>
              
              <div class="form-group">
                <label for="accountType">Account Type</label>
                <select id="accountType" v-model="newAccount.accountType" required>
                  <option value="">Select Type</option>
                  <option value="savings">Savings</option>
                  <option value="current">Current</option>
                  <option value="business">Business</option>
                </select>
      </div>
    </div>

            <div class="form-row">
              <div class="form-group">
                <label for="accountNumber">Account Number</label>
                <input type="text" id="accountNumber" v-model="newAccount.accountNumber" required>
              </div>
              
              <div class="form-group">
                <label for="initialBalance">Initial Balance</label>
                <input type="number" id="initialBalance" v-model="newAccount.initialBalance" required>
              </div>
        </div>
            
            <button type="submit" class="add-btn">Add Account</button>
          </form>
        </div>
        
        <div class="accounts-list">
          <h3>Account List</h3>
          <div v-if="accounts.length === 0" class="no-accounts">
            <p>No accounts added yet.</p>
          </div>
          <div v-else class="accounts-grid">
            <div v-for="account in accounts" :key="account.id" class="account-card">
              <h4>{{ account.bankName }}</h4>
              <p><strong>Type:</strong> {{ account.accountType }}</p>
              <p><strong>Number:</strong> {{ account.accountNumber }}</p>
              <p><strong>Balance:</strong> {{ formatCurrency(account.initialBalance) }}</p>
              <div class="account-actions">
                <button @click="editAccount(account)" class="edit-btn">Edit</button>
                <button @click="deleteAccount(account.id)" class="delete-btn">Delete</button>
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
  title: 'Accounts'
})

const newAccount = ref({
  bankName: '',
  accountType: '',
  accountNumber: '',
  initialBalance: ''
})

const accounts = ref([
  {
    id: 1,
    bankName: 'DBBL',
    accountType: 'Savings',
    accountNumber: '123456789',
    initialBalance: 15000
  },
  {
    id: 2,
    bankName: 'EBL',
    accountType: 'Current',
    accountNumber: '987654321',
    initialBalance: 25000
  }
])

const goBack = () => {
  if (process.client) {
    window.location.href = '/'
  }
}

const addAccount = () => {
  const account = {
    id: Date.now(),
    ...newAccount.value,
    initialBalance: parseFloat(newAccount.value.initialBalance)
  }
  
  accounts.value.push(account)
  
  // Reset form
  newAccount.value = {
    bankName: '',
    accountType: '',
    accountNumber: '',
    initialBalance: ''
  }
  
  alert('Account added successfully!')
}

const editAccount = (account: any) => {
  alert(`Edit account: ${account.bankName}`)
}

const deleteAccount = (id: number) => {
    if (confirm('Are you sure you want to delete this account?')) {
    accounts.value = accounts.value.filter(account => account.id !== id)
        alert('Account deleted successfully!')
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

.accounts-section h2 {
  margin-bottom: 30px;
  color: #333;
  text-align: center;
}

.add-account {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.add-account h3 {
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

.accounts-list h3 {
  margin-bottom: 20px;
  color: #333;
}

.no-accounts {
  text-align: center;
  padding: 40px;
  color: #666;
}

.accounts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.account-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.account-card h4 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 18px;
}

.account-card p {
  margin: 5px 0;
  color: #666;
  font-size: 14px;
}

.account-actions {
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
  
  .accounts-grid {
    grid-template-columns: 1fr;
  }
}
</style>