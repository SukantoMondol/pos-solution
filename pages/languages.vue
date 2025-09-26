<template>
  <div class="page-container">
    <div class="header">
      <button class="back-btn" @click="goBack">← Back</button>
      <h1>Language Settings</h1>
    </div>
    
    <div class="content">
      <div class="language-section">
        <h2>Select Language</h2>
        
        <div class="current-language">
          <h3>Current Language</h3>
          <div class="language-display">
            <span class="flag">{{ currentLanguage.flag }}</span>
            <span class="name">{{ currentLanguage.name }}</span>
            <span class="code">({{ currentLanguage.code }})</span>
          </div>
        </div>
        
        <div class="language-options">
          <h3>Available Languages</h3>
          <div class="languages-grid">
            <div 
              v-for="language in languages" 
              :key="language.code"
              class="language-card"
              :class="{ active: currentLanguage.code === language.code }"
              @click="selectLanguage(language)"
            >
              <div class="language-flag">{{ language.flag }}</div>
              <div class="language-info">
                <h4>{{ language.name }}</h4>
                <p>{{ language.nativeName }}</p>
              </div>
              <div v-if="currentLanguage.code === language.code" class="selected-indicator">
                ✓
              </div>
            </div>
          </div>
        </div>
        
        <div class="language-settings">
          <h3>Language Settings</h3>
          <form @submit.prevent="updateSettings">
            <div class="form-group">
              <label for="dateFormat">Date Format</label>
              <select id="dateFormat" v-model="settings.dateFormat">
                <option value="MM/DD/YYYY">MM/DD/YYYY (US)</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY (UK)</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
                <option value="DD-MM-YYYY">DD-MM-YYYY (EU)</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="timeFormat">Time Format</label>
              <select id="timeFormat" v-model="settings.timeFormat">
                <option value="12">12 Hour (AM/PM)</option>
                <option value="24">24 Hour</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="numberFormat">Number Format</label>
              <select id="numberFormat" v-model="settings.numberFormat">
                <option value="US">1,234.56 (US)</option>
                <option value="EU">1.234,56 (EU)</option>
                <option value="IN">1,23,456.78 (India)</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="currencySymbol">Currency Symbol Position</label>
              <select id="currencySymbol" v-model="settings.currencySymbol">
                <option value="before">$100 (Before)</option>
                <option value="after">100$ (After)</option>
              </select>
            </div>
            
            <button type="submit" class="save-btn">Save Settings</button>
          </form>
        </div>
        
        <div class="translation-status">
          <h3>Translation Status</h3>
          <div class="status-grid">
            <div class="status-item">
              <span class="status-label">Interface</span>
              <span class="status-value" :class="translationStatus.interface">
                {{ translationStatus.interface }}%
              </span>
            </div>
            <div class="status-item">
              <span class="status-label">Help Text</span>
              <span class="status-value" :class="translationStatus.helpText">
                {{ translationStatus.helpText }}%
              </span>
            </div>
            <div class="status-item">
              <span class="status-label">Error Messages</span>
              <span class="status-value" :class="translationStatus.errorMessages">
                {{ translationStatus.errorMessages }}%
              </span>
            </div>
            <div class="status-item">
              <span class="status-label">Reports</span>
              <span class="status-value" :class="translationStatus.reports">
                {{ translationStatus.reports }}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Language Settings'
})

const currentLanguage = ref({
  flag: '🇺🇸',
  name: 'English',
  nativeName: 'English',
  code: 'en'
})

const settings = ref({
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12',
  numberFormat: 'US',
  currencySymbol: 'before'
})

const translationStatus = ref({
  interface: 100,
  helpText: 85,
  errorMessages: 90,
  reports: 75
})

