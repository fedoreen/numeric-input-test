<script setup lang="ts">
import NumericInput from '@/components/NumericInput.vue';
import { store } from '@/store';
</script>

<template>
  <div class="settings">
    <router-link to="/" class="typography-link settings__back">&larr; Back</router-link>

    <h1 class="typography-title">Settings</h1>

    <NumericInput
      v-model="store.minimumAgeInMonths"
      label="MINIMUM AGE"
      suffix="months"
      input-id="min-age-input"
    />
  </div>
</template>

<style scoped>
.settings {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.settings__back {
  align-self: flex-start;
}
</style>
