<template>
  <BaseModal
    :model-value="modelValue"
    class="p-2 pt-4 md:p-4 md:pt-8 gap-0 !rounded-2xl w-[96vw] md:w-[420px] !max-w-[none] max-h-[96vh] md:max-h-[90%] h-auto"
    description=" "
    @update:model-value="updateModelValue"
  >
    <!-- Content (with higher z-index) -->
    <template #header>
      <div class="pr-10">
        <div
          v-if="isError"
          class="flex flex-col gap-2"
        >
          <h1
            class="text-[#FF7847] text-[32px] leading-7 font-medium tracking-[-1.28px] select-none"
          >
            {{ t('modals.discord.oops') }}
          </h1>
          <h1
            class="text-lavender text-[32px] leading-7 font-medium tracking-[-1.28px] select-none"
          >
            {{ t('modals.discord.somethingWentWrong') }}
          </h1>
        </div>
        <h1
          v-else-if="isConnecting"
          class="text-lavender text-left text-3xl md:text-[32px] leading-6 md:leading-7 font-medium tracking-[-1.28px]"
        >
          {{ t('modals.discord.connecting') }}
        </h1>
        <h1
          v-else-if="isConnected"
          class="text-lavender text-left text-4xl md:text-[48px] leading-8 md:leading-10 font-medium tracking-[-2.4px]"
        >
          {{ t('modals.discord.successfullyConnected') }}
        </h1>
        <h1
          v-else
          class="text-lavender text-left text-4xl md:text-[48px] leading-8 md:leading-10 font-medium tracking-[-2.4px]"
        >
          {{ t('modals.discord.somethingWentWrong') }}
        </h1>
      </div>
    </template>
    <template #description>
      <div class="max-w-full">
        <Transition name="grow">
          <div
            v-if="isError"
            class="text-purple-gray text-xl leading-6 font-normal tracking-[-0.6px] pr-10"
          >
            <span v-if="errorMessage">
              {{ errorMessage }}
            </span>
          </div>
        </Transition>
        <Transition name="grow">
          <div
            v-if="isConnected && !isConnecting && !isError"
            class="text-lavender text-xl leading-6 font-normal tracking-[-0.6px] pr-10 pt-4"
          >
            <span v-if="roles.length === 0">
              {{ t('modals.discord.joinCommunity') }}
              <span class="text-[#FF9D5C]">{{ t('modals.discord.powerMilesPerDay') }}</span>,
              {{ t('modals.discord.dependingOnRoles') }}
            </span>
            <span
              v-else-if="currentPowerMiles > 0"
              class="whitespace-pre-line"
            >
              {{ t('modals.discord.youllEarn') }} <span class="text-[#FF9D5C]">{{ currentPowerMiles }} {{ t('modals.discord.powerMilesDaily') }}</span> {{ t('modals.discord.basedOnRoles') }}
              <br>
              {{ t('modals.discord.wantEvenMore') }}
              <span class="text-[#FF9D5C]">{{ nonOwnedRoles.map((role) => role.name).join(', ') }}</span>
              {{ t('modals.discord.rolesToEarn') }}  {{ possiblePowerMiles }} {{ t('modals.discord.powerMilesDailyExtra') }}
            </span>
            <span
              v-else
              class="whitespace-pre-line"
            >
              {{ t('modals.discord.holdAnyRoles') }}
              <span class="text-[#FF9D5C]">{{ t('modals.discord.powerMilesPerRole') }}</span> {{ t('modals.discord.perRole') }}\n
              <span class="text-[#FF9D5C]">{{
                nonOwnedRoles.map((role) => role.name).join(', ')
              }}</span>
            </span>
          </div>
        </Transition>
      </div>
    </template>
    <template #footer>
      <div
        v-if="isError"
        class="p-0 pb-3.5 mt-8"
      >
        <GlowButton
          :color="EButtonColor.ORANGE"
          class="flex items-center w-[388px] gap-2"
          @click="handleClose"
        >
          <span> {{ t('modals.discord.close') }} </span>
        </GlowButton>
      </div>
      <div
        v-if="!isError"
        class="p-0 pb-3.5 mt-8 relative h-11 w-full"
      >
        <Transition name="left-to-right">
          <GlowButton
            v-if="delayedIsConnected"
            :color="EButtonColor.BLUE"
            class="w-full absolute right-0"
            @click="handleContinue"
          >
            <span>
              {{ roles.length > 0 ? t('modals.discord.gotIt') : t('modals.discord.joinLingoOnDiscord') }}
            </span>
          </GlowButton>
        </Transition>
        <Transition name="left-to-right">
          <div
            v-if="!delayedIsConnected"
            class="w-full absolute right-0"
          >
            <ol class="space-y-1">
              <li
                class="p-1 pl-4 h-10 relative rounded-full flex justify-between items-center overflow-hidden"
              >
                <div
                  :class="{
                    'bg-[rgba(38,38,56,0.72)] opacity-100': isConnected,
                  }"
                  class="opacity-80 inset-shadow-[0px_-4px_16px_-2px_rgba(222,_206,_235,_0.08)] bg-[rgba(38,38,56,0.32)] rounded-full absolute top-0 left-0 w-full h-full"
                />
                <span
                  :class="{ 'text-lavender!': isConnected }"
                  class="text-purple-gray z-1 text-base leading-5 font-semibold tracking-[-0.6px]"
                >{{ `${isConnected ? t('modals.discord.connected') : t('modals.discord.inProgress')}` }}</span>
                <div class="flex items-center">
                  <div
                    :class="{ 'opacity-100': isConnected }"
                    class="opacity-0 w-96 h-10 absolute top-0 right-0"
                  >
                    <div
                      class="w-14 h-10 -right-[28px] -top-[3px] absolute bg-[#33F] rounded-full blur-[16px]"
                    />
                    <div
                      class="w-18 h-8 -right-[1px] -top-[28px] absolute bg-[#FF7847] rounded-full blur-[24px]"
                    />
                    <div
                      class="w-8 h-4 right-[2px] -top-[8px] absolute bg-[#6D6D8F] rounded-full blur-[8px] mix-blend-plus-lighter"
                    />
                  </div>
                  <InlineSvg
                    v-if="isConnected"
                    :src="successIcon"
                    class="size-8 z-10"
                  />
                  <InlineSvg
                    v-else-if="isConnecting"
                    class="animate-[spin_2s_linear_infinite_reverse] size-4 m-3 z-10"
                    :src="loaderIcon"
                  />
                </div>
              </li>
            </ol>
          </div>
        </Transition>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from '@/components/ui/dialog/BaseModal.vue'
