// import axios from '@/config/axios'
const state = {
  activeKey: null,
  activeNames: ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh'],
  ticket_id: null,
  ticket_type: null,
  dataWithStep1345: {}
}

const getters = {
  getActiveKey: state => state.activeKey,
  getActiveNames: state => state.activeNames,
  getTicketId: state => state.ticket_id,
  getTicketType: state => state.ticket_type,
  getDataWithStep1345: state => state.dataWithStep1345
}

const mutations = {
  updateActiveNames (state, payload) {
    state.activeName = payload
  },
  updateActiveKey (state, payload) {
    state.activeKey = payload
  },
  updateProductId (state, payload) {
    state.ticket_id = payload
  },
  updateProductType (state, payload) {
    state.ticket_type = payload
  },
  updateDataWithStep1345 (state, payload) {
    state.dataWithStep1345 = payload
  }
}

export default {
  state,
  getters,
  mutations
}
