<template>
  <header class="app-header">
    <div class="header-content">
      <div class="logo">
        <h1>POS SOLUTION</h1>
      </div>
      <div class="header-actions">
        <button class="notification-btn" @click="showNotifications">
          🔔
        </button>
        <button class="balance-btn" @click="toggleBalance">
          Balance
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const emit = defineEmits(['toggleBalance', 'showNotifications'])

const toggleBalance = () => {
  emit('toggleBalance')
}

const showNotifications = () => {
  emit('showNotifications')
}
</script>

<style scoped>
.app-header {
  background: white;
  padding: 15px 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  margin-bottom: 10px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo h1 {
  margin: 0;
  color: #333;
  font-size: 18px;
  font-weight: bold;
}

.header-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.notification-btn {
  background: none;
  border: 1px solid #ddd;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
}

.balance-btn {
  background: #FFC107;
  color: #333;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}
</style>

