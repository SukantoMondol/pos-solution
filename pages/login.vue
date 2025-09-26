<template>
  <div class="popup-backdrop">
    <div class="popup-card">
      <div class="image-slider">
        <img src="https://via.placeholder.com/400x180/E86A92" alt="Image 1" class="slider-image active">
        <img src="https://via.placeholder.com/400x180/A8CC98" alt="Image 2" class="slider-image">
        <img src="https://via.placeholder.com/400x180/E0BBE4" alt="Image 3" class="slider-image">
        <img src="https://via.placeholder.com/400x180/957DAD" alt="Image 4" class="slider-image">
        <img src="https://via.placeholder.com/400x180/C6D8D3" alt="Image 5" class="slider-image">
      </div>

      <div class="popup-content">
        
        <div id="step-1" class="step-content active">
            <p>Step 1 email & mobile no for login</p>
          <div class="toggle-container">
          <div id="login-toggle" class="toggle-button" :class="{ right: !isMobile }" @click="toggleLoginType">
              <span class="toggle-text">Mobile</span>
              <span class="toggle-text">Email</span>
            </div>
          </div>
          <div id="dynamic-input">
            <input 
              v-if="isMobile"
              v-model="contactInput"
              type="tel" 
              id="contact-input" 
              class="input-field" 
              placeholder="Mobile Number" 
            />
            <input 
              v-else
              v-model="contactInput"
              type="email" 
              id="contact-input" 
              class="input-field" 
              placeholder="Email Address" 
            />
          </div>
          <div class="login-buttons">
            <button class="login-button forgot-button" @click="goToForgetStep">Forget</button>
            <button class="login-button send-otp-button" @click="sendOTP">Send OTP</button>
          </div>
          </div>

        <div id="step-2" class="step-content" :class="{ active: currentStep === 2 }">
          <p>Step 2 type OTP for login</p>
          <p class="step-message">We have sent a verification code to your {{ formatContactInfo(contactInput) }}</p>
          <div class="otp-field-container" id="otp-fields">
            <input 
              v-for="(digit, index) in otpDigits" 
              :key="index"
              v-model="otpDigits[index]"
              type="number" 
              class="otp-field" 
              maxlength="1" 
              @input="handleOtpInput(index, $event)"
              @keydown="handleOtpKeydown(index, $event)"
            />
          </div>
          <p class="timer-text" id="timer">{{ formatTime(timer) }}</p>
          <button 
            class="resend-button" 
            id="resend-otp-btn" 
            :disabled="resendCount >= 3"
            @click="resendOTP"
            :style="{ display: timer === 0 ? 'block' : 'none' }"
          >
            {{ resendCount >= 3 ? 'Limit Reached' : 'Resend OTP' }}
          </button>
          <div class="login-buttons">
            <button class="login-button back-button" @click="goBack">Back</button>
            <button class="login-button pin-code-button" @click="goToPinStep">Pin Code</button>
          </div>
        </div>

        <div id="step-3" class="step-content" :class="{ active: currentStep === 3 }">
           <p>Step 3 type pin code for login</p>
          <input 
            v-model="pinCode"
            type="number" 
            class="pin-code-input" 
            placeholder="Enter 6-digit Pin" 
            maxlength="6" 
          />
          <div class="login-buttons">
            <button class="login-button back-button" @click="goBack">Back</button>
            <button class="login-button dashboard-button" @click="goToDashboard">Dashboard</button>
          </div>
          </div>

        <div id="forget-step-1" class="step-content" :class="{ active: currentStep === 'forget-1' }">
          <p>Forget pin code: Step 1</p>
          <div class="toggle-container">
            <div id="forget-toggle" class="toggle-button" :class="{ right: !isForgetMobile }" @click="toggleForgetType">
                <span class="toggle-text">Mobile</span>
                <span class="toggle-text">Email</span>
            </div>
          </div>
          <div id="forget-dynamic-input">
            <input 
              v-if="isForgetMobile"
              v-model="forgetContactInput"
              type="tel" 
              id="forget-contact-input" 
              class="input-field" 
              placeholder="Mobile Number" 
            />
            <input 
              v-else
              v-model="forgetContactInput"
              type="email" 
              id="forget-contact-input" 
              class="input-field" 
              placeholder="Email Address" 
            />
          </div>
          <div class="login-buttons">
            <button class="login-button back-button-forget" @click="goBack">Back</button>
            <button class="login-button send-otp-button-forget" @click="sendForgetOTP">Send OTP</button>
          </div>
          </div>

        <div id="forget-step-2" class="step-content" :class="{ active: currentStep === 'forget-2' }">
          <p>Forget pin code: Step 2</p>
          <p class="step-message">We have sent a verification code to your {{ formatContactInfo(forgetContactInput, true) }}</p>
          <div class="otp-field-container" id="forget-otp-fields">
            <input 
              v-for="(digit, index) in forgetOtpDigits" 
              :key="index"
              v-model="forgetOtpDigits[index]"
              type="number" 
              class="otp-field" 
              maxlength="1" 
              @input="handleForgetOtpInput(index, $event)"
              @keydown="handleForgetOtpKeydown(index, $event)"
            />
          </div>
          <p class="timer-text" id="forget-timer">{{ formatTime(forgetTimer) }}</p>
          <button 
            class="resend-button" 
            id="forget-resend-otp-btn" 
            :disabled="forgetResendCount >= 3"
            @click="resendForgetOTP"
            :style="{ display: forgetTimer === 0 ? 'block' : 'none' }"
          >
            {{ forgetResendCount >= 3 ? 'Limit Reached' : 'Resend OTP' }}
          </button>
          <div class="login-buttons">
            <button class="login-button back-button-forget" @click="goBack">Back</button>
            <button class="login-button next-button-forget" @click="goToForgetStep3">Next</button>
          </div>
        </div>

        <div id="forget-step-3" class="step-content" :class="{ active: currentStep === 'forget-3' }">
          <p>Forget pin code: Step 3</p>
          <input 
            v-model="oldPinCode"
            type="number" 
            class="input-field" 
            placeholder="Enter old pin code" 
          />
          <input 
            v-model="newPinCode"
            type="number" 
            class="input-field" 
            placeholder="Enter new pin code" 
          />
          <div class="login-buttons">
            <button class="login-button back-button-forget" @click="goBack">Back</button>
            <button class="login-button forget-button-final" @click="resetPinCode">Forget</button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Page meta
