import React from 'react';
import axios from 'axios';
import {getListReviews, loadReviews} from '../helpers/helper.js';
// import BarChart from './BarChart.jsx';
import {Bar} from 'react-chartjs-2';
const config = require('../config.js');
const API_ROOT = 'https://app-hrsei-api.herokuapp.com/api/fec2/hrnyc'
const HEADERS = {
  headers: {
    'Authorization' : config.TOKEN
  }
};

export default class ReviewRating extends React.Component {
   constructor(props) {
     super(props);
     this.state = {
       rating: 5,
       reviewList: [],
       sortBy: 'relevant',
       ratingLabels: ['1 stars', '2 stars', '3 stars', '4 stars', '5 stars'],
       ratingDistribute: [],
       numOfReviewer: 0
     }
     this.handleChange = this.handleChange.bind(this);
     this.convertToStar = this.convertToStar.bind(this);
    //  this.loadReviews = this.loadReviews.bind(this);
    //  this.convertToDate = this.convertToDate.bind(this);
   }


  handleChange(event) {
    // console.log('handle change',event.target.value);
    this.setState({sortBy: event.target.value}, () => {
      getListReviews(this.props.productId, this.state.sortBy).then((response) => {
        // console.log('response after sortBy', response);
      })
    });
  }

  componentDidMount() {

    getListReviews(this.props.productId).then((response) => {
      // console.log(response);
      this.setState({reviewList: response.data.results})
  }).catch((err) => {
    console.log('failed to getListReviews:',err);
  })

    loadReviews(this.props.productId).then((response) => {
      console.log('loadReview response', response.data);
      var parseHelper = function(input) {
        var output = parseInt(input);
        return isNaN(output) ? 0 : output;
      };
      var ratingDistributeHelper = function() {
        var ratingDistrubtionArray = [];
        for (var i = 1; i < 6; i++) {
            ratingDistrubtionArray.push( ((parseHelper(ratingsObject[`${i}`]) / ratingCount) * 100) );

        }
        return ratingDistrubtionArray
      }
      // ratingDistrubtion: [(ratingsObject['1'] / ratingSum) * 100]
      var ratingsObject = response.data.ratings;
      var ratingCount = parseHelper(ratingsObject['1']) + parseHelper(ratingsObject['2']) + parseHelper(ratingsObject['3']) + parseHelper(ratingsObject['4']) + parseHelper(ratingsObject['5']);
      var ratingSum = parseHelper(ratingsObject['1']) + 2 * parseHelper(ratingsObject['2']) + 3 * parseHelper(ratingsObject['3']) + 4 * parseHelper(ratingsObject['4']) + 5 * parseHelper(ratingsObject['5']);
      var average = ratingSum / ratingCount;
      this.setState({
        rating: isNaN(average) ? 0 : average,
        numOfReviewer: ratingSum,
        ratingDistribute: ratingDistributeHelper()
      });
    }).catch((err) => {
      console.log('some errors in loadReview', err);
    })

}

  convertToDate(iso) {
  return new Date(iso).toLocaleDateString("sq-AL",{ year: 'numeric', month: 'short', day: '2-digit' });
  }

  convertToStar(number) {
    // we want to get the number that is to the right of decimal
      // if .75 we get 75%
      // if 1 we get 100% of a star
      let wholeOutput = [];
      let leftOutput = [];
      number = (Math.round(number * 4) / 4).toFixed(2);
      let whole = Number(number.slice(0, 1));
      let left = Number(number.slice(1));
        while (whole > 0) {
          wholeOutput.push("star star-whole fa fa-star fa-xs");
          whole--;
        }
        // if left is .75 || .5 || .25
        if (left === .75) {
          leftOutput.push("star star-3-4 fa fa-star fa-xs")
        }
        if (left === .5) {
          leftOutput.push("star star-2-4 fa fa-star fa-xs")
        }
        if (left === .25) {
          leftOutput.push("star star-1-4 fa fa-star fa-xs")
        }
        let output = wholeOutput.concat(leftOutput);
        return output;
  }


render() {
  return (
    <main className='box'>

      <div className='child box-child-1'>
        <p className='child-ratingreview'>{'RATINGS & REVIEWS'}</p>
        <div className='avgrating-avgstar'>
          <div className='average-rating'>{this.state.rating}</div>
          <div className='avgstar'>{this.convertToStar(this.state.rating).map((item) => {
            return (
              <span className={item}></span>
            )
          })}</div>
          <div>
          <Bar
           data = {{
           labels: this.state.ratingLabels,
           datasets: [{
             data: this.state.ratingDistribute,
             label: '# of selected rating',
             backgroundColor:'rgb(0, 0, 0)',
             borderColor: 'rgb(0, 0, 0)',
             borderWidth: 1,
           }]
          }}
            options = {{
              indexAxis: 'y',
  // Elements options apply to all of the options unless overridden in a dataset
  // In this case, we are setting the border of each horizontal bar to be 2px wide
          elements: {
            bar: {
            borderWidth: 1,
          },
        },
          responsive: true,
          maintainAspectRatio: true,
        plugins: {
        legend: {
          position: 'right',
        },
          title: {
            display: true,
            text: 'Chart.js Horizontal Bar Chart',
          },
        },
      }}
           />
           </div>
        </div>
      </div>

      <div className='child box-child-2'>

        <div className='sub-review-num'>{this.state.reviewList.length } reviews, sorted by
        <select value={this.state.sortBy} onChange={this.handleChange}>
          <option value='relevant'>
            relevant
          </option>
          <option value='helpful'>helpful
          </option>
          <option value='newest'>newest</option>
        </select>
      </div>

        {this.state.reviewList.map((review) => {
          return (
            <div className='review-list'>
            <div className='review-star-name-date'>
            <div className='review-star'>{this.convertToStar(Number(review.rating))
              .map((item) => {
                return (
                  <span className={item}></span>
                )
              })
            }
            {/* <span className='star star-whole fa fa-star'></span> */}
            </div>
            <div className='name-date'>{`${review.reviewer_name}, ${this.convertToDate(review.date)}`}</div>
            </div>
            <div className='sub-review-body'>{review.body}</div>
            <div className='sub-recommend'>{review.recommend ? 'I recommend this product' : null}</div>
            <div>{review.response ? review.response : null}</div>
            <div className='sub-helpful'>
            <div className='sub-1'><p>{'Helpful?'}</p></div>
            <div className='sub-1'><p className='helpfulness'>{`Yes (${review.helpfulness})`}</p></div>
            <div className='vertLine'><p> {`|`} </p></div>
            <div className='sub-1'><p className='report'>{`Report`}</p></div>
            </div>
            <hr></hr>

            </div>
          )
        })}
          <div className='two-Button'>
          <div className='two-Button-child1'>
          <button><p className='button-moreReview'>{'MORE REVIEWS'}</p></button>

          </div>
          <div className='two-Button-child2'>
          <button><p className='button-addReview'>{`ADD A REVIEW   +`}</p></button>
          </div>
          </div>
        </div>

    </main>
  )

  }
}