// import axios from '@/config/axios'
const state = {
  showCard: false
}

const getters = {
  getCardShowStatus: state => state.showCard
}

const mutations = {
  updateCardShowStatus (state, payload) {
    state.showCard = payload
  }
}

export default {
  state,
  getters,
  mutations
}