definePageMeta({
  layout: false // Use no layout for login page
})

// Reactive data
const currentStep = ref(1)
const isMobile = ref(true)
const isForgetMobile = ref(true)
const contactInput = ref('')
const forgetContactInput = ref('')
const otpDigits = ref(['', '', '', '', '', ''])
const forgetOtpDigits = ref(['', '', '', '', '', ''])
const pinCode = ref('')
const oldPinCode = ref('')
const newPinCode = ref('')
const timer = ref(60)
const forgetTimer = ref(60)
const resendCount = ref(0)
const forgetResendCount = ref(0)
const timerInterval = ref(null)

// Image slider
const currentImageIndex = ref(0)
const images = ref([
  'https://via.placeholder.com/400x180/E86A92',
  'https://via.placeholder.com/400x180/A8CC98',
  'https://via.placeholder.com/400x180/E0BBE4',
  'https://via.placeholder.com/400x180/957DAD',
  'https://via.placeholder.com/400x180/C6D8D3'
])

// Methods
const toggleLoginType = () => {
  isMobile.value = !isMobile.value
}

const toggleForgetType = () => {
  isForgetMobile.value = !isForgetMobile.value
}

const formatContactInfo = (input: string, isForget = false) => {
  const currentIsMobile = isForget ? isForgetMobile.value : isMobile.value
  if (currentIsMobile) {
    return `number ending in ${input.slice(-4)}`
  } else {
    const atIndex = input.indexOf('@')
    if (atIndex > 0) {
      return `email ending in ${input.substring(atIndex)}`
    }
  }
  return input
}

const startTimer = (isForget = false) => {
  const duration = 60
  let timeLeft = duration
  
  if (isForget) {
    forgetTimer.value = duration
  } else {
    timer.value = duration
  }
  
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
  }
  
  timerInterval.value = setInterval(() => {
    timeLeft--
    
    if (isForget) {
      forgetTimer.value = timeLeft
    } else {
      timer.value = timeLeft
    }
    
    if (timeLeft < 0) {
      clearInterval(timerInterval.value)
      if (isForget) {
        forgetTimer.value = 0
      } else {
        timer.value = 0
      }
    }
  }, 1000)
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const navigateToStep = (step: number | string) => {
  currentStep.value = step
}

const sendOTP = () => {
  if (!contactInput.value) {
    alert('Please enter your details.')
    return
  }
  navigateToStep(2)
  startTimer(false)
}

const sendForgetOTP = () => {
  if (!forgetContactInput.value) {
    alert('Please enter your details.')
    return
  }
  navigateToStep('forget-2')
  startTimer(true)
}

const goToForgetStep = () => {
  navigateToStep('forget-1')
}

const goToPinStep = () => {
  navigateToStep(3)
}

const goToForgetStep3 = () => {
  navigateToStep('forget-3')
}

const goToDashboard = () => {
  navigateTo('/')
}

const goBack = () => {
  if (currentStep.value === 2) {
    navigateToStep(1)
  } else if (currentStep.value === 3) {
    navigateToStep(2)
  } else if (currentStep.value === 'forget-2') {
    navigateToStep('forget-1')
  } else if (currentStep.value === 'forget-3') {
    navigateToStep('forget-2')
  } else {
    navigateToStep(1)
  }
}

const handleOtpInput = (index: number, event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value
  
  if (value.length === 1 && index < 5) {
    const nextInput = document.querySelector(`#otp-fields input:nth-child(${index + 2})`) as HTMLInputElement
    if (nextInput) {
      nextInput.focus()
    }
  }
}

