<template>
  <div class="w-full">
    <div ref="targetRef" class="h-4" />
  </div>
</template>

<script setup lang="ts">
const { targetRef, observe } = useIntersectionObserver()

onMounted(() => {
  observe(() => {
    console.log('觀察到目標元素')
  })
})
</script>
