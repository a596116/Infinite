/**
 *  IntersectionObserver
 */
export const useIntersectionObserver = () => {
  const targetRef = ref<HTMLElement | null>(null)
  let observer: IntersectionObserver | null = null

  /**
   * @description: 觀察目標元素
   * @param {function} callback 觀察到目標元素時的回調函數
   * @param {IntersectionObserverInit} options 觀察者選項
   */
  const observe = (
    callback: () => void,
    options: IntersectionObserverInit = {}
  ) => {
    // 如果觀察者存在，則斷開觀察
    if (observer) {
      observer.disconnect()
    }

    const defaultOptions = {
      root: null,
      threshold: 0.8,
      ...options,
    }

    // 創建觀察者
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && callback) {
          callback()
        }
      })
    }, defaultOptions)

    // 如果目標元素存在，則觀察目標元素
    if (targetRef.value) {
      observer.observe(targetRef.value)
    }
  }

  /**
   * @description: 斷開觀察，釋放觀察者
   */
  const disconnect = () => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  }

  const unobserve = () => {
    if (observer && targetRef.value) {
      observer.unobserve(targetRef.value)
    }
  }

  // 監聽目標元素變化，如果目標元素存在，則觀察目標元素
  watchEffect(() => {
    if (targetRef.value && observer) {
      observer.observe(targetRef.value)
    }
  })

  // 卸載時斷開觀察
  onUnmounted(() => {
    disconnect()
  })

  return {
    targetRef,
    observe,
    disconnect,
    unobserve,
  }
}
