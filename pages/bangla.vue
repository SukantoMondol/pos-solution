<template>
  <div class="page-container">
    <div class="header">
      <button class="back-btn" @click="goBack">← Back</button>
      <h1>বাংলা ভাষা সেটিংস</h1>
      <button class="add-btn" @click="showAddModal = true">+ নতুন সেটিং</button>
    </div>
    
    <div class="content">
      <div class="bangla-section">
        <div class="language-info">
          <div class="info-card">
            <div class="info-icon">🇧🇩</div>
            <div class="info-content">
              <h2>বাংলা ভাষা সমর্থন</h2>
              <p>আপনার POS সিস্টেমে বাংলা ভাষার সম্পূর্ণ সমর্থন রয়েছে। এখানে আপনি ভাষা সেটিংস, ফন্ট কনফিগারেশন এবং অনুবাদ পরিচালনা করতে পারবেন।</p>
            </div>
          </div>
        </div>
        
        <div class="settings-grid">
          <div class="setting-card">
            <div class="setting-header">
              <h3>ভাষা সেটিংস</h3>
              <span class="status active">সক্রিয়</span>
            </div>
            <div class="setting-content">
              <div class="setting-item">
                <label>প্রাথমিক ভাষা</label>
                <select v-model="settings.primaryLanguage">
                  <option value="bn">বাংলা</option>
                  <option value="en">English</option>
                </select>
              </div>
              <div class="setting-item">
                <label>রাইট-টু-লেফট সমর্থন</label>
                <input type="checkbox" v-model="settings.rtlSupport">
              </div>
              <div class="setting-item">
                <label>সংখ্যা ফরম্যাট</label>
                <select v-model="settings.numberFormat">
                  <option value="bn">বাংলা সংখ্যা</option>
                  <option value="en">ইংরেজি সংখ্যা</option>
                </select>
              </div>
            </div>
          </div>
          
          <div class="setting-card">
            <div class="setting-header">
              <h3>ফন্ট কনফিগারেশন</h3>
              <span class="status active">সক্রিয়</span>
            </div>
            <div class="setting-content">
              <div class="setting-item">
                <label>ফন্ট পরিবার</label>
                <select v-model="settings.fontFamily">
                  <option value="kalpurush">কল্পরুশ</option>
                  <option value="solaimanlipi">সোলাইমানলিপি</option>
                  <option value="nikosh">নিকোশ</option>
                  <option value="adobe">অ্যাডোব</option>
                </select>
              </div>
              <div class="setting-item">
                <label>ফন্ট সাইজ</label>
                <input type="range" v-model="settings.fontSize" min="12" max="24" class="font-slider">
                <span class="font-size-display">{{ settings.fontSize }}px</span>
              </div>
              <div class="setting-item">
                <label>বোল্ড টেক্সট</label>
                <input type="checkbox" v-model="settings.boldText">
              </div>
            </div>
          </div>
          
          <div class="setting-card">
            <div class="setting-header">
              <h3>তারিখ ও সময়</h3>
              <span class="status active">সক্রিয়</span>
            </div>
            <div class="setting-content">
              <div class="setting-item">
                <label>তারিখ ফরম্যাট</label>
                <select v-model="settings.dateFormat">
                  <option value="dd/mm/yyyy">দিন/মাস/বছর</option>
                  <option value="mm/dd/yyyy">মাস/দিন/বছর</option>
                  <option value="yyyy-mm-dd">বছর-মাস-দিন</option>
                </select>
              </div>
              <div class="setting-item">
                <label>সময় ফরম্যাট</label>
                <select v-model="settings.timeFormat">
                  <option value="12">১২ ঘন্টা (AM/PM)</option>
                  <option value="24">২৪ ঘন্টা</option>
                </select>
              </div>
              <div class="setting-item">
                <label>বাংলা মাসের নাম</label>
                <input type="checkbox" v-model="settings.bengaliMonthNames">
              </div>
            </div>
          </div>
          
          <div class="setting-card">
            <div class="setting-header">
              <h3>মুদ্রা সেটিংস</h3>
              <span class="status active">সক্রিয়</span>
            </div>
            <div class="setting-content">
              <div class="setting-item">
                <label>মুদ্রা প্রতীক</label>
                <select v-model="settings.currencySymbol">
                  <option value="৳">৳ (টাকা)</option>
                  <option value="$">$ (ডলার)</option>
                  <option value="₹">₹ (রুপি)</option>
                </select>
              </div>
              <div class="setting-item">
                <label>মুদ্রা অবস্থান</label>
                <select v-model="settings.currencyPosition">
                  <option value="before">সংখ্যার আগে</option>
                  <option value="after">সংখ্যার পরে</option>
                </select>
              </div>
              <div class="setting-item">
                <label>বাংলা সংখ্যায় মুদ্রা</label>
                <input type="checkbox" v-model="settings.bengaliNumbers">
              </div>
            </div>
          </div>
        </div>
        
        <div class="translation-section">
          <h3>অনুবাদ পরিচালনা</h3>
          <div class="translation-stats">
            <div class="stat-item">
              <span class="stat-label">মোট শব্দ</span>
              <span class="stat-value">{{ translationStats.totalWords }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">অনুবাদিত</span>
              <span class="stat-value completed">{{ translationStats.translated }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">অনুবাদ বাকি</span>
              <span class="stat-value pending">{{ translationStats.pending }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">অনুবাদ শতাংশ</span>
              <span class="stat-value">{{ translationStats.percentage }}%</span>
            </div>
          </div>
          
          <div class="translation-list">
            <div v-for="item in translationItems" :key="item.id" class="translation-item">
              <div class="translation-key">
                <strong>{{ item.key }}</strong>
                <span class="translation-status" :class="item.status">{{ item.status }}</span>
              </div>
              <div class="translation-value">
                <input type="text" v-model="item.value" :placeholder="item.placeholder" class="translation-input">
                <button @click="saveTranslation(item)" class="save-translation-btn">সংরক্ষণ</button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="preview-section">
          <h3>পূর্বরূপ</h3>
          <div class="preview-card">
            <div class="preview-header">
              <h4>POS সিস্টেম - পূর্বরূপ</h4>
              <span class="preview-date">{{ formatDate(new Date()) }}</span>
            </div>
            <div class="preview-content">
              <div class="preview-item">
                <span class="preview-label">মোট বিক্রয়:</span>
                <span class="preview-value">{{ formatCurrency(125000) }}</span>
              </div>
              <div class="preview-item">
                <span class="preview-label">আজকের লেনদেন:</span>
                <span class="preview-value">{{ formatNumber(45) }}টি</span>
              </div>
              <div class="preview-item">
                <span class="preview-label">সর্বশেষ আপডেট:</span>
                <span class="preview-value">{{ formatTime(new Date()) }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="action-buttons">
          <button @click="saveSettings" class="save-btn">সেটিংস সংরক্ষণ করুন</button>
          <button @click="resetSettings" class="reset-btn">পুনরায় সেট করুন</button>
          <button @click="exportTranslations" class="export-btn">অনুবাদ রপ্তানি</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'বাংলা ভাষা সেটিংস'
})

const settings = ref({
  primaryLanguage: 'bn',
  rtlSupport: false,
  numberFormat: 'bn',
  fontFamily: 'kalpurush',
  fontSize: 16,
  boldText: false,
  dateFormat: 'dd/mm/yyyy',
  timeFormat: '12',
  bengaliMonthNames: true,
  currencySymbol: '৳',
  currencyPosition: 'before',
  bengaliNumbers: true
})

const translationStats = ref({
  totalWords: 1250,
  translated: 1100,
  pending: 150,
  percentage: 88
})

const translationItems = ref([
  {
    id: 1,
    key: 'dashboard',
    value: 'ড্যাশবোর্ড',
    placeholder: 'Dashboard',
    status: 'completed'
  },
  {
    id: 2,
    key: 'products',
    value: 'পণ্য',
    placeholder: 'Products',
    status: 'completed'
  },
  {
    id: 3,
    key: 'customers',
    value: 'গ্রাহক',
    placeholder: 'Customers',
    status: 'completed'
  },
  {
    id: 4,
    key: 'sales',
    value: 'বিক্রয়',
    placeholder: 'Sales',
    status: 'completed'
  },
  {
    id: 5,
    key: 'reports',
    value: 'রিপোর্ট',
    placeholder: 'Reports',
    status: 'pending'
  },
  {
    id: 6,
    key: 'settings',
    value: 'সেটিংস',
    placeholder: 'Settings',
    status: 'completed'
  },
  {
    id: 7,
    key: 'total_sales',
    value: 'মোট বিক্রয়',
    placeholder: 'Total Sales',
    status: 'completed'
  },
  {
    id: 8,
    key: 'add_product',
    value: 'পণ্য যোগ করুন',
    placeholder: 'Add Product',
    status: 'pending'
  }
])

const goBack = () => {
  if (process.client) {
    window.location.href = '/'
  }
}

const saveSettings = () => {
  alert('বাংলা ভাষা সেটিংস সফলভাবে সংরক্ষণ করা হয়েছে!')
}

const resetSettings = () => {
  if (confirm('আপনি কি নিশ্চিত যে আপনি সেটিংস পুনরায় সেট করতে চান?')) {
    // Reset to default values
    settings.value = {
      primaryLanguage: 'bn',
      rtlSupport: false,
      numberFormat: 'bn',
      fontFamily: 'kalpurush',
      fontSize: 16,
      boldText: false,
      dateFormat: 'dd/mm/yyyy',
      timeFormat: '12',
      bengaliMonthNames: true,
      currencySymbol: '৳',
      currencyPosition: 'before',
      bengaliNumbers: true
    }
    alert('সেটিংস পুনরায় সেট করা হয়েছে!')
  }
}

const saveTranslation = (item: any) => {
  item.status = 'completed'
  alert(`"${item.key}" এর অনুবাদ সংরক্ষণ করা হয়েছে!`)
}

const exportTranslations = () => {
  alert('অনুবাদ ফাইল রপ্তানি করা হচ্ছে...')
}

const formatDate = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  }
  
  if (settings.value.bengaliMonthNames) {
    const bengaliMonths = [
      'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
      'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
    ]
    const bengaliDays = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার']
    
    const day = bengaliDays[date.getDay()]
    const month = bengaliMonths[date.getMonth()]
    const year = settings.value.bengaliNumbers ? 
      date.getFullYear().toString().replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[parseInt(d)]) :
      date.getFullYear().toString()
    
    return `${day}, ${date.getDate()} ${month} ${year}`
  }
  
  return date.toLocaleDateString('bn-BD', options)
}