const languages = ref([
  {
    flag: '🇺🇸',
    name: 'English',
    nativeName: 'English',
    code: 'en'
  },
  {
    flag: '🇪🇸',
    name: 'Spanish',
    nativeName: 'Español',
    code: 'es'
  },
  {
    flag: '🇫🇷',
    name: 'French',
    nativeName: 'Français',
    code: 'fr'
  },
  {
    flag: '🇩🇪',
    name: 'German',
    nativeName: 'Deutsch',
    code: 'de'
  },
  {
    flag: '🇮🇹',
    name: 'Italian',
    nativeName: 'Italiano',
    code: 'it'
  },
  {
    flag: '🇵🇹',
    name: 'Portuguese',
    nativeName: 'Português',
    code: 'pt'
  },
  {
    flag: '🇷🇺',
    name: 'Russian',
    nativeName: 'Русский',
    code: 'ru'
  },
  {
    flag: '🇨🇳',
    name: 'Chinese',
    nativeName: '中文',
    code: 'zh'
  },
  {
    flag: '🇯🇵',
    name: 'Japanese',
    nativeName: '日本語',
    code: 'ja'
  },
  {
    flag: '🇰🇷',
    name: 'Korean',
    nativeName: '한국어',
    code: 'ko'
  },
  {
    flag: '🇦🇷',
    name: 'Arabic',
    nativeName: 'العربية',
    code: 'ar'
  },
  {
    flag: '🇧🇩',
    name: 'Bengali',
    nativeName: 'বাংলা',
    code: 'bn'
  }
])

const goBack = () => {
  if (process.client) {
    window.location.href = '/'
  }
}

const selectLanguage = (language: any) => {
  currentLanguage.value = language
  alert(`Language changed to ${language.name}. The interface will update accordingly.`)
}

const updateSettings = () => {
  alert('Language settings saved successfully!')
}

const getStatusClass = (percentage: number) => {
  if (percentage >= 90) return 'complete'
  if (percentage >= 70) return 'good'
  if (percentage >= 50) return 'partial'
  return 'incomplete'
}
</script>

<style scoped>
.page-container {
  padding: 20px;
  max-width: 1000px;
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

.language-section h2 {
  margin-bottom: 30px;
  color: #333;
  text-align: center;
}

.current-language {
  background: #e3f2fd;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
  border-left: 4px solid #007bff;
}

.current-language h3 {
  margin-bottom: 15px;
  color: #333;
}

.language-display {
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 18px;
}

.flag {
  font-size: 32px;
}

.name {
  font-weight: bold;
  color: #333;
}

.code {
  color: #666;
  font-size: 14px;
}

.language-options h3 {
  margin-bottom: 20px;
  color: #333;
}

.languages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
  margin-bottom: 30px;
}

.language-card {
  display: flex;
  align-items: center;
  padding: 15px;
  background: #f8f9fa;
  border: 2px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.language-card:hover {
  border-color: #007bff;
  background: #e3f2fd;
}

.language-card.active {
  border-color: #007bff;
  background: #e3f2fd;
}

.language-flag {
  font-size: 32px;
  margin-right: 15px;
}

.language-info {
  flex: 1;
}

.language-info h4 {
  margin: 0 0 5px 0;
  color: #333;
  font-size: 16px;
}

.language-info p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.selected-indicator {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #28a745;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
}

.language-settings {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.language-settings h3 {
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

.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
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

.translation-status h3 {
  margin-bottom: 20px;
  color: #333;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.status-label {
  font-weight: bold;
  color: #333;
}

.status-value {
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
}

.status-value.complete {
  background: #d4edda;
  color: #155724;
}

.status-value.good {
  background: #d1ecf1;
  color: #0c5460;
}

.status-value.partial {
  background: #fff3cd;
  color: #856404;
}

.status-value.incomplete {
  background: #f8d7da;
  color: #721c24;
}

@media (max-width: 768px) {
  .languages-grid {
    grid-template-columns: 1fr;
  }
  
  .status-grid {
    grid-template-columns: 1fr;
  }
  
  .language-display {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>

