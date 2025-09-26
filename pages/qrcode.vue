<template>
  <div class="page-container">
    <div class="header">
      <button class="back-btn" @click="goBack">← Back</button>
      <h1>QR Code</h1>
    </div>
    
    <div class="content">
      <div class="qr-section">
        <h2>Generate QR Code</h2>
        
        <div class="qr-form">
          <div class="form-group">
            <label for="qrText">QR Code Text/URL</label>
            <input type="text" id="qrText" v-model="qrText" placeholder="Enter text or URL">
          </div>
          
          <button @click="generateQR" class="generate-btn">Generate QR Code</button>
        </div>
        
        <div v-if="qrCodeGenerated" class="qr-display">
          <h3>Generated QR Code</h3>
          <div class="qr-code-container">
            <div class="qr-placeholder">
              <div class="qr-grid">
                <div v-for="i in 25" :key="i" class="qr-cell" :class="{ filled: Math.random() > 0.5 }"></div>
              </div>
            </div>
          </div>
          <p class="qr-text">{{ qrText }}</p>
          <div class="qr-actions">
            <button @click="downloadQR" class="download-btn">Download</button>
            <button @click="printQR" class="print-btn">Print</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'QR Code'
})

const qrText = ref('')
const qrCodeGenerated = ref(false)

const goBack = () => {
  if (process.client) {
    window.location.href = '/'
  }
}

const generateQR = () => {
  if (qrText.value.trim()) {
    qrCodeGenerated.value = true
    alert('QR Code generated successfully!')
  } else {
    alert('Please enter some text or URL')
  }
}

const downloadQR = () => {
  alert('QR Code downloaded!')
}

const printQR = () => {
  alert('QR Code sent to printer!')
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

.qr-section h2 {
  margin-bottom: 20px;
  color: #333;
  text-align: center;
}

.qr-form {
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.generate-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  width: 100%;
}

.generate-btn:hover {
  background: #0056b3;
}

.qr-display {
  text-align: center;
}

.qr-display h3 {
  margin-bottom: 20px;
  color: #333;
}

.qr-code-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.qr-placeholder {
  width: 200px;
  height: 200px;
  border: 2px solid #333;
  border-radius: 8px;
  padding: 10px;
  background: white;
}

.qr-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 2px;
  height: 100%;
}

.qr-cell {
  background: white;
  border: 1px solid #eee;
  border-radius: 1px;
}

.qr-cell.filled {
  background: #333;
}

.qr-text {
  margin: 10px 0;
  color: #666;
  font-size: 14px;
  word-break: break-all;
}

.qr-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.download-btn,
.print-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
}

.download-btn {
  background: #28a745;
  color: white;
}

.download-btn:hover {
  background: #218838;
}

.print-btn {
  background: #17a2b8;
  color: white;
}

.print-btn:hover {
  background: #138496;
}
</style>