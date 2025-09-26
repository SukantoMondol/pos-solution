<template>
  <div class="page-container">
    <div class="header">
      <button class="back-btn" @click="goBack">← Back</button>
      <h1>App Details</h1>
    </div>
    
    <div class="content">
      <div class="details-section">
        <h2>Application Information</h2>
        
        <div class="app-info">
          <div class="info-card">
            <h3>Version Information</h3>
            <div class="info-item">
              <span class="label">App Version:</span>
              <span class="value">1.0.0</span>
            </div>
            <div class="info-item">
              <span class="label">Build Date:</span>
              <span class="value">January 26, 2024</span>
            </div>
            <div class="info-item">
              <span class="label">Framework:</span>
              <span class="value">Nuxt.js 3.17.5</span>
            </div>
          </div>
          
          <div class="info-card">
            <h3>System Information</h3>
            <div class="info-item">
              <span class="label">Platform:</span>
              <span class="value">Web Application</span>
            </div>
            <div class="info-item">
              <span class="label">Browser:</span>
              <span class="value">Chrome, Firefox, Safari</span>
            </div>
            <div class="info-item">
              <span class="label">Database:</span>
              <span class="value">Local Storage</span>
            </div>
          </div>
          
          <div class="info-card">
            <h3>Features</h3>
            <ul class="features-list">
              <li>Point of Sale Management</li>
              <li>Inventory Tracking</li>
              <li>Customer Management</li>
              <li>Sales Reporting</li>
              <li>Payment Processing</li>
              <li>Multi-currency Support</li>
            </ul>
          </div>
        </div>
        
        <div class="contact-info">
          <h3>Support & Contact</h3>
          <div class="contact-details">
            <div class="contact-item">
              <strong>Email:</strong> support@possolution.com
            </div>
            <div class="contact-item">
              <strong>Phone:</strong> +1 (555) 123-4567
            </div>
            <div class="contact-item">
              <strong>Website:</strong> www.possolution.com
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'App Details'
})

const goBack = () => {
  if (process.client) {
    window.location.href = '/'
  }
}
</script>

<style scoped>
.page-container {
  padding: 20px;
  max-width: 800px;
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

.details-section h2 {
  margin-bottom: 30px;
  color: #333;
  text-align: center;
}

.app-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.info-card {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.info-card h3 {
  margin: 0 0 15px 0;
  color: #333;
}

.info-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.label {
  font-weight: bold;
  color: #666;
}

.value {
  color: #333;
}

.features-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.features-list li {
  padding: 5px 0;
  color: #333;
  position: relative;
  padding-left: 20px;
}

.features-list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #28a745;
  font-weight: bold;
}

.contact-info {
  background: #e3f2fd;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #007bff;
}

.contact-info h3 {
  margin: 0 0 15px 0;
  color: #333;
}

.contact-details {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.contact-item {
  color: #333;
}
</style>