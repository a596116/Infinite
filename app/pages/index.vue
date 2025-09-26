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

/*
 * @description: 獲取github repos數據
 */
const fetchRepos = async () => {
  const per_page = INITIAL_LOAD

  const githubToken = useRuntimeConfig().public.githubToken
  const options = {
    query: {
      page: page.value,
      per_page: per_page,
      sort: 'updated',
      direction: 'desc',
    },
    headers: {
      Authorization: `Bearer ${githubToken}`,
    },
  }

  await fetch(`https://api.github.com/users/octocat/repos`, options)
    .then((res) => res.json())
    .then((data) => {
      repos.value = data
    })
    .catch((err) => {
      console.error(err)
    })
}

const onInfinite = (infiniteState) => {
  console.log('onInfinite', infiniteState)
}

onMounted(() => {
  fetchRepos()
})

useSeoMeta({
  title: '無線滾動',
})
</script>
