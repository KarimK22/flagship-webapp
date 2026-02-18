<script setup lang="ts">
import { LingoRouteName, lingoRoutePath } from '@/router/routes'

defineProps<{
  isMobile?: boolean
}>()
const emit = defineEmits<{
  (e: 'navigate'): void
}>()

const navigationItems = [
  { name: LingoRouteName.HOME, href: lingoRoutePath[LingoRouteName.HOME], label: 'navigation.play' },
  {
    name: LingoRouteName.REWARDS,
    href: lingoRoutePath[LingoRouteName.REWARDS],
    label: 'navigation.rewards',
  },
  {
    name: LingoRouteName.STAKING,
    href: lingoRoutePath[LingoRouteName.STAKING],
    label: 'navigation.staking',
  },
  { name: LingoRouteName.CLAIM, href: lingoRoutePath[LingoRouteName.CLAIM], label: 'navigation.claim' },
  { name: LingoRouteName.REFERRALS, href: lingoRoutePath[LingoRouteName.REFERRALS], label: 'navigation.referrals' },
  { name: LingoRouteName.MEMBERSHIP, href: lingoRoutePath[LingoRouteName.MEMBERSHIP], label: 'navigation.membership' },
]
</script>

<template>
  <!-- Desktop Navigation -->
  <nav
    v-if="!isMobile"
    class="flex gap-x-8"
  >
    <router-link
      v-for="item in navigationItems"
      :key="item.name"
      :to="item.href"
      active-class="active !text-lavender"
      class="text-[14px] font-semibold transition-colors text-purple-gray hover:text-light1 navigation-underline navigation-underline--full tracking-[0.05em]"
    >
      {{ $t(item.label) }}
    </router-link>
  </nav>

  <!-- Mobile Navigation -->
  <nav
    v-else
    class="mt-0 mb-6 flex flex-col items-start gap-y-4"
  >
    <router-link
      v-for="item in navigationItems"
      :key="item.name"
      :to="item.href"
      active-class="active !text-lavender"
      class="text-[14px] font-semibold transition-colors text-purple-gray hover:text-light1 navigation-underline navigation-underline--full tracking-[0.05em]"
      @click="emit('navigate')"
    >
      {{ $t(item.label) }}
    </router-link>
  </nav>
</template>
