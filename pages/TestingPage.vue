<template>
  <div>
    <h2>Tracks</h2>
    {{ tracks }}
    <!-- {{ tracks['tracks'].objects[0] }} -->
    <!-- <div v-for="track in tracks" :key="track.id">
      <h3>{{ track }}</h3>
      <h4>object id: {{ track.id }}</h4>
      <h4>media id: {{ track.metadata.media_data.id }}</h4>
      <audio controls :src="track.metadata.audio.url"></audio>
    </div> -->
  </div>
</template>

<script>
export default {
  async asyncData() {
    const response = await fetch(
      'https://fantastic-biscuit-65517c.netlify.app/.netlify/functions/fetch-tracks'
    )
    const tracks = await response.json()
    // const tracks = await response.text()
    console.log(tracks)
    return {
      tracks,
    }
  },
  data() {
    return {
      tracks: null,
    }
  },
}
</script>

<style scoped></style>
