<template>
  <div class="page-container">
    <div class="header">
      <button class="back-btn" @click="goBack">← Back</button>
      <h1>Documents</h1>
    </div>
    
    <div class="content">
      <div class="document-section">
        <h2>Document Management</h2>
        
        <div class="upload-section">
          <h3>Upload New Document</h3>
          <form @submit.prevent="uploadDocument">
            <div class="form-group">
              <label for="documentName">Document Name</label>
              <input type="text" id="documentName" v-model="form.documentName" required>
            </div>
            
            <div class="form-group">
              <label for="documentType">Document Type</label>
              <select id="documentType" v-model="form.documentType" required>
                <option value="">Select Type</option>
                <option value="invoice">Invoice</option>
                <option value="receipt">Receipt</option>
                <option value="contract">Contract</option>
                <option value="report">Report</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="file">Choose File</label>
              <input type="file" id="file" @change="handleFileSelect" accept=".pdf,.doc,.docx,.jpg,.png">
            </div>
            
            <button type="submit" class="upload-btn">Upload Document</button>
          </form>
        </div>
        
        <div class="documents-list">
          <h3>Document Library</h3>
          <div class="search-bar">
            <input type="text" v-model="searchQuery" placeholder="Search documents...">
          </div>
          
          <div v-if="filteredDocuments.length === 0" class="no-documents">
            <p>No documents found.</p>
          </div>
          <div v-else class="documents-grid">
            <div v-for="document in filteredDocuments" :key="document.id" class="document-card">
              <div class="document-icon">
                📄
              </div>
              <div class="document-info">
                <h4>{{ document.name }}</h4>
                <p class="document-type">{{ document.type }}</p>
                <p class="document-date">{{ formatDate(document.uploadDate) }}</p>
              </div>
              <div class="document-actions">
                <button @click="viewDocument(document)" class="view-btn">View</button>
                <button @click="downloadDocument(document)" class="download-btn">Download</button>
                <button @click="deleteDocument(document.id)" class="delete-btn">Delete</button>
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
  title: 'Documents'
})

const form = ref({
  documentName: '',
  documentType: '',
  file: null as File | null
})

const searchQuery = ref('')

const documents = ref([
  {
    id: 1,
    name: 'Invoice_001.pdf',
    type: 'Invoice',
    uploadDate: new Date('2024-01-15'),
    size: '2.5 MB'
  },
  {
    id: 2,
    name: 'Receipt_2024.pdf',
    type: 'Receipt',
    uploadDate: new Date('2024-01-20'),
    size: '1.2 MB'
  },
  {
    id: 3,
    name: 'Monthly_Report.pdf',
    type: 'Report',
    uploadDate: new Date('2024-01-25'),
    size: '3.8 MB'
  }
])

const filteredDocuments = computed(() => {
  if (!searchQuery.value) return documents.value
  return documents.value.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const goBack = () => {
  if (process.client) {
    window.location.href = '/'
  }
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    form.value.file = target.files[0]
  }
}

const uploadDocument = () => {
  if (!form.value.documentName || !form.value.documentType) {
    alert('Please fill in all required fields')
    return
  }
  
  const newDocument = {
    id: Date.now(),
    name: form.value.documentName,
    type: form.value.documentType,
    uploadDate: new Date(),
    size: form.value.file ? `${(form.value.file.size / 1024 / 1024).toFixed(1)} MB` : 'Unknown'
  }
  
  documents.value.unshift(newDocument)
  
  alert('Document uploaded successfully!')
  
  // Reset form
  form.value = {
    documentName: '',
    documentType: '',
    file: null
  }
}

const viewDocument = (document: any) => {
  alert(`Viewing document: ${document.name}`)
}

const downloadDocument = (document: any) => {
  alert(`Downloading document: ${document.name}`)
}

const deleteDocument = (id: number) => {
  if (confirm('Are you sure you want to delete this document?')) {
    documents.value = documents.value.filter(doc => doc.id !== id)
    alert('Document deleted successfully!')
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

.document-section h2 {
  margin-bottom: 30px;
  color: #333;
  text-align: center;
}

.upload-section {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.upload-section h3 {
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
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.upload-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
}

.upload-btn:hover {
  background: #0056b3;
}

.documents-list h3 {
  margin-bottom: 20px;
  color: #333;
}

.search-bar {
  margin-bottom: 20px;
}

.search-bar input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.no-documents {
  text-align: center;
  padding: 40px;
  color: #666;
}

.documents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.document-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.document-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.document-info {
  margin-bottom: 15px;
}

.document-info h4 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 16px;
}

.document-type {
  color: #666;
  font-size: 14px;
  margin: 5px 0;
}

.document-date {
  color: #999;
  font-size: 12px;
  margin: 5px 0;
}

.document-actions {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  justify-content: center;
}

.view-btn,
.download-btn,
.delete-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
}

.view-btn {
  background: #17a2b8;
  color: white;
}

.view-btn:hover {
  background: #138496;
}

.download-btn {
  background: #28a745;
  color: white;
}

.download-btn:hover {
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
  .documents-grid {
    grid-template-columns: 1fr;
  }
  
  .document-actions {
    flex-direction: column;
  }
}
</style>