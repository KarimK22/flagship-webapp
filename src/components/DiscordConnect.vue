<template>
  <div
    :disabled="isConnecting"
    class="bg-[rgba(38,38,56,0.32)] rounded-2xl shadow-[0px_-4px_16px_-2px_rgba(222,206,235,0.04)_inset] overflow-hidden"
  >
    <div
      v-if="isConnected"
      class="flex flex-col"
      :class="{ 'opacity-50 cursor-progress': isConnecting }"
    >
      <div class="flex items-center gap-2 relative px-2 py-2 w-full text-purple-gray bg-[rgba(38,38,56,0.32)] shadow-[0px_-4px_16px_-2px_rgba(222,206,235,0.04)_inset]">
        <InlineSvg
          unique-ids
          :src="discordIcon"
          class="size-12!"
        />
        <div class="flex flex-col items-start gap-0">
          <span class="text-sm ">
            <InlineSvg
              unique-ids
              :src="connectedIcon"
              class="size-4 inline-block"
            />
            {{ isConnecting ? t('otherComponents.discordConnect.loading') : t('otherComponents.discordConnect.connectedToDiscord') }}
          </span>
          <span class="text-base text-light1">@{{ username }}</span>
        </div>
        <div
          class="opacity-100 w-96 h-10 absolute top-0 right-0"
        >
          <div class="w-14 h-10 -right-[28px] -top-[3px] absolute bg-[#33F] rounded-full blur-[16px]" />
          <div class="w-18 h-8 -right-[1px] -top-[28px] absolute bg-[#FF7847] rounded-full blur-[24px]" />
          <div class="w-8 h-4 right-[2px] -top-[8px] absolute bg-[#6D6D8F] rounded-full blur-[8px] mix-blend-plus-lighter" />
        </div>
        <InlineSvg
          unique-ids
          :src="disconnectIcon"
          class="size-8 absolute top-2 right-2 cursor-pointer"
          :aria-label="t('otherComponents.discordConnect.disconnectFromDiscord')"
          :class="{ 'opacity-50 cursor-progress pointer-events-none': isConnecting }"
          @click="disconnect"
        />
      </div>
      <div class="flex flex-col gap-2 p-4">
        <div
          v-if="formattedRoles.length > 0"
          class="text-sm text-purple-gray font-sm"
        >
          {{ t('otherComponents.discordConnect.role') }} <span
            v-for="role in formattedRoles.slice(0, 2)"
            :key="role.id"
            class="text-light1 text-sm font-semibold tracking-[-0.28px] rounded-[40px] border-[#262638] border-[1px] shadow-[0px_0px_56px_-16px_rgba(28,28,41,0.40)_inset] p-1 px-3"
          >{{ role.name }}</span>
          <span
            v-if="formattedRoles.length > 2"
            :aria-label="`${formattedRoles.length - 2} ${t('otherComponents.discordConnect.moreRoles')}`"
            class="text-light1 text-sm font-semibold tracking-[-0.28px] rounded-[40px] border-[#262638] border-[1px] shadow-[0px_0px_56px_-16px_rgba(28,28,41,0.40)_inset] p-1 px-3"
          >+ {{ formattedRoles.length - 2 }}</span>
        </div>
        <div
          v-if="totalPowerMiles <= 0 && formattedRoles.length > 0"
          class="text-sm text-light1"
        >
          {{ t('otherComponents.discordConnect.getRolesToEarn', { roles: validRoles.map(role => role.name).join(', ') }) }}
        </div>
        <div
          v-else-if="formattedRoles.length > 0"
          class="text-base text-light1"
        >
          {{ t('otherComponents.discordConnect.powerMilesDaily', { amount: totalPowerMiles }) }}
          <InlineSvg
            unique-ids
            :src="powerMilesIcon"
            class="size-6 inline-block"
          />
        </div>
        <span
          v-else
          class="text-base text-light1"
          v-html="t('otherComponents.discordConnect.joinDiscord')"
        />
      </div>
    </div>
    <div
      v-else
      class="flex items-center gap-2 px-2 py-2 w-full cursor-pointer text-purple-gray"
      @click="handleClick"
    >
      <InlineSvg
        unique-ids
        :src="discordIcon"
        class="size-12!"
      />
      <span v-if="isConnected">{{ t('otherComponents.discordConnect.connectedToDiscord') }}</span>
      <span v-else-if="isConnecting">{{ t('otherComponents.discordConnect.connecting') }}</span>
      <span v-else>{{ t('otherComponents.discordConnect.connectToDiscord') }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import InlineSvg from 'vue-inline-svg'
import discordIcon from '@/assets/icons/discord-connect.svg'
import disconnectIcon from '@/assets/icons/disconnect-social.svg'
import connectedIcon from '@/assets/icons/connect-checked.svg'
import { useDiscord } from '@/composables/use-discord'
import powerMilesIcon from '@/assets/images/game/power.svg'
import { validRoles } from '@/const/social-connect'
import { useI18n } from 'vue-i18n'

const {
  isConnected,
  isConnecting,
  connect,
  username,
  totalPowerMiles,
  formattedRoles,
  disconnect,
} = useDiscord()

const { t } = useI18n()

const handleClick = async () => {
  connect()
}
</script>
