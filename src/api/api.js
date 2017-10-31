import axios from '../config/axios'
import aaa from 'axios'
import config from '@/config/app.js'

function getOauth () {
  let token = localStorage.getItem('currentUser_token')
  if (token) {
    aaa.defaults.headers.Authorization = 'Bearer ' + token
  }
}

export const login = (params) => {
  return axios.post(config.oauth_url + '/oauth/token', params)
}

export const userInfo = () => {
  getOauth()
  return axios.get(config.oauth_url + '/api/user_info')
}

export const getUser = () => {
  return axios.get('/users', { params: { searchText: 'John' } })
    .then((response) => {
      console.log(response.data)
    })
}

export const getOther = () => {
  return axios.get('/users', { params: { searchText: 'John' } })
    .then((response) => {
      console.log(response.data)
    })
}

export const getdisticket = () => {
  return axios.get('/api/getdisticket').then((response) => {
    console.log(response.data)
  })
}

export const sceniclist = () => {
  return axios.get('api/sceniclist')
}

export const dislist = (params) => {
  return axios.get('user/dislist', {
    params: params
  })
}

export const modifydis = (params) => {
  return axios.get('user/modifydis', {
    params: params
  })
}

export const recharge = (params) => {
  return axios.get('user/recharge', {
    params: params
  })
}

export const cashback = (params) => {
  return axios.get('user/cashback', {
    params: params
  })
}

export const addsign = (disId) => {
  return axios.get('user/addsign', {
    params: {
      dis_id: disId
    }
  })
}

export const addcredit = (params) => {
  return axios.get('user/addcredit', {
    params: params
  })
}

export const getrechargelog = (params) => {
  return axios.get('user/getrechargelog', {
    params: params
  })
}

export const getCashbackLog = (params) => {
  return axios.get('user/getCashbackLog', {
    params: params
  })
}

export const getconsumelog = (params) => {
  return axios.get('user/getconsumelog', {
    params: params
  })
}

export const ticketsList = (page, pageSize, search) => {
  return axios.get('api/ticketlist', {
    params: {
      page: page,
      pageSize: pageSize,
      search: search
    }
  })
}

export const disListByFilter = (params) => {
  return axios.get('user/disListByFilter', {
    params: params
  })
}

export const ticketListByFilter = (page, pageSize, distributorId, search) => {
  return axios.get('api/ticketListByFilter', {
    params: {
      page: page,
      pageSize: pageSize,
      distributor_id: distributorId,
      search: search
    }
  })
}

export const getTravelTicketGroup = (params) => {
  return axios.get('api/getTravelTicketGroup', {
    params: params
  })
}

export const addTicket = (params) => {
  return axios.get('api/addTicket', {
    params: params
  })
}

export const dropTicket = (ticketId) => {
  return axios.get('api/dropTicket', {
    params: {
      id: ticketId
    }
  })
}

export const getTicketsForScenic = (scenicId) => {
  return axios.get('api/getTicketsForScenic', {
    params: {
      scenic_id: scenicId
    }
  })
}

export const getDisForTicket = (ticketId) => {
  return axios.get('api/getDisForTicket', {
    params: {
      ticket_id: ticketId
    }
  })
}

export const getTravelScenicToTicketsList = (params) => {
  return axios.get('api/getTravelScenicToTicketsList', {
    params: params
  })
}

export const getTravelScenicList = (params) => {
  return axios.get('api/getTravelScenicList', {
    params: params
  })
}

export const updateTravelScenicDspStatus = (params) => {
  return axios.get('api/updateTravelScenicDspStatus', {
    params: params
  })
}

export const getTravelTicketById = (ticketId) => {
  return axios.get('api/getTravelTicketById', {
    params: {
      ticket_id: ticketId
    }
  })
}

export const getDatePriceById = (params) => {
  return axios.get('api/getDatePrice', {
    params: params
  })
}

