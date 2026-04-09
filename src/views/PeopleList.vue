<script setup lang="ts">
import { computed } from 'vue';
import PeopleCard from '@/components/PeopleCard.vue';
import { store } from '@/store';

const peopleWithYears = computed(() => {
  return store.people.map((person) => ({
    ...person,
    ageInYears: Math.floor(person.ageInHours / 8760),
  }));
});
</script>

<template>
  <div class="people-list">
    <h1 class="typography-title">People</h1>
    <div class="people-list__grid">
      <PeopleCard
        v-for="person in peopleWithYears"
        :key="person.id"
        :to="`/person/${person.id}`"
        :name="person.name"
        :age-in-years="person.ageInYears"
      />
    </div>

    <router-link to="/settings" class="typography-link people-list__settings">Settings</router-link>
  </div>
</template>

<style scoped>
.people-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.people-list__grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.people-list__settings {
  align-self: flex-start;
}
</style>
