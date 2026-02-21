<template>
  <div class="play-page">
    <!-- Hero -->
    <section class="play-section">
      <img src="/hero.svg" alt="" class="section-img section-img--hero" />
    </section>

    <!-- Fill glow -->
    <section class="play-section play-section--fill">
      <img src="/homepage-new/fill.svg" alt="" class="section-img section-img--fill" />
    </section>

    <!-- Wheel (empty for now) -->
    <section class="play-section">
      <div class="wheel-placeholder" />
    </section>

    <!-- Fill-1 glow -->
    <section class="play-section play-section--fill">
      <img src="/homepage-new/fill-1.svg" alt="" class="section-img section-img--fill" />
    </section>

    <!-- Staking -->
    <section class="play-section">
      <img src="/homepage-new/Staking.svg" alt="Staking" class="section-img section-img--staking" />
    </section>

    <!-- Raffles -->
    <section class="play-section">
      <img src="/homepage-new/Raffles.svg" alt="Raffles" class="section-img section-img--raffles" />
    </section>

    <!-- Live Wins + Trading Boosts (side by side) -->
    <section class="play-section play-section--row">
      <img src="/homepage-new/Live Wins.svg" alt="Live Wins" class="section-img section-img--live-wins" />
      <img src="/homepage-new/Trading Boosts.svg" alt="Trading Boosts" class="section-img section-img--trading-boosts" />
    </section>

    <!-- Dream Reward -->
    <section class="play-section">
      <img src="/homepage-new/dream Reward.svg" alt="Dream Reward" class="section-img section-img--dream-reward" />
    </section>

    <!-- Footer -->
    <section class="play-section">
      <img src="/homepage-new/foot.svg" alt="" class="section-img section-img--footer" />
    </section>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.play-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  background: #0C0C14;
  margin-top: -80px;
  padding-top: 80px;
  margin-bottom: -96px;
  overflow: hidden;
  gap: 24px;
}

.play-section {
  width: 100%;
  max-width: 1140px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  justify-content: center;
}

/* Shared img defaults */
.section-img {
  height: auto;
  display: block;
}

/* Hero: full container width */
.section-img--hero {
  width: 100%;
  max-width: 1140px;
}

/* Fill glows: centered, overlapping adjacent sections */
.play-section--fill {
  margin-top: -120px;
  margin-bottom: -120px;
  pointer-events: none;
  z-index: 1;
}

.section-img--fill {
  width: 840px;
  max-width: 100%;
}

/* Wheel placeholder */
.wheel-placeholder {
  width: 100%;
  max-width: 1140px;
}

/* Staking: native 764px, centered */
.section-img--staking {
  width: 764px;
  max-width: 100%;
}

/* Raffles: wider than container, allow full width */
.section-img--raffles {
  width: 100%;
  max-width: 1140px;
}

/* Live Wins + Trading Boosts row */
.play-section--row {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.section-img--live-wins {
  width: 348px;
  flex-shrink: 0;
}

.section-img--trading-boosts {
  width: 760px;
  flex-shrink: 1;
  max-width: 100%;
}

/* Dream Reward */
.section-img--dream-reward {
  width: 100%;
  max-width: 1140px;
}

/* Footer */
.section-img--footer {
  width: 100%;
  max-width: 1140px;
}
</style>
