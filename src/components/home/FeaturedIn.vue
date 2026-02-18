<template>
  <section class="flex flex-col gap-0 w-full justify-center items-center">
    <h2 class="text-lavender text-[32px] font-normal leading-8 tracking-[-1.28px] mb-10 md:mb-14">
      {{ $t('components.featuredIn.title') }}
    </h2>
    <div class="flex flex-col md:flex-row gap-8 md:gap-4 lg:gap-[55px] justify-center items-center flex-wrap">
      <div
        v-for="item in items"
        :key="item.id"
        class="cursor-pointer"
        :class="item.class"
        @click="handleClick(item.link)"
      >
        <InlineSvg
          :unique-id="item.id"
          :src="item.src"
          :class="item.class"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import forbes from '@/assets/images/home/featured-in/forbes.svg'
import cointelegraph from '@/assets/images/home/featured-in/cointelegraph.svg'
import entrepreneur from '@/assets/images/home/featured-in/entrepreneur.svg'
import beincrypto from '@/assets/images/home/featured-in/beincrypto.svg'

const items = [
  {
    id: 'cointelegraph',
    src: cointelegraph,
    class: 'w-[256px] md:w-[370px]',
    link: 'https://fr.cointelegraph.com/press-releases/lingo-the-web3-start-up-that-is-revolutionizing-the-travel-industry-and-its-rewards',
  },
  {
    id: 'entrepreneur',
    src: entrepreneur,
    class: 'w-[256px] md:w-[286px]',
    link: 'https://www.entrepreneur.com/en-au/technology/how-lingo-is-disrupting-loyalty-rewards-using-blockchain/456964',
  },
  {
    id: 'forbes',
    src: forbes,
    class: 'w-[168px] md:w-[168px]',
    link: 'https://www.forbes.com/sites/katevitasek/2023/08/29/4-natural-non-intrusive-ways-to-better-engage-your-business-community/?sh=51406f556d55',
  },
  {
    id: 'beincrypto',
    src: beincrypto,
    class: 'w-[256px] md:w-[286px]',
    link: 'https://beincrypto.com/lingo-has-signed-partnerships-with-over-100-brand-ambassador/',
  },
]

const handleClick = (link: string) => {
  window.open(link, '_blank')
}
</script>
