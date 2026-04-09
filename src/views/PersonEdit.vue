<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import NumericInput from '@/components/NumericInput.vue'
import { store } from '@/store'

const route = useRoute()

const person = computed(() => {
  const id = Number(route.params.id)
  return store.people.find((p) => p.id === id)
})
</script>

<template>
  <div v-if="person" class="flex flex-col gap-4">
    <router-link to="/" class="text-violet-600 hover:underline text-sm">&larr; Back</router-link>

    <div class="group flex items-center gap-4">
      <img
        src="/img.png"
        :alt="person.name"
        class="photo-avatar h-20 w-20 shrink-0 rounded-full border border-transparent object-cover group-focus-within:border-[#3D06D7]"
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
    <router-link to="/" class="text-violet-600 hover:underline text-sm">Back to list</router-link>
  </div>
</template>
