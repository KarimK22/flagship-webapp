<template>
  <BaseModal
    :model-value="modelValue"
    class="p-2 pt-4 md:p-4 md:pt-8 gap-0 !rounded-2xl w-[96vw] md:w-auto !max-w-[none] max-h-[96vh] md:max-h-[90%] h-auto"
    @update:model-value="updateModelValue"
  >
    <!-- Content (with higher z-index) -->
    <div class="z-10">
      <component
        :is="help.component"
        :current-level="currentLevel"
      />
    </div>
    <template
      v-if="help.showFooter"
      #footer
    >
      <div class="p-4 pt-0 w-full flex justify-center mt-4 md:mt-9">
        <GlowButton
          :color="EButtonColor.ORANGE"
          class="w-[127px]"
          @click="updateModelValue(false)"
        >
          <span>{{ t('modals.helpModal.gotIt') }}</span>
        </GlowButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from '@/components/ui/dialog/BaseModal.vue'
import { EButtonColor } from '@/types/shared/button'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import { EHelpType } from '@/types/staking'
import HowPowerMilesWorks from '@/components/help-modal/HowPowerMilesWorks.vue'
import WhatRewardsCanIWin from '@/components/help-modal/WhatRewardsCanIWin.vue'
import MyLevel from '@/components/help-modal/MyLevel.vue'
import PlayAndEarnNonstop from '@/components/help-modal/PlayAndEarnNonstop.vue'
import WhatIsAPY from '@/components/help-modal/WhatIsAPY.vue'
import BoostYourAverageAPY from '@/components/help-modal/BoostYourAverageAPY.vue'
import { useI18n } from 'vue-i18n'
import ElementsSix from './ElementsSix.vue'
import StakingWheelInfo from './StakingWheelInfo.vue'
import TieredStakingWheelInfo from './TieredStakingWheelInfo.vue'

const { t } = useI18n()

const props = defineProps<{
	helpType: EHelpType
	modelValue: boolean
	currentLevel?: number
}>()

const emit = defineEmits<{
	(e: 'update:modelValue', value: boolean): void
}>()

const updateModelValue = (val: boolean) => {
  emit('update:modelValue', val)
}

const helpMap = {
  [EHelpType.HOW_POWER_MILES_WORK]: {
    component: HowPowerMilesWorks,
    showFooter: true,
  },
  [EHelpType.WHAT_REWARDS_CAN_I_WIN]: {
    component: WhatRewardsCanIWin,
    showFooter: true,
  },
  [EHelpType.MY_LEVEL_INFO]: {
    component: MyLevel,
    showFooter: false,
  },
  [EHelpType.APY_PLAN_AND_EARN_NONSTOP]: {
    component: PlayAndEarnNonstop,
    showFooter: true,
  },
  [EHelpType.APY_WHAT_IS_APY]: {
    component: WhatIsAPY,
    showFooter: true,
  },
  [EHelpType.APY_BOOST_YOUR_APY]: {
    component: BoostYourAverageAPY,
    showFooter: true,
  },
  [EHelpType.ELEMENTS]: {
    component: ElementsSix,
    showFooter: true,
  },
  [EHelpType.WHEEL_INFO]: {
    component: StakingWheelInfo,
    showFooter: true,
  },
  [EHelpType.TIERED_WHEEL_INFO]: {
    component: TieredStakingWheelInfo,
    showFooter: true,
  },
}
const help = helpMap[props.helpType]
</script>
