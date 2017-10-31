import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

export default {
  bootstrap () {
    let mock = new MockAdapter(axios)

    // mock请求
    mock.onGet('users').reply(200, {
      users: [
        {id: 1, name: 'John'}
      ]
    })
  }
}
