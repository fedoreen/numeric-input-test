<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import NumericInput from "@/components/NumericInput.vue";
import { store } from "@/store";

const route = useRoute();

const person = computed(() => {
  const id = Number(route.params.id);
  return store.people.find((item) => item.id === id);
});
</script>

<template>
  <div v-if="person" class="flex flex-col gap-4">
    <router-link to="/" class="typography-link">&larr; Back</router-link>

    <div class="group flex items-center gap-4">
      <img
        :src="person.imagePath"
        :alt="person.name"
        class="photo-avatar h-20 w-20 shrink-0 rounded-full border border-transparent object-cover group-focus-within:border-[#3d06d7]"
      />
      <NumericInput
        v-model="person.ageInHours"
        :label="`${person.name.toUpperCase()} IS`"
        suffix="hours old"
        input-id="hours-input"
      />
    </div>
  </div>

  <div v-else>
    <p class="text-gray-600">Person not found</p>
    <router-link to="/" class="typography-link">Back to list</router-link>
  </div>
</template>
