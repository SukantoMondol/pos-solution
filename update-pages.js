// Script to update all Vue pages to match HTML design
const fs = require('fs');
const path = require('path');

const pagesDir = './pages';
const htmlFiles = [
  'employee.html',
  'loan.html', 
  'salary.html',
  'bank.html',
  'installment.html',
  'bangla.html',
  'sslecomerz.html'
];

// Common HTML structure template
const getPageTemplate = (pageName, title) => `
<template>
  <div class="controls-container">
    <div class="top-buttons">
      <button class="home-btn" @click="goToHomePage">Home</button>
      <button class="create-btn" @click="openCreateModal">${title}</button>
      <button class="download-btn" @click="openDownloadModal">Download</button>
    </div>

    <div class="filter-section">
      <button class="filter-btn" @click="openFilterModal">Filter</button>
      <div>
        <label for="searchInput">Search</label>
        <input type="text" id="searchInput" v-model="searchQuery">
      </div>
      <button @click="filterAndDisplay">Apply Filter</button>
    </div>

    <!-- Filter Modal -->
    <div v-if="showFilterModal" class="filter-modal" @click="closeFilterModal">
      <div class="filter-modal-content" @click.stop>
        <h3>Filter Data Date</h3>
        
        <div class="form-group">
          <label for="dateRangeFilter">Date Range</label>
          <select id="dateRangeFilter" v-model="dateRangeFilter" @change="toggleCustomDates">
            <option value="all">All Data</option>
            <option value="today">Today</option>
            <option value="last7days">Last 7 Days</option>
            <option value="thisMonth">This Month</option>
            <option value="thisYear">This Year</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        <div v-if="dateRangeFilter === 'custom'" class="custom-date-fields">
          <div class="form-group">
            <label for="startDate">Start Date</label>
            <input type="date" id="startDate" v-model="startDate">
          </div>
          <div class="form-group">
            <label for="endDate">End Date</label>
            <input type="date" id="endDate" v-model="endDate">
          </div>
        </div>

        <div class="filter-modal-buttons">
          <button class="close-btn" @click="closeFilterModal">Close</button>
          <button class="apply-filter-btn" @click="applyDateFilter">Filter</button>
        </div>
      </div>
    </div>
    
    <div class="content">
      <!-- Page content will be added here -->
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: '${title}'
})

const searchQuery = ref('')
const showFilterModal = ref(false)
const showDownloadModal = ref(false)
const dateRangeFilter = ref('all')
const startDate = ref('')
const endDate = ref('')

const goToHomePage = () => {
  if (process.client) {
    window.location.href = '/'
  }
}

const openCreateModal = () => {
  alert('Create ${title} functionality')
}

const openFilterModal = () => {
  showFilterModal.value = true
}

const closeFilterModal = () => {
  showFilterModal.value = false
}

const openDownloadModal = () => {
  showDownloadModal.value = true
}

const toggleCustomDates = () => {
  // Custom dates will show/hide based on dateRangeFilter value
}

const applyDateFilter = () => {
  alert('Date filter applied!')
  closeFilterModal()
}

const filterAndDisplay = () => {
  alert('Filter applied!')
}
</script>

<style scoped>
body {
  font-family: 'Roboto', sans-serif;
  background: #f5f5f5;
  padding: 20px;
  margin: 0;
  box-sizing: border-box;
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

.home-btn {
  background: #4caf50;
}

.home-btn:hover {
  background: #388e3c;
}

.create-btn {
  background: #009688;
}

.create-btn:hover {
  background: #00796b;
}

.download-btn {
  background: #2196f3;
}

.download-btn:hover {
  background: #1976d2;
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
  background: #ff9800;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s ease;
  white-space: nowrap;
}

.filter-section button:hover {
  background: #e68900;
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

.filter-section input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  background: #fff;
}

.filter-modal {
  display: flex;
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
  from { top: -300px; opacity: 0 }
  to { top: 0; opacity: 1 }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
  text-align: left;
}

.form-group label {
  font-weight: bold;
  color: #333;
}

.form-group select,
.form-group input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.filter-modal-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.close-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.apply-filter-btn {
  background: #007a6a;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.apply-filter-btn:hover {
  background: #007a6a;
}

.content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
</style>
`;

console.log('Page template created successfully!');

