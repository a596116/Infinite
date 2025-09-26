<template>
  <div class="w-full">
    <!-- Intersection Observer 觸發元素 -->
    <div ref="targetRef" class="h-4" />
  </div>
</template>

<script setup lang="ts">
interface InfiniteState {
  loaded: () => void
  complete: () => void
  error: () => void
}

// ----------- emit -----------
const emit = defineEmits<{
  (e: 'on-infinite', infiniteState: InfiniteState): void
}>()

// 狀態 loading、complete、error
const state = ref<'loading' | 'complete' | 'error'>('loading')

// 使用 Intersection Observer
const { targetRef, observe, disconnect } = useIntersectionObserver()

// 觀察到目標元素時的回調函數
const onInfinite = () => {
  if (state.value === 'loading') {
    emit('on-infinite', {
      loaded: () => {
        // 載入完成，回到載入狀態等待下次觸發
        state.value = 'loading'
      },
      complete: () => {
        // 所有資料載入完成
        state.value = 'complete'
        disconnect()
      },
      error: () => {
        // 載入錯誤
        state.value = 'error'
      },
    })
  }
}

let timer: NodeJS.Timeout | null = null
/*
 * @description: 防抖函數
 */
const debounceOnInfinite = () => {
  if (state.value !== 'loading') return

  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    onInfinite()
  }, 300)
}

onMounted(() => {
  observe(debounceOnInfinite)
})

// 清理定時器
onUnmounted(() => {
  if (timer) {
    clearTimeout(timer)
  }
})
</script>