const formatTime = (date: Date) => {
  const hours = date.getHours()
  const minutes = date.getMinutes()
  
  if (settings.value.timeFormat === '12') {
    const ampm = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours % 12 || 12
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`
  }
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}

const formatCurrency = (amount: number) => {
  const formattedAmount = settings.value.bengaliNumbers ? 
    amount.toString().replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[parseInt(d)]) :
    amount.toLocaleString()
  
  if (settings.value.currencyPosition === 'before') {
    return `${settings.value.currencySymbol} ${formattedAmount}`
  } else {
    return `${formattedAmount} ${settings.value.currencySymbol}`
  }
}

const formatNumber = (num: number) => {
  return settings.value.bengaliNumbers ? 
    num.toString().replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[parseInt(d)]) :
    num.toString()
}
</script>

<style scoped>
.page-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Kalpurush', 'SolaimanLipi', 'Nikosh', sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
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
}

.add-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.language-info {
  margin-bottom: 30px;
}

.info-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.info-icon {
  font-size: 48px;
}

.info-content h2 {
  margin: 0 0 10px 0;
  font-size: 24px;
}

.info-content p {
  margin: 0;
  font-size: 16px;
  line-height: 1.6;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.setting-card {
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
}

.setting-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.setting-header h3 {
  margin: 0;
  color: #333;
  font-size: 18px;
}

.status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
}

.status.active {
  background: #d4edda;
  color: #155724;
}

.setting-item {
  margin-bottom: 15px;
}

.setting-item label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

.setting-item input,
.setting-item select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.font-slider {
  width: 100%;
  margin: 10px 0;
}

.font-size-display {
  font-weight: bold;
  color: #007bff;
  margin-left: 10px;
}

.translation-section {
  margin-bottom: 30px;
}

.translation-section h3 {
  margin-bottom: 20px;
  color: #333;
}

.translation-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.stat-item {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  border: 1px solid #ddd;
}

.stat-label {
  display: block;
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #007bff;
}

.stat-value.completed {
  color: #28a745;
}

.stat-value.pending {
  color: #ffc107;
}

.translation-list {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}

.translation-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #ddd;
}

.translation-item:last-child {
  border-bottom: none;
}

.translation-key {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
}

.translation-key strong {
  color: #333;
}

.translation-status {
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: bold;
  text-transform: uppercase;
}

.translation-status.completed {
  background: #d4edda;
  color: #155724;
}

.translation-status.pending {
  background: #fff3cd;
  color: #856404;
}

.translation-value {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 2;
}

.translation-input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.save-translation-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.preview-section {
  margin-bottom: 30px;
}

.preview-section h3 {
  margin-bottom: 20px;
  color: #333;
}

.preview-card {
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
}

.preview-header h4 {
  margin: 0;
  color: #333;
}

.preview-date {
  color: #666;
  font-size: 14px;
}

.preview-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.preview-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.preview-label {
  font-weight: bold;
  color: #333;
}

.preview-value {
  color: #007bff;
  font-weight: bold;
}

.action-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.save-btn,
.reset-btn,
.export-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
}

.save-btn {
  background: #28a745;
  color: white;
}

.reset-btn {
  background: #ffc107;
  color: #212529;
}

.export-btn {
  background: #17a2b8;
  color: white;
}

@media (max-width: 768px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }
  
  .translation-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .translation-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .translation-value {
    width: 100%;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style>

