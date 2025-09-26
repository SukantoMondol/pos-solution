<template>
  <div class="page-container">
    <div class="header">
      <button class="back-btn" @click="goBack">← Back</button>
      <h1>Printer Settings</h1>
    </div>
    
    <div class="content">
      <div class="printer-section">
        <h2>Printer Configuration</h2>
        
        <div class="printer-setup">
          <h3>Add Printer</h3>
          <form @submit.prevent="addPrinter">
            <div class="form-row">
              <div class="form-group">
                <label for="printerName">Printer Name</label>
                <input type="text" id="printerName" v-model="newPrinter.name" required>
              </div>
              
              <div class="form-group">
                <label for="printerType">Printer Type</label>
                <select id="printerType" v-model="newPrinter.type" required>
                  <option value="">Select Type</option>
                  <option value="thermal">Thermal Printer</option>
                  <option value="inkjet">Inkjet Printer</option>
                  <option value="laser">Laser Printer</option>
                  <option value="pos">POS Printer</option>
                </select>
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="connection">Connection Type</label>
                <select id="connection" v-model="newPrinter.connection" required>
                  <option value="">Select Connection</option>
                  <option value="usb">USB</option>
                  <option value="wifi">WiFi</option>
                  <option value="bluetooth">Bluetooth</option>
                  <option value="ethernet">Ethernet</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="ipAddress">IP Address (if applicable)</label>
                <input type="text" id="ipAddress" v-model="newPrinter.ipAddress" placeholder="192.168.1.100">
              </div>
            </div>
            
            <button type="submit" class="add-btn">Add Printer</button>
          </form>
        </div>
        
        <div class="printer-list">
          <h3>Configured Printers</h3>
          <div v-if="printers.length === 0" class="no-printers">
            <p>No printers configured yet.</p>
          </div>
          <div v-else class="printers-grid">
            <div v-for="printer in printers" :key="printer.id" class="printer-card">
              <div class="printer-header">
                <h4>{{ printer.name }}</h4>
                <span class="status" :class="printer.status">{{ printer.status }}</span>
              </div>
              <div class="printer-details">
                <p><strong>Type:</strong> {{ printer.type }}</p>
                <p><strong>Connection:</strong> {{ printer.connection }}</p>
                <p v-if="printer.ipAddress"><strong>IP:</strong> {{ printer.ipAddress }}</p>
              </div>
              <div class="printer-actions">
                <button @click="testPrinter(printer)" class="test-btn">Test Print</button>
                <button @click="editPrinter(printer)" class="edit-btn">Edit</button>
                <button @click="deletePrinter(printer.id)" class="delete-btn">Delete</button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="print-settings">
          <h3>Print Settings</h3>
          <form @submit.prevent="updateSettings">
            <div class="form-row">
              <div class="form-group">
                <label for="defaultPrinter">Default Printer</label>
                <select id="defaultPrinter" v-model="settings.defaultPrinter">
                  <option value="">Select Default Printer</option>
                  <option v-for="printer in printers" :key="printer.id" :value="printer.id">
                    {{ printer.name }}
                  </option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="paperSize">Paper Size</label>
                <select id="paperSize" v-model="settings.paperSize">
                  <option value="58mm">58mm (Thermal)</option>
                  <option value="80mm">80mm (Thermal)</option>
                  <option value="A4">A4</option>
                  <option value="A5">A5</option>
                </select>
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="printCopies">Default Copies</label>
                <input type="number" id="printCopies" v-model="settings.printCopies" min="1" max="10">
              </div>
              
              <div class="form-group">
                <label for="autoPrint">Auto Print</label>
                <input type="checkbox" id="autoPrint" v-model="settings.autoPrint">
              </div>
            </div>
            
            <button type="submit" class="save-btn">Save Settings</button>
          </form>
        </div>
        
        <div class="print-test">
          <h3>Print Test</h3>
          <div class="test-options">
            <button @click="printReceipt" class="test-print-btn">Print Receipt</button>
            <button @click="printReport" class="test-print-btn">Print Report</button>
            <button @click="printLabel" class="test-print-btn">Print Label</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Printer Settings'
})

const newPrinter = ref({
  name: '',
  type: '',
  connection: '',
  ipAddress: ''
})

const settings = ref({
  defaultPrinter: '',
  paperSize: '80mm',
  printCopies: 1,
  autoPrint: false
})

const printers = ref([
  {
    id: 1,
    name: 'Thermal Printer 1',
    type: 'Thermal Printer',
    connection: 'USB',
    ipAddress: '',
    status: 'connected'
  },
  {
    id: 2,
    name: 'Network Printer',
    type: 'Laser Printer',
    connection: 'WiFi',
    ipAddress: '192.168.1.100',
    status: 'connected'
  }
])

const goBack = () => {
  if (process.client) {
    window.location.href = '/'
  }
}

const addPrinter = () => {
  const printer = {
    id: Date.now(),
    ...newPrinter.value,
    status: 'connected'
  }
  
  printers.value.push(printer)
  
  // Reset form
  newPrinter.value = {
    name: '',
    type: '',
    connection: '',
    ipAddress: ''
  }
  
  alert('Printer added successfully!')
}

const testPrinter = (printer: any) => {
  alert(`Testing printer: ${printer.name}`)
}

const editPrinter = (printer: any) => {
  alert(`Edit printer: ${printer.name}`)
}

const deletePrinter = (id: number) => {
  if (confirm('Are you sure you want to delete this printer?')) {
    printers.value = printers.value.filter(printer => printer.id !== id)
    alert('Printer deleted successfully!')
  }
}

const updateSettings = () => {
  alert('Printer settings saved successfully!')
}

const printReceipt = () => {
  alert('Printing test receipt...')
}

const printReport = () => {
  alert('Printing test report...')
}

const printLabel = () => {
  alert('Printing test label...')
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

.printer-section h2 {
  margin-bottom: 30px;
  color: #333;
  text-align: center;
}

.printer-setup {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.printer-setup h3 {
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

.printer-list h3 {
  margin-bottom: 20px;
  color: #333;
}

.no-printers {
  text-align: center;
  padding: 40px;
  color: #666;
}

.printers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.printer-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.printer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.printer-header h4 {
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

.status.connected {
  background: #d4edda;
  color: #155724;
}

.status.disconnected {
  background: #f8d7da;
  color: #721c24;
}

.printer-details p {
  margin: 5px 0;
  color: #666;
  font-size: 14px;
}

.printer-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.test-btn,
.edit-btn,
.delete-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
}

.test-btn {
  background: #17a2b8;
  color: white;
}

.test-btn:hover {
  background: #138496;
}

.edit-btn {
  background: #ffc107;
  color: #212529;
}

.edit-btn:hover {
  background: #e0a800;
}

.delete-btn {
  background: #dc3545;
  color: white;
}

.delete-btn:hover {
  background: #c82333;
}

.print-settings {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.print-settings h3 {
  margin-bottom: 20px;
  color: #333;
}

.save-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
}

.save-btn:hover {
  background: #218838;
}

.print-test h3 {
  margin-bottom: 20px;
  color: #333;
}

.test-options {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.test-print-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
}

.test-print-btn:hover {
  background: #545b62;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .printers-grid {
    grid-template-columns: 1fr;
  }
  
  .test-options {
    flex-direction: column;
  }
}
</style>

