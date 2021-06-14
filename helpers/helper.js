import axios from 'axios';
import KEY from '../config.js';
const API_ROOT = 'https://app-hrsei-api.herokuapp.com/api/fec2/hrnyc'


 const getListReviews = (productId, sort='relevant', count=4) => {
  let options = {
    method: 'GET',
    url: `${API_ROOT}/reviews/`,
    headers: {
      'Authorization': KEY
    },
    params: {
      page: 1,
      count: count,
      sort: sort,
      product_id: productId
    }
  }
  // console.log(options.headers);

  return axios(options);
}

  const loadReviews = (productId) => {
    let options = {
      method: 'GET',
      url: `${API_ROOT}/reviews/meta/`,
      headers: {
        'Authorization': KEY
      },
      params: {
        product_id: productId
      }
    }
    // console.log(options.headers);
    return axios(options);
  }

export {getListReviews, loadReviews}