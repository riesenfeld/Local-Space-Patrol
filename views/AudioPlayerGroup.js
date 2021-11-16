const AudioPlayerGroup = {
  template:
    /*html*/
    `<div id="audio-container">
      <audio
        id="audio"
        :src="currentAudioSourcePath"
        type="audio/wav"
        preload="auto">
      </audio>
      <!-- The audio player itself is hidden and referred to by a custom player UI element -->
      <div class="audio-player" v-for="track in playlist" :key="track.id">
        <!-- <audio id="track.id" :src="track.path" type="audio/wav" preload="metadata"></audio> -->
        <div class="audio-ui audio-title marquee"><marquee>{{ track.title }}</marquee></div>
        <div class="audio-ui audio-ui-container">
          <button class="audio-ui audio-button" @click="audioPlayPause(track.id)">
            <!-- <div>Icons made by <a href="https://www.flaticon.com/authors/pixel-perfect" title="Pixel perfect">Pixel perfect</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div> -->
            <img
              class="audio-ui audio-icon play-icon"
              :src="iconImages[durations[track.id].currentlyPlaying]"
              alt="play"
            />
          </button>
          <span class="audio-ui audio-current-time">{{ durations[track.id].currentTime }}</span>
          <input
            type="range"
            class="audio-ui audio-seeker"
            :value="durations[track.id].seekerCurrentTime"
            @change="seek(track.id)"
            min="0"
            :max="durations[track.id].rawDuration"
            step="0.1"/>
          <span class="audio-ui audio-duration">{{ durations[track.id].duration }}</span>
        </div>
      </div>
    </div>`,
  data: function () {
    return {
      iconImages: ["./assets/play.png", "./assets/pause.png"],
      playlist: audiodata,
      durations: [
        // Constructed on create(). Each element has the following format:
        // {
        //   id: 0, (corresponding to its id in playlist)
        //   duration: "",
        //   rawDuration: "",
        //   currentTime: "00.00",
        //   seekerCurrentTime: 0,
        //   currentlyPlaying: 0,
        // },
      ],
      currentAudioSourcePath: "",
      currentlyPlayingTrack: -1,
    }
  },
  methods: {
    /* Uses this.playlist (audiodata.js) to build the durations array*/
    constructDurationsArray() {
      let durations = []
      for (let track of this.playlist) {
        let obj = {
          id: track.id,
          duration: "",
          currentTime: "00.00",
          seekerCurrentTime: 0,
          currentlyPlaying: 0,
        }
        durations.push(obj)
      }
      this.durations = durations
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
    /* Fetch audio files */
    preloadAudio() {
      /*Note: May be able to reduce overhead by saving the HTMLAudioElements created herein and 
         swapping them out on the page as needed, rather than reloading the audio every
         time the user hits play on a different track, depending on how HTMLAudioElement
         is handled under the hood 
         Could have a different <audio> on the page for each track generated in the v-for*/

      /* This should cause the browser to fetch and cache each file */
      for (let track of this.playlist) {
        let audioSource = new Audio(track.path)
        audioSource.onloadedmetadata = () => {
          this.durations[track.id].duration = this.formatTimestamp(audioSource.duration)
          this.durations[track.id].rawDuration = audioSource.duration
        }
      }
    },
    audioPlayPause(id) {
      let audio = document.getElementById("audio")

      if (this.currentlyPlayingTrack == id && !audio.paused) {
        /* Pause audio */
        this.durations[id].currentlyPlaying = 0
        audio.pause()
      } else {
        /* Play audio */
        this.durations[id].currentlyPlaying = 1
        if (this.currentlyPlayingTrack != id) {
          if (this.currentlyPlayingTrack != -1) {
            /* When switching tracks, reset currentTime on the old track to 00:00*/
            this.durations[this.currentlyPlayingTrack].currentTime = "00.00"
            this.durations[this.currentlyPlayingTrack].currentlyPlaying = 0
            this.durations[this.currentlyPlayingTrack].seekerCurrentTime = 0
          }
          this.currentlyPlayingTrack = id
          this.currentAudioSourcePath = this.playlist[id].path
          audio.oncanplaythrough = function () {
            audio.play()
            audio.oncanplaythrough = null //Remove event handler once media has begun playback
          }
        } else {
          /* Play the same track that is currently paused */
          audio.play()
        }
      }
    },
    /* Changes location in the track when the seeker value is changed*/
    seek(id) {
      let audio = document.getElementById("audio")

      console.log(
        `seek() called with id ${id}. currentlyPlayingTrack: ${this.currentlyPlayingTrack}`
      )

      let time = parseFloat(event.currentTarget.value)
      // this.durations[this.currentlyPlayingTrack].currentlyPlaying = 0
      // audio.pause()
      /* Check whether the seek function has been called on the currently playing track or a different one*/

      /* When a track is playing and a user clicks the seeker bar on that same track, the following occurs:
       *  1. audio.currentTime is updated to the new value
       *  2. the seeker and currentTime UI elements are both updated to the new value
       *  3. the current track does not pause, but continues playing at the new position
       *
       * When a track is playing and a user clicks the seeker bar on a different track, the following occurs:
       *  1. The currently playing track is stopped and its seeker is reset to 0
       *  2. currentlyPlayingTrack is updated to the id of the track that has been clicked
       *  3. The new track does not play until the user clicks the play button, at which point,
       *       the new track plays from the selected timestamp.
       */
      if (this.currentlyPlayingTrack != id) {
        this.switchTracks(id, time)
        console.log(`Inside seek(): value of audio.currentTime: ${audio.currentTime}`)
        audio.oncanplaythrough = function () {
          //Need to reset the time because it gets auto-reset on load(), which is called implicitly.
          audio.currentTime = time
          console.log(`Before play(): value of audio.currentTime: ${audio.currentTime}`)
          audio.play()
          console.log(`After play(): value of audio.currentTime: ${audio.currentTime}`)
          audio.oncanplaythrough = null //Remove event handler once media has begun playback
        }
        // if (this.currentlyPlayingTrack != -1) {
        /* Pause any audio if currently playing */
        // console.log(`YES WE ARE IN HERE`)
        // audio.pause() //why isn't event handler detecting this?
        /* When switching tracks, reset currentTime on the old track to 00:00*/
        // this.durations[this.currentlyPlayingTrack].currentTime = "00.00"
        /* Why doesn't the button img change? */
        // this.durations[this.currentlyPlayingTrack].currentlyPlaying = 0
        // this.durations[this.currentlyPlayingTrack].seekerCurrentTime = 0
        // }
        /*Set currentlyPlayingTrack to the new track */
        // this.currentlyPlayingTrack = id /* why doesn't the button img change? */
        /* Set the source path on the <audio> element */
        // this.currentAudioSourcePath = this.playlist[id].path
        /* Set the <audio> element's currentTime to what has been selected on the seeker bar. */
        // console.log(`currentTime on seeker: ${parseFloat(event.currentTarget.value)}`)
        // audio.currentTime = parseFloat(event.currentTarget.value)
        // console.log(`audio.currentTime: ${audio.currentTime}`)
        /* Update the UI timestamp accordingly */
        // this.durations[id].seekerCurrentTime = audio.currentTime.toFixed(1)
        // this.durations[id].currentTime = this.formatTimestamp(audio.currentTime)
        // this.durations[id].currentlyPlaying = 0
      } else {
        /* seek() has been called on the player representing the currently playing track */
        audio.currentTime = time
        this.durations[id].seekerCurrentTime = audio.currentTime.toFixed(1)
        // this.durations[id].seekerCurrentTime = audio.currentTime.toFixed(1)
        this.durations[id].currentTime = this.formatTimestamp(audio.currentTime)
      }
    },
    /* Big Questions:
     * 1. Do we need to call audio.play() on new track or audio.pause() on old track?
     * 2. Why is audio.play() being called automatically? What is behind it?
     *
     */
    switchTracks(id, time = 0) {
      let audio = document.getElementById("audio")
      if (this.currentlyPlayingTrack != -1) {
        // Reset previous track to 0
        this.durations[this.currentlyPlayingTrack].currentTime = "00.00"
        this.durations[this.currentlyPlayingTrack].currentlyPlaying = 0
        this.durations[this.currentlyPlayingTrack].seekerCurrentTime = 0
      }
      // Set new audio source
      this.currentAudioSourcePath = this.playlist[id].path
      this.currentlyPlayingTrack = id
      this.durations[id].currentlyPlaying = 1
      // Get currentTime from seeker and apply it to audio and timestamp.

      // audio.currentTime = parseFloat(this.durations[id].seekerCurrentTime)
      audio.currentTime = time
      this.durations[id].seekerCurrentTime = audio.currentTime.toFixed(1)
      console.log(
        `unparsed seekerCurrentTime for new track: ${this.durations[id].seekerCurrentTime}`
      )
      console.log(`audio.currentTime for new track: ${audio.currentTime}`)
      this.durations[id].currentTime = this.formatTimestamp(audio.currentTime)
      // this.durations[id].currentlyPlaying = 1
      // this.currentlyPlayingTrack = id
    },
  },
  created() {
    this.constructDurationsArray()
    this.preloadAudio()
  },
  mounted() {
    let aud = document.getElementById("audio")

    aud.onloadstart = (event) => {
      console.log(`
       Audio LOADSTART event detected. \n
       Current source file: ${event.currentTarget.src} \n
       Value of currentTime: ${event.currentTarget.currentTime} \n
       `)
    }

    aud.ontimeupdate = (event) => {
      // console.log(`
      //  Audio TIMEUPDATE event detected. \n
      //  Current source file: ${event.currentTarget.src} \n
      //  Value of currentTarget.currentTime: ${event.currentTarget.currentTime} \n
      //  Value of audio.currentTime: ${aud.currentTime} \n
      //  `)

      /* Update (1) audio-seeker and (2) audio-current-time by updating this.durations[id].currentTime*/
      // this.durations[id].currentTime = this.formatTimestamp(audio.currentTime)
      this.durations[this.currentlyPlayingTrack].currentTime = this.formatTimestamp(
        audio.currentTime
      )
      /*seeker*/
      // this.durations[id].seekerCurrentTime = audio.currentTime.toFixed(1)
      // this.durations[this.currentlyPlayingTrack].seekerCurrentTime = audio.currentTime.toFixed(1)
    }
    /* Reset currentTime to 00:00 when audio has finished playing */
    aud.onended = () => {
      this.durations[this.currentlyPlayingTrack].currentTime = "00:00"
      this.durations[this.currentlyPlayingTrack].currentlyPlaying = 0
      /* seeker */
      this.durations[this.currentlyPlayingTrack].seekerCurrentTime = 0
    }

    /* Event Handlers for Debugging, remove when finished. */
    aud.onpause = (event) => {
      console.log(`
       Audio PAUSE event detected. \n
       Current source file: ${event.currentTarget.src} \n
       Value of currentTime: ${event.currentTarget.currentTime} \n
       `)
    }
    aud.onplay = (event) => {
      console.log(`
       Audio PLAY event detected. \n
       Current source file: ${event.currentTarget.src} \n
       Value of currentTime: ${event.currentTarget.currentTime} \n
       `)
    }
    // aud.onseeking = (event) => {
    //   console.log(`
    //   ~~~~~~~~~ \n
    //   SEEKING \n
    //   currentTime: ${aud.currentTime} \n
    //   ~~~~~~~~~ \n
    //   `)
    // }
    aud.onseeked = (event) => {
      console.log(`
      ~~~~~~~~~ \n
      SEEKED \n
      currentTime: ${aud.currentTime} \n
      ~~~~~~~~~ \n
      `)
    }
  },
}

app.component("audio-player-group", AudioPlayerGroup)
