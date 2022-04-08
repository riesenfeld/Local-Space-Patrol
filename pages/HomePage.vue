<template>
  <div id="app" class="content">
    <main>
      <h1 class="header">Local Space Patrol</h1>
      <h2 id="music-header" class="header"></h2>
      <audio-player-group />
    </main>
    <site-footer />
  </div>
</template>

<script>
import AudioPlayerGroup from '../components/AudioPlayerGroup.vue'
import SiteFooter from '../components/SiteFooter.vue'
export default {
  name: 'HomePage',
  components: { AudioPlayerGroup, SiteFooter },
}
</script>

<style lang="scss" scoped></style>
