// const axios = require('axios');
// const config = require('../config.js');
// const API_ROOT = 'https://app-hrsei-api.herokuapp.com/api/fec2/hrnyc';


// const getMetaReview = (productId) => {
//   let options = {
//     method: 'GET',
//     url: `${API_ROOT}/reviews/meta`,
//     headers: {
//       'Authorization': `${config.TOKEN}`
//     },
//     params: {
//       productId: productId
//     }
//   };
//   return axios(options);
// };

// module.exports.getMetaReview = getMetaReview;



// const getMetaReview = (productId) => {
//   let options = {
//     method: 'GET',
//     url: `${API_ROOT}/reviews/meta`,
//     headers: {
//       'Authorization': `${config.TOKEN}`
//     },
//     params: {
//       product_id: productId
//     }
//   };
//   return axios(options);
// };

//   useEffect(() => {
//     let productID = props.productId;
//     getMetaReview(productID).then((resp) => {
//       console.log(resp);
//     }).catch((err) => {
//       console.log('axios request failed', err);
//     })
//   })



// import React, {useState, useEffect} from 'react';
// // import Dropdown from './dropdown.jsx';
// import axios from 'axios';
// const config = require('../config.js');
// const API_ROOT = 'https://app-hrsei-api.herokuapp.com/api/fec2/hrnyc'
// const HEADERS = {
//   headers: {
//     'Authorization' : config.TOKEN
//   }
// }


// export default function ReviewRating(props) {

// // console.log(props.productId);

// const [dropMenu, setdropMenu] = useState('relevance');
// const [reviewList, setreviewList] = useState([]);

// const getListReviews = (productId) => {
//   let options = {
//     method: 'GET',
//     url: `${API_ROOT}/reviews/`,
//     headers: {
//       'Authorization': `${config.TOKEN}`
//     },
//     params: {
//       page: 1,
//       count: 5,
//       sort: 'relevant',
//       product_id: productId
//     }
//   }
//   return axios(options);
// }


// useEffect(() => {
//   getListReviews(props.productId).then((resp) => {
//     setreviewList(resp.data);
//   })
//   // only want to fetch data when the user submit a new sorting value
//   // or when a user clicks load more data.
// }, [dropMenu])

// console.log('the reviewList', reviewList.results)

//   return (
//     <main>
//         <h2>{reviewList.results.length}reviews, sorted by
//       <form>
//         <select onChange={(e) => {
//           setdropMenu(e.target.value);
//         }}>
//           <option value='relevance'>
//             relevance
//           </option>
//           <option value='Helpful'>Helpful
//           </option>
//           <option value='Newest'>Newest</option>
//         </select>
//       </form></h2>
//     </main>
//   )

// }