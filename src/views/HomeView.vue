<template>
  <div class="play-page">
    <!-- 1. Header section -->
    <section class="play-section play-section--header">
      <img src="/homepage-new/header.svg" alt="" class="play-section__img" />
    </section>

    <!-- 2. Fill gradient (purple/magenta glow) -->
    <section class="play-section play-section--fill">
      <img src="/homepage-new/fill.svg" alt="" class="play-section__img" />
    </section>

    <!-- 3. Wheel section (empty placeholder for now) -->
    <section class="play-section play-section--wheel">
      <div class="wheel-placeholder" />
    </section>

    <!-- 4. Fill-1 gradient (blue/cyan glow) -->
    <section class="play-section play-section--fill">
      <img src="/homepage-new/fill-1.svg" alt="" class="play-section__img" />
    </section>

    <!-- 5. Staking -->
    <section class="play-section">
      <img src="/homepage-new/Staking.svg" alt="Staking" class="play-section__img" />
    </section>

    <!-- 6. Raffles -->
    <section class="play-section">
      <img src="/homepage-new/Raffles.svg" alt="Raffles" class="play-section__img" />
    </section>

    <!-- 7. Live Wins -->
    <section class="play-section">
      <img src="/homepage-new/Live Wins.svg" alt="Live Wins" class="play-section__img" />
    </section>

    <!-- 8. Trading Boosts -->
    <section class="play-section">
      <img src="/homepage-new/Trading Boosts.svg" alt="Trading Boosts" class="play-section__img" />
    </section>

    <!-- 9. Dream Reward -->
    <section class="play-section">
      <img src="/homepage-new/dream Reward.svg" alt="Dream Reward" class="play-section__img" />
    </section>

    <!-- 10. Footer -->
    <section class="play-section">
      <img src="/homepage-new/foot.svg" alt="" class="play-section__img" />
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
}

.play-section {
  width: 100%;
  display: flex;
  justify-content: center;
}

.play-section__img {
  width: 100%;
  max-width: 1536px;
  height: auto;
  display: block;
}

.play-section--fill {
  margin-top: -100px;
  margin-bottom: -100px;
  pointer-events: none;
}

.play-section--wheel {
  width: 100%;
  display: flex;
  justify-content: center;
}

.wheel-placeholder {
  width: 100%;
  max-width: 1536px;
  height: 400px;
}
</style>
