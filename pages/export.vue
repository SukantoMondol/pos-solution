<template>
  <div class="page-container">
    <div class="header">
      <button class="back-btn" @click="goBack">← Back</button>
      <h1>Export Data</h1>
    </div>
    
    <div class="content">
      <div class="export-section">
        <h2>Export Your Data</h2>
        
        <div class="export-options">
          <div class="export-card">
            <div class="export-icon">📊</div>
            <h3>Sales Report</h3>
            <p>Export sales data and analytics</p>
            <div class="export-formats">
              <button @click="exportData('sales', 'csv')" class="format-btn">CSV</button>
              <button @click="exportData('sales', 'pdf')" class="format-btn">PDF</button>
              <button @click="exportData('sales', 'excel')" class="format-btn">Excel</button>
            </div>
          </div>
          
          <div class="export-card">
            <div class="export-icon">📦</div>
            <h3>Inventory Report</h3>
            <p>Export product and stock information</p>
            <div class="export-formats">
              <button @click="exportData('inventory', 'csv')" class="format-btn">CSV</button>
              <button @click="exportData('inventory', 'pdf')" class="format-btn">PDF</button>
              <button @click="exportData('inventory', 'excel')" class="format-btn">Excel</button>
            </div>
          </div>
          
          <div class="export-card">
            <div class="export-icon">👥</div>
            <h3>Customer Report</h3>
            <p>Export customer information and history</p>
            <div class="export-formats">
              <button @click="exportData('customers', 'csv')" class="format-btn">CSV</button>
              <button @click="exportData('customers', 'pdf')" class="format-btn">PDF</button>
              <button @click="exportData('customers', 'excel')" class="format-btn">Excel</button>
            </div>
          </div>
          
          <div class="export-card">
            <div class="export-icon">💰</div>
            <h3>Financial Report</h3>
            <p>Export financial data and transactions</p>
            <div class="export-formats">
              <button @click="exportData('financial', 'csv')" class="format-btn">CSV</button>
              <button @click="exportData('financial', 'pdf')" class="format-btn">PDF</button>
              <button @click="exportData('financial', 'excel')" class="format-btn">Excel</button>
            </div>
          </div>
        </div>
        
        <div class="export-settings">
          <h3>Export Settings</h3>
          <form @submit.prevent="updateSettings">
            <div class="form-row">
              <div class="form-group">
                <label for="dateRange">Date Range</label>
                <select id="dateRange" v-model="settings.dateRange">
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="quarter">This Quarter</option>
                  <option value="year">This Year</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="includeImages">Include Images</label>
                <input type="checkbox" id="includeImages" v-model="settings.includeImages">
              </div>
            </div>
            
            <div v-if="settings.dateRange === 'custom'" class="custom-date-range">
              <div class="form-row">
                <div class="form-group">
                  <label for="startDate">Start Date</label>
                  <input type="date" id="startDate" v-model="settings.startDate">
                </div>
                <div class="form-group">
                  <label for="endDate">End Date</label>
                  <input type="date" id="endDate" v-model="settings.endDate">
                </div>
              </div>
            </div>
            
            <button type="submit" class="save-settings-btn">Save Settings</button>
          </form>
        </div>
        
        <div class="export-history">
          <h3>Recent Exports</h3>
          <div v-if="exportHistory.length === 0" class="no-exports">
            <p>No exports found.</p>
          </div>
          <div v-else class="history-list">
            <div v-for="exportItem in exportHistory" :key="exportItem.id" class="history-item">
              <div class="export-info">
                <h4>{{ exportItem.name }}</h4>
                <p class="format">{{ exportItem.format.toUpperCase() }}</p>
                <p class="date">{{ formatDate(exportItem.date) }}</p>
              </div>
              <div class="export-actions">
                <button @click="downloadExport(exportItem)" class="download-btn">Download</button>
                <button @click="deleteExport(exportItem.id)" class="delete-btn">Delete</button>
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
  title: 'Export Data'
})

const settings = ref({
  dateRange: 'month',
  includeImages: false,
  startDate: '',
  endDate: ''
})

const exportHistory = ref([
  {
    id: 1,
    name: 'Sales Report - January 2024',
    format: 'pdf',
    date: new Date('2024-01-20')
  },
  {
    id: 2,
    name: 'Inventory Report - January 2024',
    format: 'excel',
    date: new Date('2024-01-18')
  }
])

const goBack = () => {
  if (process.client) {
    window.location.href = '/'
  }
}

const exportData = (type: string, format: string) => {
  const exportName = `${type.charAt(0).toUpperCase() + type.slice(1)} Report - ${new Date().toLocaleDateString()}`
  
  // Add to history
  exportHistory.value.unshift({
    id: Date.now(),
    name: exportName,
    format: format,
    date: new Date()
  })
  
  alert(`${type.charAt(0).toUpperCase() + type.slice(1)} data exported as ${format.toUpperCase()} successfully!`)
}

const updateSettings = () => {
  alert('Export settings saved successfully!')
}

const downloadExport = (exportItem: any) => {
  alert(`Downloading ${exportItem.name}`)
}

const deleteExport = (id: number) => {
  if (confirm('Are you sure you want to delete this export?')) {
    exportHistory.value = exportHistory.value.filter(item => item.id !== id)
    alert('Export deleted successfully!')
  }
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

.export-section h2 {
  margin-bottom: 30px;
  color: #333;
  text-align: center;
}

.export-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.export-card {
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
}

.export-card:hover {
  border-color: #007bff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.export-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.export-card h3 {
  margin: 0 0 10px 0;
  color: #333;
}

.export-card p {
  margin: 0 0 20px 0;
  color: #666;
}

.export-formats {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.format-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
}

.format-btn:hover {
  background: #0056b3;
}

.export-settings {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.export-settings h3 {
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

.custom-date-range {
  margin-top: 20px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.save-settings-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
}

.save-settings-btn:hover {
  background: #218838;
}

.export-history h3 {
  margin-bottom: 20px;
  color: #333;
}

.no-exports {
  text-align: center;
  padding: 40px;
  color: #666;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.export-info h4 {
  margin: 0 0 5px 0;
  color: #333;
}

.format {
  color: #007bff;
  font-weight: bold;
  margin: 5px 0;
}

.date {
  color: #666;
  font-size: 14px;
  margin: 5px 0;
}

.export-actions {
  display: flex;
  gap: 10px;
}

.download-btn,
.delete-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
}

.download-btn {
  background: #17a2b8;
  color: white;
}

.download-btn:hover {
  background: #138496;
}

.delete-btn {
  background: #dc3545;
  color: white;
}

.delete-btn:hover {
  background: #c82333;
}

@media (max-width: 768px) {
  .export-options {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .export-formats {
    flex-direction: column;
  }
  
  .history-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
}
</style>

