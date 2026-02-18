<template>
  <div
    class="w-[200px] h-[264px] p-2 pb-6 flex flex-col items-center justify-between cursor-pointer relative rounded-[17px] overflow-hidden bg-[rgba(38,38,56,1)]"
    @click="handleOpenTwitter"
  >
    <img
      :src="props.image"
      :alt="props.name"
      class="object-cover size-[184px]"
    >
    <span class="text-lavender text-xl leading-6 tracking-[-0.6px] font-normal">
      {{ props.name }}
    </span>
  </div>
</template>

<script lang="ts" setup>
type Celebrity = {
  name: string
  image: string
  url: string
}
const props = defineProps<Celebrity>()

const handleOpenTwitter = () => {
  //window.open(props.url, '_blank')
}
</script>
