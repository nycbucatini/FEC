import axios from 'axios';
import KEY from '../config';
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
    return axios(options);
  }

  const postReview = (productId, rating, summary, body, recommend, name, email, photos=[], characteristics) => {
    let options = {
      method: 'POST',
      url: `${API_ROOT}/reviews`,
      headers: {
        'Authorization': KEY
      },
      data: {
        product_id: productId,
        rating: rating,
        summary: summary,
        body: body,
        recommend: true,
        name: name,
        email: email,
        photos: photos,
        characteristics: characteristics
      }
    }
    return axios(options);
  }

  const reportReview = (review_id) => {
    let options = {
    method: 'PUT',
    url: `${API_ROOT}/reviews/${review_id}/report`,
    headers: {
    'Authorization': KEY
    }
  }
  return axios(options);
}

const helpfulReview = (review_id) => {
  let options = {
    method: 'PUT',
    url: `${API_ROOT}/reviews/${review_id}/helpful`,
    headers: {
    'Authorization': KEY
    }
  }
  return axios(options);
}

export {getListReviews, loadReviews, postReview, reportReview, helpfulReview}