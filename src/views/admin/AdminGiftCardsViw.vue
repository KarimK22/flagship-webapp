<script setup lang="ts">
import { useTranslation } from '@/composables/use-i18n'
import { BaseButton } from '@/components/ui/button'
import { ref, watch } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { BaseInput } from '@/components/ui/input'
import { callApi } from '@/services/call-api.ts'

const { t } = useTranslation()
const authCode = useLocalStorage('admin.authCode', '')
const typedAuthCode = ref('')
const action = ref('')
const newGiftCards = ref('')
const csvConfig = ref('')
const usedFor = ref('')
const error = ref('')
const success = ref('')
const generateCount = ref('1')

const summary = ref<{ value: number, count: number }[]>([])

function submitAuthCode() {
  authCode.value = typedAuthCode.value
}

async function addGiftCards() {
  error.value = ''
  success.value = ''
  const rows = newGiftCards.value.split('\n').map(row => row.trim()).filter(Boolean).map(line => line.split(/[;,]/))
  const codeHeaderPosition = rows[0].indexOf('Code')
  const valueHeaderPosition = rows[0].indexOf('Value')
  const giftCardsToAdd = rows.slice(1).map(row => ({ code: row[codeHeaderPosition], value: parseInt(row[valueHeaderPosition]) }))
  const response = await callApi<{ success: boolean, message: string }>({
    body: {
      giftCards: giftCardsToAdd,
      forceAdd: false,
    },
    path: `/api/admin/gift-card/add`,
    headers: {
      'x-admin-token': authCode.value,
    },
    method: 'POST',
  })
  if (!response.success) {
    error.value = response.message
    return
  }
  await fetchSummary()
  success.value = response.message
  newGiftCards.value = ''
}

async function generateCsv() {
  error.value = ''
  success.value = ''
  const rows = csvConfig.value.split('\n').map(row => row.trim()).filter(Boolean).map(line => line.split(' ')).map(row => ({ value: parseInt(row[0].replace('$', '')), quantity: parseInt(row[1]) }))

  const count = Number(generateCount.value)
  for (let i = 0; i < count; i++) {
    const response = await callApi<{ success: false, message: string } | { success: true, rows: { code: string, value: number }[] }>({
      body: {
        config: rows,
        usedFor: usedFor.value,
      },
      path: `/api/admin/gift-card/generate-csv`,
      headers: {
        'x-admin-token': authCode.value,
      },
      method: 'POST',
    })
    if (!response.success) {
      error.value = response.message
      return
    }
    download(`gift-cards-${usedFor.value}.csv`, ['code,value', ...response.rows.map(row => `${row.code},${row.value}`)].join('\n'))
    await fetchSummary()
  }
  success.value = `${t('views.admin.giftCards.filesGenerated')}${count > 1 ? t('views.admin.giftCards.filesGeneratedPlural') : ''}`
}

async function fetchSummary() {
  const response = await callApi<{ summary: { count: number, value: number }[] }>({
    path: `/api/admin/gift-card/summary`,
    headers: {
      'x-admin-token': authCode.value,
    },
    method: 'GET',
  })
  summary.value = response.summary
}

function download(filename: string, text: string) {
  const element = document.createElement('a')
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
  element.setAttribute('download', filename)

  element.style.display = 'none'
  document.body.appendChild(element)

  element.click()

  document.body.removeChild(element)
}

watch(authCode, fetchSummary,  { immediate: true })
</script>

<template>
  <div
    class="p-10 bg-white"
    style="color: black"
  >
    <div v-if="!authCode">
      <BaseInput
        v-model="typedAuthCode"
        :label="t('views.admin.giftCards.token')"
      />
      <BaseButton @click="submitAuthCode">
        {{ t('views.admin.giftCards.save') }}
      </BaseButton>
    </div>
    <div v-else>
      <div>
        <h1>{{ t('views.admin.giftCards.summary') }}</h1>
        <div
          v-for="row in summary"
          :key="row.value"
        >
          ${{ row.value }}: {{ row.count }}
        </div>
        <div
          v-if="error"
          style="color: red"
        >
          {{ error }}
        </div>
        <div
          v-if="success"
          style="color: green"
        >
          {{ success }}
        </div>
      </div>

      <h2>{{ t('views.admin.giftCards.whatToDo') }}</h2>
      <BaseButton @click="action = 'add'">
        {{ t('views.admin.giftCards.add') }}
      </BaseButton>
      <BaseButton @click="action = 'generate'">
        {{ t('views.admin.giftCards.generateCsv') }}
      </BaseButton>
      <div v-if="action === 'add'">
        <textarea
          v-model="newGiftCards"
          cols="50"
          rows="20"
          style="background-color: white; color: black"
        />
        <BaseButton @click="addGiftCards">
          {{ t('views.admin.giftCards.add') }}
        </BaseButton>
      </div>
      <div v-if="action === 'generate'">
        <textarea
          v-model="csvConfig"
          cols="50"
          rows="20"
          style="background-color: white; color: black"
        />
        <BaseInput
          v-model="generateCount"
          :label="t('views.admin.giftCards.count')"
        />
        <BaseInput
          v-model="usedFor"
          :label="t('views.admin.giftCards.usedFor')"
        />

        <BaseButton @click="generateCsv">
          {{ t('views.admin.giftCards.generateCsvButton') }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
