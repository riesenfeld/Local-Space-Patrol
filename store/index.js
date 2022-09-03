// import { createStore } from 'vuex'

// export default createStore({
//   state: {
//     audiodata: [],
//   },

//   getters: {
//     getAudioData(state) {
//       return state.audiodata
//     },
//   },

//   mutations: {
//     ADD_TRACK(state, track) {
//       state.tracks.push(track)
//     },
//   },

//   actions: {},
// })

export const state = () => ({
  audiodata: [
    {
      id: 0,
      title: 'Heart at the Door',
      path: '/audio/heartatthedoor.mp3',
    },
  ],
})

// export const mutations = {}
