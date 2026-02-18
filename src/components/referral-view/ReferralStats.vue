<script setup lang="ts">
import bgImage from '@/assets/images/staking/lock-cards-bg.png'
import powerIcon from '@/assets/images/bolt.svg'
import type { ReferralData } from '@/types/referral-data'
import { formatNumberToUS } from '@/composables/helpers'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{
	data: ReferralData['referral']
}>()

const stats = computed(() => {
  return [
    {
      label: t('otherComponents.referralStats.totalReferrals'),
      value: props.data.users.total,
      showIcon: false,
    },
    {
      label: t('otherComponents.referralStats.activeReferrals'),
      value: props.data.users.active,
      showIcon: false,
    },
    {
      label: t('otherComponents.referralStats.totalPowerMiles'),
      value: formatNumberToUS(props.data.power),
      showIcon: true,
    },
  ]
})
</script>

<template>
  <div class="flex flex-wrap-reverse md:flex-row md:flex-nowrap gap-2 md:gap-[2px] h-auto">
    <div
      v-for="stat in stats"
      :key="stat.label"
      role="contentinfo"
      :style="`background-image: url(${bgImage});`"
      class="relative tracking-normal flex flex-col justify-between gap-2 rounded-2xl p-4 bg-[#0C0C14] bg-image-flexible w-[228px] h-[144px] bg-no-repeat flex-auto grow-2 md:flex-none"
    >
      <span class="text-lavender font-semibold"> {{ stat.label }} </span>
      <InlineSvg
        v-if="stat.showIcon"
        :src="powerIcon"
        unique-ids
        class="size-10 absolute top-2 right-2"
      />
      <div class="relative">
        <h1 class="text-purple text-5.5xl leading-14 tracking-[-3.36px]">
          {{ stat.value }}
        </h1>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-image-flexible {
	&::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border-radius: 16px;
		opacity: 0.56;
		background: var(--dark-1, #14141f);
		box-shadow: 0px 0px 48px -16px #1c1c29 inset;
		pointer-events: none;
		mix-blend-mode: screen;
		overflow: hidden;
		pointer-events: none;
	}

	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border-radius: 16px;
		border: 1px solid #ffffff0d;
		mix-blend-mode: screen;
		overflow: hidden;
		pointer-events: none;
	}

	background-size: 1005px 548px;

	&:nth-child(1) {
		background-position: -200px -144px;
	}

	&:nth-child(2) {
		background-position: -428px -144px;
	}

	&:nth-child(3) {
		background-position: -656px -144px;
	}
}
</style>
