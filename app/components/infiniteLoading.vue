<template>
  <div class="w-full">
    <!-- 加載中 -->
    <div v-if="state === 'loading'" class="py-8 text-center">
      <slot name="spinner">
        <div class="flex justify-center items-center">
          <div
            class="w-8 h-8 rounded-full border-b-2 border-blue-600 animate-spin"
          />
        </div>
        <p class="mt-2 text-sm text-gray-500">載入中...</p>
      </slot>
    </div>

    <!-- 載入完成 -->
    <div v-if="state === 'complete'" class="py-8 text-center">
      <slot name="complete">
        <span class="text-gray-500">{{ complete }}</span>
      </slot>
    </div>

    <!-- 載入錯誤 -->
    <div v-if="state === 'error'" class="py-8 text-center">
      <slot name="error" :retry="retry">
        <div class="">
          <p class="mb-4 text-red-600">{{ error }}</p>
          <button
            class="px-4 py-2 text-white bg-red-600 rounded transition-colors hover:bg-red-700"
            @click="retry"
          >
            重試
          </button>
        </div>
      </slot>
    </div>

    <!-- Intersection Observer 觸發元素 -->
    <div ref="targetRef" class="h-4" />
  </div>
</template>

<script setup lang="ts">
import type { InfiniteState } from '~/types'

// ----------- props -----------
withDefaults(
  defineProps<{
    complete?: string
    error?: string
  }>(),
  {
    complete: '已載入所有資料',
    error: '載入時發生錯誤',
  }
)

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

const retry = () => {
  state.value = 'loading'
  onInfinite()
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