const handleOtpKeydown = (index: number, event: KeyboardEvent) => {
  if (event.key === 'Backspace' && !otpDigits.value[index] && index > 0) {
    const prevInput = document.querySelector(`#otp-fields input:nth-child(${index})`) as HTMLInputElement
    if (prevInput) {
      prevInput.focus()
    }
  }
}

const handleForgetOtpInput = (index: number, event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value
  
  if (value.length === 1 && index < 5) {
    const nextInput = document.querySelector(`#forget-otp-fields input:nth-child(${index + 2})`) as HTMLInputElement
    if (nextInput) {
      nextInput.focus()
    }
  }
}

const handleForgetOtpKeydown = (index: number, event: KeyboardEvent) => {
  if (event.key === 'Backspace' && !forgetOtpDigits.value[index] && index > 0) {
    const prevInput = document.querySelector(`#forget-otp-fields input:nth-child(${index})`) as HTMLInputElement
    if (prevInput) {
      prevInput.focus()
    }
  }
}

const resendOTP = () => {
  if (resendCount.value < 3) {
    resendCount.value++
    startTimer(false)
  }
}

const resendForgetOTP = () => {
  if (forgetResendCount.value < 3) {
    forgetResendCount.value++
    startTimer(true)
  }
}

const resetPinCode = () => {
  alert('Password successfully reset!')
  navigateToStep(1)
}

// Image slider functionality
const nextImage = () => {
  currentImageIndex.value = (currentImageIndex.value + 1) % images.value.length
}

// Lifecycle
onMounted(() => {
  // Start image slider
  setInterval(nextImage, 1500)
  
  // Check if user is already logged in
  // Check if user is logged in (mock)
  const isLoggedIn = false
  if (isLoggedIn) {
    if (process.client) {
      window.location.href = '/'
    }
  }
})

onUnmounted(() => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
  }
})
</script>

<style scoped>
/* Popup container and backdrop */
.popup-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: sans-serif;
}

/* Popup card */
.popup-card {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  width: 70%;
  max-width: 300px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* Image slider container */
.image-slider {
  position: relative;
  height: 180px;
  overflow: hidden;
  padding: 20px;
}

.slider-image {
  width: 90%;
  height: 90%;
  object-fit: cover;
  display: none;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: opacity 0.5s ease-in-out;
  opacity: 0;
  border: 1px solid #dddddd;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.slider-image.active {
  display: block;
  opacity: 1;
}

/* Content inside the card */
.popup-content {
  padding: 24px;
  text-align: center;
}

/* Title */
.popup-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333333;
  margin-bottom: 20px;
}

/* Toggle button */
.toggle-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.toggle-button {
  position: relative;
  width: 140px;
  height: 40px;
  border-radius: 20px;
  background-color: #e0e0e0;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.toggle-button::before {
  content: '';
  position: absolute;
  width: 50%;
  height: 100%;
  background-color: #007bff;
  border-radius: 20px;
  transition: transform 0.3s ease;
}

.toggle-button.right::before {
  transform: translateX(100%);
}

.toggle-text {
  position: relative;
  width: 50%;
  text-align: center;
  font-weight: 500;
  color: #666666;
  transition: color 0.3s ease;
  z-index: 1;
}

.toggle-button.right .toggle-text:first-child {
  color: #ffffff;
}

.toggle-button:not(.right) .toggle-text:last-child {
  color: #ffffff;
}

.toggle-button.right .toggle-text:last-child {
    color: #ffffff;
}
.toggle-button:not(.right) .toggle-text:first-child {
  color: #ffffff;
}

/* Input fields and buttons */
.input-field {
  width: 100%;
  padding: 12px;
  border: 1px solid #cccccc;
  border-radius: 8px;
  margin-bottom: 15px;
  box-sizing: border-box;
}

.login-buttons {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.login-button {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}

.forgot-button {
  background-color: #7f8c8d;
  color: #ffffff;
}

.send-otp-button {
  background-color: #007bff;
  color: #ffffff;
}

/* Step-specific styles */
.step-content {
  display: none;
  flex-direction: column;
}

.step-content.active {
  display: flex;
}

.step-message {
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 15px;
}

.otp-field-container {
  display: flex;
  justify-content: center;
  gap: 5px;
  margin-bottom: 15px;
}

.otp-field {
  width: 28px;
  height: 40px;
  text-align: center;
  font-size: 1.2rem;
  border: 1px solid #cccccc;
  border-radius: 8px;
}

.timer-text {
    font-size: 0.9rem;
    color: #e74c3c;
    margin-bottom: 15px;
}

.resend-button {
    background-color: #3498db;
    color: white;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-bottom: 15px;
    display: none;
}
.resend-button:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
}

.back-button, .pin-code-button, .dashboard-button {
    background-color: #7f8c8d;
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 12px;
    font-weight: bold;
    cursor: pointer;
    flex: 1;
}

.pin-code-button, .dashboard-button, .forget-button-final {
    background-color: #2ecc71;
}

.pin-code-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #cccccc;
  border-radius: 8px;
  margin-bottom: 15px;
  box-sizing: border-box;
  text-align: center;
  font-size: 1.2rem;
}
</style>

