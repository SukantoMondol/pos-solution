<template>
  <div :class="cardClass">
    <div v-if="$slots.header" class="card-header">
      <slot name="header"></slot>
    </div>
    <div class="card-body">
      <slot></slot>
    </div>
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'small' | 'medium' | 'large'
  shadow?: boolean
  bordered?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'medium',
  shadow: true,
  bordered: false
})

const cardClass = computed(() => {
  const classes = ['card']
  
  // Variant classes
  if (props.variant !== 'default') {
    classes.push(`card-${props.variant}`)
  }
  
  // Size classes
  classes.push(`card-${props.size}`)
  
  // Shadow
  if (props.shadow) {
    classes.push('card-shadow')
  }
  
  // Bordered
  if (props.bordered) {
    classes.push('card-bordered')
  }
  
  return classes.join(' ')
})
</script>

<style scoped>
.card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.card-shadow {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-bordered {
  border: 1px solid #ddd;
}

.card-header {
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
  background: #f8f9fa;
}

.card-body {
  padding: 20px;
}

.card-footer {
  padding: 16px 20px;
  border-top: 1px solid #eee;
  background: #f8f9fa;
}

/* Size variants */
.card-small .card-header,
.card-small .card-body,
.card-small .card-footer {
  padding: 12px 16px;
}

.card-large .card-header,
.card-large .card-body,
.card-large .card-footer {
  padding: 24px 28px;
}

/* Color variants */
.card-primary {
  border-left: 4px solid #007bff;
}

.card-success {
  border-left: 4px solid #28a745;
}

.card-warning {
  border-left: 4px solid #ffc107;
}

.card-danger {
  border-left: 4px solid #dc3545;
}

.card-info {
  border-left: 4px solid #17a2b8;
}
</style>

