import axios from 'axios';
const config = require('../config.js');
const API_ROOT = 'https://app-hrsei-api.herokuapp.com/api/fec2/hrnyc'


 const getListReviews = (productId, sort='relevant', count=4) => {
  let options = {
    method: 'GET',
    url: `${API_ROOT}/reviews/`,
    headers: {
      'Authorization': `${config.TOKEN}`
    },
    params: {
      page: 1,
      count: count,
      sort: sort,
      product_id: productId
    }
  }
  return axios(options);
}

export default getListReviews