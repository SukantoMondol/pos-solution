<template>
  <div class="page-container">
    <div class="header">
      <button class="back-btn" @click="goBack">← Back</button>
      <h1>Edit Profile</h1>
    </div>
    
    <div class="content">
      <div class="profile-section">
        <h2>User Profile</h2>
        
        <div class="profile-form">
          <form @submit.prevent="updateProfile">
            <div class="profile-image-section">
              <div class="profile-image">
                <img :src="profile.image" :alt="profile.name" v-if="profile.image">
                <div v-else class="default-avatar">
                  {{ profile.name.charAt(0).toUpperCase() }}
                </div>
              </div>
              <button type="button" class="change-image-btn" @click="changeImage">Change Image</button>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="name">Full Name</label>
                <input type="text" id="name" v-model="profile.name" required>
              </div>
              
              <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" v-model="profile.email" required>
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="phone">Phone Number</label>
                <input type="tel" id="phone" v-model="profile.phone" required>
              </div>
              
              <div class="form-group">
                <label for="role">Role</label>
                <select id="role" v-model="profile.role" required>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="employee">Employee</option>
                </select>
              </div>
            </div>
            
            <div class="form-group">
              <label for="address">Address</label>
              <textarea id="address" v-model="profile.address" rows="3"></textarea>
            </div>
            
            <div class="form-group">
              <label for="bio">Bio</label>
              <textarea id="bio" v-model="profile.bio" rows="4" placeholder="Tell us about yourself..."></textarea>
            </div>
            
            <div class="form-actions">
              <button type="button" class="cancel-btn" @click="goBack">Cancel</button>
              <button type="submit" class="save-btn">Save Changes</button>
            </div>
          </form>
        </div>
        
        <div class="profile-stats">
          <h3>Profile Statistics</h3>
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-label">Member Since</span>
              <span class="stat-value">{{ formatDate(profile.memberSince) }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Last Login</span>
              <span class="stat-value">{{ formatDate(profile.lastLogin) }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Total Sales</span>
              <span class="stat-value">{{ profile.totalSales }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Profile Views</span>
              <span class="stat-value">{{ profile.profileViews }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Edit Profile'
})

const profile = ref({
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 234 567 8900',
  role: 'admin',
  address: '123 Main Street, City, State 12345',
  bio: 'Experienced business owner with 10+ years in retail management.',
  image: '',
  memberSince: new Date('2020-01-15'),
  lastLogin: new Date(),
  totalSales: 1250,
  profileViews: 342
})

const goBack = () => {
  if (process.client) {
    window.location.href = '/'
  }
}

const updateProfile = () => {
  // Update last login
  profile.value.lastLogin = new Date()
  
  alert('Profile updated successfully!')
  goBack()
}

const changeImage = () => {
  // In a real app, this would open a file picker
  alert('Image upload functionality would be implemented here')
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
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

.profile-section h2 {
  margin-bottom: 30px;
  color: #333;
  text-align: center;
}

.profile-image-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
}

.profile-image {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 15px;
  border: 4px solid #007bff;
}

.profile-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.default-avatar {
  width: 100%;
  height: 100%;
  background: #007bff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  font-weight: bold;
}

.change-image-btn {
  background: #17a2b8;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.change-image-btn:hover {
  background: #138496;
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
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 30px;
}

.cancel-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.cancel-btn:hover {
  background: #545b62;
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

.profile-stats {
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid #eee;
}

.profile-stats h3 {
  margin-bottom: 20px;
  color: #333;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  text-align: center;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>