<template>
  <button
    class="flex fixed right-4 bottom-4 justify-center items-center w-10 h-10 bg-white rounded-full shadow-md transition-shadow duration-200 hover:shadow-lg"
    @click="scrollToTop"
  >
    ↑
  </button>
</template>

<script setup lang="ts">
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}
</script>
