const app = Vue.createApp({
  data: function () {
    return {
      testData: {
        one: "this is a test hello hello",
        two: "this is another test",
        three: "and another",
      },
      backgroundImage: {
        path: "./assets/space-halo-3-1626964-1599x958.jpg",
        attribution:
          "Photo by David Cowan from https://freeimages.com/photographer/davidcowan-54040",
      },
      playlist: [
        { id: 0, title: "Hatd", path: "audio/hatd_final5.wav" },
        { id: 1, title: "Test", path: "audio/test.wav" },
      ],
      durations: [
        { id: 0, duration: "", currentTime: "0.00" },
        { id: 1, duration: "", currentTime: "0.00" },
      ],
      currentAudioSourcePath: "",
      currentlyPlayingTrack: -1,
    }
  },
  methods: {
    audioPlayPause(id) {
      let audio = document.getElementById("audio")

      if (this.currentlyPlayingTrack == id && !audio.paused) {
        /* Pause audio */
        audio.pause()
      } else {
        /* Play audio */
        if (this.currentlyPlayingTrack != id) {
          this.durations[id].currentTime = "00.00" /*NOT HERE, reset currentTime on old track.*/
          this.currentlyPlayingTrack = id
          this.currentAudioSourcePath = this.playlist[id].path
          audio.load()
          audio.oncanplaythrough = function () {
            audio.play()
          }
        } else {
          audio.play()
        }
        audio.ontimeupdate = () => {
          /* Update (1) audio-seeker and (2) audio-current-time by updating this.durations.currentTime*/
          /*Add a 0 to the front when currentTime < 10 mins and < 10 secs*/
          this.durations[id].currentTime = `${Math.trunc(audio.currentTime / 60)}:${Math.trunc(
            audio.currentTime % 60
          )}`
          console.log(this.durations[id].currentTime)
        }
      }
    },
    displayMetadata(id) {
      document.getElementById("audio-duration").innerText = formatTime(this.audio.duration)
    },
  },
})
