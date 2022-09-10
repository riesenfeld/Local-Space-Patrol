<template>
  <div>
    <h1>Tracks</h1>
    <div v-for="track in tracks" :key="track.id">
      <h2>{{ track.title }}</h2>
      <h3>Published at: {{ makeDateTime(track.published_at) }}</h3>
      <h4>object id: {{ track.id }}</h4>
      <h4>media id: {{ track.metadata.media_data.id }}</h4>
      <audio controls :src="track.metadata.audio.url"></audio>
    </div>
  </div>
</template>

<script>
export default {
  async asyncData() {
    // const response = await fetch(
    //   'https://fantastic-biscuit-65517c.netlify.app/.netlify/functions/fetch-tracks'
    // )
    // const json = await response.json()
    // return {
    //   tracks: json.objects,
    // }
    if (process.server) {
      const response = await fetch(
        `https://api.cosmicjs.com/v2/buckets/${
          process.env.BUCKET_SLUG
        }/objects?read_key=${process.env.READ_KEY}&query=${encodeURIComponent(
          `{ "type": "${process.env.OBJECT_TYPE}" }`
        )}`
      )
      const json = await response.json()
      return {
        tracks: json.objects,
      }
    }
  },
  data() {
    return {
      tracks: null,
    }
  },
  methods: {
    makeDateTime(str) {
      const d = new Date(str)
      const dateString = d.toLocaleString('en-US')
      return dateString
    },
  },
}
</script>

<style scoped></style>