export const updateOrCreateDatePrice = (params) => {
  return axios.get('api/updateOrCreateDatePrice', {
    params: params
  })
}
export const updateOrCreateDatePrices = (params) => {
  return axios.get('api/updateOrCreateDatePrices', {
    params: params
  })
}

export const updateOrCreateDisDatePrice = (params) => {
  return axios.get('api/updateOrCreateDisDatePrice', {
    params: params
  })
}
export const updateOrCreateDisDatePrices = (params) => {
  return axios.get('api/updateOrCreateDisDatePrices', {
    params: params
  })
}

export const getTicketById = (ticketId) => {
  return axios.get('api/getTicketById', {
    params: {
      ticket_id: ticketId
    }
  })
}

export const getTravelTicketGroupById = (ticketGroupId) => {
  return axios.get('api/getTravelTicketGroupById', {
    params: {
      ticket_group_id: ticketGroupId
    }
  })
}

export const updateDisTicketRelation = (ticketId, distributorId, type) => {
  return axios.get('user/updateDisTicketRelation', {
    params: {
      ticket_id: ticketId,
      distributor_id: distributorId,
      type: type
    }
  })
}

export const getDisTicketDatePrice = (params) => {
  return axios.get('api/getDisDatePrice', {
    params: params
  })
}

export const updateOrCreateBuyNote = (params) => {
  return axios.post('api/updateOrCreateBuyNote', params)
}

export const getBuyNoteByProductId = (params) => {
  return axios.get('api/getBuyNoteByProductId', {
    params: params
  })
}

export const getRefundRule = (params) => {
  return axios.get('api/getRefundRule', {
    params: params
  })
}
export const updateRefundRule = (params) => {
  return axios.get('api/updateRefundRule', {
    params: params
  })
}

export const getRiskControl = (params) => {
  return axios.get('api/getRiskControl', {
    params: params
  })
}

export const updateRiskControl = (params) => {
  return axios.get('api/updateRiskControl', {
    params: params
  })
}

export const getVisitorInfoRule = (params) => {
  return axios.get('api/getVisitorInfoRule', {
    params: params
  })
}

export const updateVisitorInfoRule = (params) => {
  return axios.get('api/updateVisitorInfoRule', {
    params: params
  })
}

export const updateTicketsStatus = (idsArr, type) => {
  return axios.get('api/updateTicketsStatus', {
    params: {
      ids: idsArr,
      t: type
    }
  })
}

export const updateDisStatus = (idsArr, type) => {
  return axios.get('user/updateDisStatus', {
    params: {
      ids: idsArr,
      type: type
    }
  })
}

export const backDisDatePrice = (params) => {
  return axios.get('api/backDisDatePrice', {
    params: params
  })
}

export const updateTicket = (params) => {
  return axios.get('api/updateTicket', {
    params: params
  })
}

export const orderList = (params) => {
  return axios.get('order/index', {
    params: params
  })
}

export const approveOrderRefund = (id) => {
  return axios.get('order/approveOp', {
    params: {
      id: id
    }
  })
}

export const rejectOrderRefund = (id) => {
  return axios.get('order/rejectOp', {
    params: {
      id: id
    }
  })
}

export const getGroupPerTicket = (productId) => {
  return axios.get('api/getGroupPerTicket', {
    params: {
      product_id: productId
    }
  })
}

export const getGroupPerTicketDatePrice = (params) => {
  return axios.get('api/getGroupPerTicketDatePrice', {
    params: params
  })
}

export const recordGroupSingleTicketDatePrice = (params) => {
  return axios.get('api/recordGroupSingleTicketDatePrice', {
    params: params
  })
}

export const recordGroupSingleTicketDatePrices = (params) => {
  return axios.get('api/recordGroupSingleTicketDatePrices', {
    params: params
  })
}

export const updateTicketOther = (params) => {
  return axios.get('api/updateTicketOther', {
    params: params
  })
}

export const resetDayDisDatePrice = (params) => {
  return axios.get('api/resetDayDisDatePrice', {
    params: params
  })
}
