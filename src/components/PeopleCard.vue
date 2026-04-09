<script setup lang="ts">
import { RouterLink } from "vue-router";

const props = withDefaults(
  defineProps<{
    to: string;
    name: string;
    ageInYears: number;
    imageSrc?: string;
  }>(),
  {
    imageSrc: "/img.png",
  },
);
</script>

<template>
  <RouterLink :to="to" class="people-card">
    <img class="people-card__avatar" :src="imageSrc" :alt="name" width="80" height="80" />
    <div class="people-card__body">
      <div class="people-card__caption typography-label">
        {{ name.toUpperCase() }}
      </div>
      <span class="typography-caption">{{ ageInYears }} years old</span>
    </div>
  </RouterLink>
</template>

<style scoped>
.people-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  max-width: 100%;
  padding: 12px 16px;
  border-radius: 6px;
  border: 1px solid #cfcadf;
  background: #fff;
}

.people-card:hover {
  border-color: #aa9dce;
}

.people-card__avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 1px solid transparent;
  object-fit: cover;
}

.people-card__body {
  align-self: center;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  min-width: 0;
}
</style>