import { EButtonColor } from '@/types/shared/button'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import loaderIcon from '@/assets/icons/loader-lg.svg'
import successIcon from '@/assets/icons/checkmark.svg'
import InlineSvg from 'vue-inline-svg'
import { computed, ref, watch } from 'vue'
import { validRoles } from '@/const/social-connect'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps<{
  modelValue: boolean
  isConnected: boolean
  isConnecting: boolean
  isError: boolean
  errorMessage?: string
  roles: {
    powerMiles: number
    name: string
    id: string
  }[]
}>()

const nonOwnedRoles = computed(() => {
  return validRoles.filter((role) => !props.roles.some((r) => r.id === role.id))
})

const currentPowerMiles = computed(() => {
  return props.roles.reduce((acc, role) => acc + role.powerMiles, 0)
})

const possiblePowerMiles = computed(() => {
  return nonOwnedRoles.value.reduce((acc, role) => acc + role.powerMiles, 0)
})

const delayedIsConnected = ref(false)

watch(
  () => props.isConnected,
  (newVal) => {
    if (newVal) {
      setTimeout(() => {
        delayedIsConnected.value = true
      }, 1000)
    }
  },
  { immediate: true },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const handleClose = () => {
  // clean up the url
  window.history.replaceState({}, '', window.location.pathname)
  emit('update:modelValue', false)
}

const handleContinue = () => {
  if (props.roles.length > 0) {
    handleClose()
  } else {
    openDiscord()
  }
}

const openDiscord = () => {
  window.open('https://discord.com/invite/lingo', '_blank')
}

const updateModelValue = (val: boolean) => {
  emit('update:modelValue', val)
}
</script>

<style scoped>
.left-to-right-enter-active,
.left-to-right-leave-active {
  transition: all 0.5s ease;
}

.left-to-right-enter-from {
  opacity: 0;
  transform: translateX(-500px);
}

.left-to-right-leave-to {
  opacity: 0;
  transform: translateX(-500px);
}

.grow-enter-active,
.grow-leave-active {
  transition: all 0.5s ease;
  overflow: hidden;
}

.grow-enter-from {
  opacity: 0;
  max-height: 0;
}

.grow-enter-to {
  opacity: 1;
  max-height: 200px;
}

.grow-leave-from {
  opacity: 1;
  max-height: 200px;
}

.grow-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>
