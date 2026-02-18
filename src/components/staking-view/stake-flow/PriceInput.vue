<script setup lang="ts">
import { BaseButton as Button } from '@/components/ui/button'
import lingoIcon from '@/assets/images/game/points-processed.svg'
import dollarIcon from '@/assets/images/dollar-icon.svg'
import lockIcon from '@/assets/images/staking/lock-icon.svg'
import bg from '@/assets/images/textures/confirm-bg.png'
import InlineSvg from 'vue-inline-svg'
import { computed } from 'vue'
import { useLingoPrice } from '@/composables/contracts/lingo-price'
import { useBalance } from '@/composables/contracts/balance'
import { formatNumberToUS } from '@/composables/helpers'

defineProps<{
	isStatic?: boolean
	disabled?: boolean
}>()

const { price } = useLingoPrice()
const { tokenBalanceAsString: userBalance } = useBalance()
const amount = defineModel<string>({ required: true, default: '0' })
const amountInFiat = computed(() => {
  return Number(amount.value) * price.value
})

const handleSetMax = () => {
  amount.value = String(userBalance.value)
}

const handleInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  const value = input.value
  amount.value = value
}
</script>

<template>
  <div
    :style="{ backgroundImage: `url(${bg})` }"
    class="relative flex flex-col bg-cover bg-center p-4 pb-1 bg-[#14141F] overflow-clip"
    :class="{ 'rounded-2xl pb-4 h-[152px] justify-end border-[2px_solid_#2A2A3D]': isStatic }"
  >
    <div
      class="flex flex-col gap-6 w-full z-1 max-h-24"
      :class="{ '!gap-0': isStatic }"
    >
      <div
        class="flex justify-between w-full text-sm text-purple-gray tracking-[0.42px] font-semibold"
        :class="{ 'justify-center': isStatic }"
      >
        <div>
          {{ $t('common.amount') }} <InlineSvg
            :src="dollarIcon"
            class="size-6 inline"
            unique-ids="dollar-icon"
          />
          <span class="text-lavender">${{ formatNumberToUS(amountInFiat) }} USD</span>
        </div>
        <div v-if="!isStatic && !disabled">
          {{ $t('common.available') }} - <span class="text-lavender">{{ formatNumberToUS(userBalance) }}</span>
        </div>
      </div>
      <div
        class="flex justify-between w-full"
        :class="{ 'justify-center': isStatic }"
      >
        <div class="relative flex items-center justify-center gap-2 w-full leading-0 h-10 text-5.5xl overflow-clip">
          <InlineSvg
            :src="lingoIcon"
            class="size-10 flex-shrink-0"
            unique-ids="lingo-icon"
          />
          <input
            v-if="!isStatic && !disabled"
            id="amount-input"
            type="number"
            class="h-min text-lavender tracking-[-2.8px] bg-transparent outline-none w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            :value="amount"
            @input="handleInput"
          >
          <span
            v-if="isStatic || disabled"
            class="text-5.5xl leading-10 text-lavender tracking-[-2.8px]"
            :class="{ 'w-full flex items-center gap-2': disabled }"
          >
            {{ formatNumberToUS(amount) }}
            <InlineSvg
              v-if="disabled"
              :src="lockIcon"
              class="size-10"
              unique-ids="lock-icon"
            />
          </span>
        </div>
        <div
          v-if="!isStatic && !disabled"
          class="flex items-center"
        >
          <Button
            class="text-sm text-white border-[1px] border-purple-gray rounded-full px-6 py-2 h-10 bg-transparent"
            @click="handleSetMax"
          >
            Max
          </Button>
        </div>
      </div>
    </div>
    <span
      class="text-flare h-0 text-5.5xl text-lavender tracking-[-2.8px] absolute"
      aria-hidden="true"
      tabindex="-1"
      :class="{ center: isStatic }"
    ><i /> {{ amount }}</span>
    <div
      class="lights"
      aria-hidden="true"
      tabindex="-1"
      :class="{ center: isStatic }"
    >
      <div
        v-if="isStatic"
        class="lights-border"
      />
    </div>
  </div>
</template>

<style scoped>
.text-flare {
	top: 172px;
	left: 64px;
	filter: blur(3px);
	transform: rotateX(175deg);
	width: 100%;
	text-shadow: 0 0 0px #ffffff, 0 0 10px #c95cff, 0 0 20px #c95cff, 0 0 30px #3333ff, 0 0 40px #3333ff, 0 0 50px #3333ff;
	pointer-events: none;
	z-index: 1;
}

.text-flare i {
	display: block;
	position: absolute;
	left: -42px;
	top: 25px;
	width: 30px;
	height: 30px;
	background: #c95cff;
	border-radius: 50%;
	opacity: 0.8;
	mix-blend-mode: screen;
	filter: blur(4px);
}

.text-flare.center {
	top: unset;
	bottom: -54px;
	left: calc(50% + 22px);
	width: auto;
	transform: translateX(-50%) rotateX(175deg);
	opacity: 0.6;
	filter: blur(10px);
}

.lights {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: #00000059;
}

.lights-border {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: calc(100% - 1.5px);
	height: calc(100% - 1.5px);
	border-radius: 16px;
}

.lights-border::after {
	content: "";
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: calc(100% - 2px);
	height: calc(100% - 2px);
	border-radius: inherit;
	padding: 1px; /* control the border thickness */
	background: linear-gradient(90deg, rgba(0, 0, 0, 0.33), rgba(255, 255, 255, 0.107), rgba(0, 0, 0, 0.33));
	mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
	-webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
	-webkit-mask-composite: xor;
	mask-composite: exclude;
	mix-blend-mode: color;
	pointer-events: none;
}

.lights::after {
	content: "";
	position: absolute;
	top: 50%;
	left: 0;
	width: 570px;
	height: 270px;
	background: #c95cff;
	border-radius: 560px;
	opacity: 0.16;
	mix-blend-mode: screen;
	filter: blur(40px);
	pointer-events: none;
}

.lights.center::after {
	mix-blend-mode: soft-light;
	left: 12%;
	top: 70px;
}

.lights.center {
	opacity: 0.8;
	background: #00000038;
}

.lights::before {
	content: "";
	position: absolute;
	top: 50%;
	left: 10px;
	width: 244px;
	height: 270px;
	border-radius: 270px;
	opacity: 0.8;
	background: #3333ff;
	mix-blend-mode: screen;
	filter: blur(68px);
	pointer-events: none;
}

.lights.center::before {
	mix-blend-mode: soft-light;
	opacity: 0.4;
	left: 16%;
	top: 40px;
}
</style>
