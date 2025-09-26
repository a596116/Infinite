<template>
  <main class="py-8 min-h-screen bg-gray-50">
    <div class="flex flex-col gap-4 mx-auto max-w-4xl">
      <h1 class="text-3xl font-bold text-center">Github</h1>

      <!-- 列表 -->
      <ul class="flex flex-col gap-4">
        <li
          v-for="repo in repos"
          :key="repo.id"
          class="overflow-hidden bg-white rounded-lg shadow-md transition-shadow duration-200 hover:shadow-lg group"
        >
          <NuxtLink
            :href="repo.html_url"
            target="_blank"
            class="flex flex-col gap-3 p-6 transition-colors duration-200"
          >
            <h2
              class="text-xl font-semibold text-gray-900 transition-colors group-hover:text-blue-600"
            >
              {{ repo.name }}
            </h2>

            <p v-if="repo.description" class="text-gray-600">
              {{ repo.description }}
            </p>
          </NuxtLink>
        </li>

        <!-- 無限載入組件 -->
        <InfiniteLoading v-if="repos.length > 0" @on-infinite="onInfinite" />
      </ul>
    </div>
  </main>
</template>

<script setup lang="ts">
import type { InfiniteState } from '~/types'

interface Repo {
  id: number
  html_url: string
  name: string
  description: string
}

const repos = ref<Repo[]>([])
const page = ref(1)

// 頁數
const INITIAL_LOAD = 30
const LOAD_MORE = 10

/*
 * @description: 獲取github repos數據
 */
const fetchRepos = async (isLoadMore = false) => {
  const perPage = isLoadMore ? LOAD_MORE : INITIAL_LOAD
  const currentPage = isLoadMore ? page.value + 1 : 1

  const githubToken = useRuntimeConfig().public.githubToken
  const options = {
    query: {
      page: currentPage,
      per_page: perPage,
      sort: 'updated',
      direction: 'desc',
    },
    headers: {
      Authorization: `Bearer ${githubToken}`,
    },
  }

  return await fetch(`https://api.github.com/users/octocat/repos`, options)
    .then((res) => res.json())
    .then((data) => {
      repos.value = isLoadMore ? [...repos.value, ...data] : data

      page.value = currentPage
      return data
    })
    .catch((err) => {
      console.error(err)
    })
}

/*
 * @description: 無限載入
 */
const onInfinite = async (infiniteState: InfiniteState) => {
  try {
    const res = await fetchRepos(true)

    if (res.length === 0 || res.length < LOAD_MORE) {
      // 沒有更多資料了
      infiniteState.complete()
    } else {
      // 載入完成，準備下次載入
      infiniteState.loaded()
    }
  } catch (err) {
    // 載入失敗
    console.error('載入更多資料失敗:', err)
    infiniteState.error()
  }
}

onMounted(async () => {
  await fetchRepos()
})

useSeoMeta({
  title: '無線滾動',
})
</script>
