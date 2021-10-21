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
        { id: 0, duration: "", currentTime: "00.00" },
        { id: 1, duration: "", currentTime: "00.00" },
      ],
      currentAudioSourcePath: "",
      currentlyPlayingTrack: -1,
    }
  },
  methods: {
    /* Fetch audio files */
    preloadAudio() {
      console.log(`here`)
      for (let track of this.playlist) {
        let audioSource = new Audio(track.path)
        audioSource.onloadedmetadata = () => {
          console.log(`duration: ${audioSource.duration}`)
          this.durations[track.id] = audioSource.duration
        }
      }
    },
    formatTimestamp(time) {
      let minutes = Math.trunc(time / 60)
      let minutesString = minutes + ":"
      if (minutes < 10) {
        minutesString = "0" + minutesString
      }
      let seconds = Math.trunc(time % 60)
      let resultString = seconds.toString()
      if (seconds < 10) {
        resultString = "0" + resultString
      }
      return minutesString + resultString
    },
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
          this.durations[id].currentTime = this.formatTimestamp(audio.currentTime)
        }
      }
    },
    displayMetadata(id) {
      document.getElementById("audio-duration").innerText = formatTime(this.audio.duration)
    },
  },
  mounted() {
    //  this.preloadAudio()
  },
})
