import { createRouter, createWebHistory } from 'vue-router'
import { LingoRouteName, lingoRoutePath } from './routes'

const routes = [
  {
    path: lingoRoutePath[LingoRouteName.HOME],
    name: LingoRouteName.HOME,
    component: () => import('@/views/HomeView.vue'),
  },
  {
    path: lingoRoutePath[LingoRouteName.FAQ],
    name: LingoRouteName.FAQ,
    component: () => import('@/views/FAQView.vue'),
  },
  {
    path: lingoRoutePath[LingoRouteName.TERMS_OF_SERVICE],
    name: LingoRouteName.TERMS_OF_SERVICE,
    component: () => import('@/views/TermsOfServiceView.vue'),
  },
  {
    path: lingoRoutePath[LingoRouteName.PRIVACY_POLICY],
    name: LingoRouteName.PRIVACY_POLICY,
    component: () => import('@/views/PrivacyPolicyView.vue'),
  },
  {
    path: lingoRoutePath[LingoRouteName.CLAIM],
    meta: {
      hasContainer: true,
    },
    children: [
      {
        path: lingoRoutePath[LingoRouteName.CLAIM],
        name: LingoRouteName.CLAIM,
        component: () => import('@/views/ClaimView.vue'),
      },
      {
        path: lingoRoutePath[LingoRouteName.CLAIM_WIZARD],
        name: LingoRouteName.CLAIM_WIZARD,
        component: () => import('@/views/ClaimWizardView.vue'),
      },
      {
        path: lingoRoutePath[LingoRouteName.CLAIM_CONFIRM],
        name: LingoRouteName.CLAIM_CONFIRM,
        component: () => import('@/views/ClaimConfirmView.vue'),
      },
    ],
  },
  {
    path: lingoRoutePath[LingoRouteName.STAKING],
    children: [
      {
        path: lingoRoutePath[LingoRouteName.STAKING],
        name: LingoRouteName.STAKING,
        component: () => import('@/views/StakingView.vue'),
      },
      {
        path: lingoRoutePath[LingoRouteName.STAKING_NEW],
        name: LingoRouteName.STAKING_NEW,
        component: () => import('@/views/StakingNewView.vue'),
      },
      {
        path: lingoRoutePath[LingoRouteName.STAKING_UPGRADE],
        name: LingoRouteName.STAKING_UPGRADE,
        component: () => import('@/views/StakingUpgradeView.vue'),
      },
      {
        path: lingoRoutePath[LingoRouteName.STAKING_CLAIM],
        name: LingoRouteName.STAKING_CLAIM,
        component: () => import('@/views/StakingClaimView.vue'),
      },
    ],
    meta: {
      hasContainer: true,
      isWide: true,
    },
  },
  {
    path: lingoRoutePath[LingoRouteName.REWARDS],
    name: LingoRouteName.REWARDS,
    component: () => import('@/views/RewardsView.vue'),
  },
  {
    path: lingoRoutePath[LingoRouteName.BUY],
    name: LingoRouteName.BUY,
    component: () => import('@/views/BuyView.vue'),
  },
  {
    path: lingoRoutePath[LingoRouteName.BRIDGE],
    name: LingoRouteName.BRIDGE,
    component: () => import('@/views/BridgeView.vue'),
  },
  {
    path: lingoRoutePath[LingoRouteName.REFERRALS],
    name: LingoRouteName.REFERRALS,
    component: () => import('@/views/ReferralsView.vue'),
  },
  {
    path: lingoRoutePath[LingoRouteName.ADMIN_TOOLS],
    name: LingoRouteName.ADMIN_TOOLS,
    component: () => import('@/views/admin/AdminWalletAddressFormatterView.vue'),
  },
  {
    path: lingoRoutePath[LingoRouteName.ADMIN_GIFT_CARDS],
    name: LingoRouteName.ADMIN_GIFT_CARDS,
    component: () => import('@/views/admin/AdminGiftCardsViw.vue'),
  },
  {
    path: lingoRoutePath[LingoRouteName.MEMBERSHIP],
    name: LingoRouteName.MEMBERSHIP,
    component: () => import('@/views/MembershipView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    }
    return { top: 0, behavior: 'smooth' }
  },
})

export default router
