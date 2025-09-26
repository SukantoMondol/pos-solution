<template>
  <div class="page-container">
    <div class="header">
      <button class="back-btn" @click="goBack">← Back</button>
      <h1>Expense Management</h1>
    </div>
    
    <div class="content">
      <div class="expense-section">
        <h2>Expense Tracking</h2>
        
        <div class="add-expense">
          <h3>Add New Expense</h3>
          <form @submit.prevent="addExpense">
            <div class="form-row">
              <div class="form-group">
                <label for="category">Category</label>
                <select id="category" v-model="newExpense.category" required>
                  <option value="">Select Category</option>
                  <option value="office">Office Supplies</option>
                  <option value="utilities">Utilities</option>
                  <option value="travel">Travel</option>
                  <option value="marketing">Marketing</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="amount">Amount</label>
                <input type="number" id="amount" v-model="newExpense.amount" step="0.01" required>
              </div>
            </div>
            
            <div class="form-group">
              <label for="description">Description</label>
              <input type="text" id="description" v-model="newExpense.description" required>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="date">Date</label>
                <input type="date" id="date" v-model="newExpense.date" required>
              </div>
              
              <div class="form-group">
                <label for="paymentMethod">Payment Method</label>
                <select id="paymentMethod" v-model="newExpense.paymentMethod" required>
                  <option value="">Select Method</option>
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="check">Check</option>
                </select>
              </div>
            </div>
            
            <button type="submit" class="add-btn">Add Expense</button>
          </form>
        </div>
        
        <div class="expense-summary">
          <h3>Expense Summary</h3>
          <div class="summary-cards">
            <div class="summary-card">
              <h4>Total This Month</h4>
              <p class="amount">{{ formatCurrency(monthlyTotal) }}</p>
            </div>
            <div class="summary-card">
              <h4>This Week</h4>
              <p class="amount">{{ formatCurrency(weeklyTotal) }}</p>
            </div>
            <div class="summary-card">
              <h4>Today</h4>
              <p class="amount">{{ formatCurrency(dailyTotal) }}</p>
            </div>
          </div>
        </div>
        
        <div class="expenses-list">
          <h3>Recent Expenses</h3>
          <div v-if="expenses.length === 0" class="no-expenses">
            <p>No expenses recorded yet.</p>
          </div>
          <div v-else class="expenses-grid">
            <div v-for="expense in expenses" :key="expense.id" class="expense-card">
              <div class="expense-header">
                <h4>{{ expense.description }}</h4>
                <span class="amount">{{ formatCurrency(expense.amount) }}</span>
              </div>
              <div class="expense-details">
                <p><strong>Category:</strong> {{ expense.category }}</p>
                <p><strong>Date:</strong> {{ formatDate(expense.date) }}</p>
                <p><strong>Method:</strong> {{ expense.paymentMethod }}</p>
              </div>
              <div class="expense-actions">
                <button @click="editExpense(expense)" class="edit-btn">Edit</button>
                <button @click="deleteExpense(expense.id)" class="delete-btn">Delete</button>
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
  title: 'Expense Management'
})

const newExpense = ref({
  category: '',
  amount: '',
  description: '',
  date: new Date().toISOString().split('T')[0],
  paymentMethod: ''
})

const expenses = ref([
  {
    id: 1,
    category: 'Office Supplies',
    amount: 150.00,
    description: 'Printer paper and ink',
    date: new Date('2024-01-20'),
    paymentMethod: 'Card'
  },
  {
    id: 2,
    category: 'Utilities',
    amount: 300.00,
    description: 'Electricity bill',
    date: new Date('2024-01-18'),
    paymentMethod: 'Bank Transfer'
  },
  {
    id: 3,
    category: 'Marketing',
    amount: 500.00,
    description: 'Social media advertising',
    date: new Date('2024-01-15'),
    paymentMethod: 'Card'
  }
])

const monthlyTotal = computed(() => {
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  
  return expenses.value
    .filter(expense => {
      const expenseDate = new Date(expense.date)
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear
    })
    .reduce((total, expense) => total + expense.amount, 0)
})

const weeklyTotal = computed(() => {
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  
  return expenses.value
    .filter(expense => new Date(expense.date) >= oneWeekAgo)
    .reduce((total, expense) => total + expense.amount, 0)
})

const dailyTotal = computed(() => {
  const today = new Date().toDateString()
  
  return expenses.value
    .filter(expense => new Date(expense.date).toDateString() === today)
    .reduce((total, expense) => total + expense.amount, 0)
})

const goBack = () => {
  if (process.client) {
    window.location.href = '/'
  }
}

const addExpense = () => {
  const expense = {
    id: Date.now(),
    ...newExpense.value,
    amount: parseFloat(newExpense.value.amount),
    date: new Date(newExpense.value.date)
  }
  
  expenses.value.unshift(expense)
  
  // Reset form
  newExpense.value = {
    category: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: ''
  }
  
  alert('Expense added successfully!')
}

const editExpense = (expense: any) => {
  alert(`Edit expense: ${expense.description}`)
}

const deleteExpense = (id: number) => {
  if (confirm('Are you sure you want to delete this expense?')) {
    expenses.value = expenses.value.filter(expense => expense.id !== id)
    alert('Expense deleted successfully!')
  }
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
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

.expense-section h2 {
  margin-bottom: 30px;
  color: #333;
  text-align: center;
}

.add-expense {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.add-expense h3 {
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
  background: #28a745;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
}

.add-btn:hover {
  background: #218838;
}

.expense-summary h3 {
  margin-bottom: 20px;
  color: #333;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.summary-card {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  border: 1px solid #ddd;
}

.summary-card h4 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 16px;
}

.amount {
  font-size: 24px;
  font-weight: bold;
  color: #dc3545;
  margin: 0;
}

.expenses-list h3 {
  margin-bottom: 20px;
  color: #333;
}

.no-expenses {
  text-align: center;
  padding: 40px;
  color: #666;
}

.expenses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.expense-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.expense-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.expense-header h4 {
  margin: 0;
  color: #333;
  font-size: 16px;
}

.expense-details p {
  margin: 5px 0;
  color: #666;
  font-size: 14px;
}

.expense-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.edit-btn,
.delete-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
}

.edit-btn {
  background: #007bff;
  color: white;
}

.edit-btn:hover {
  background: #0056b3;
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
  
  .summary-cards {
    grid-template-columns: 1fr;
  }
  
  .expenses-grid {
    grid-template-columns: 1fr;
  }
}
</style>