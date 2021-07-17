import React from 'react';
import axios from 'axios';
import Window from './Window.jsx'
import {getListReviews, loadReviews, helpfulReview, reportReview} from '../helpers/helper.js';
import KEY from '../config.js';
const API_ROOT = 'https://app-hrsei-api.herokuapp.com/api/fec2/hrnyc'
const HEADERS = {
  headers: {
    'Authorization' : KEY
  }
};

export default class ReviewRating extends React.Component {
   constructor(props) {
     super(props);
     this.state = {
       rating: 5,
       reviewList: [],
       sortBy: 'relevant',
       ratingDistribute: [],
       recommendPercentage: 0,
       comfortPercentage: 0,
       fitPercentage: 0,
       comfortId: 0,
       fitId: 0,
       LengthId: 0,
       QualityId: 0,
       reviewCount: 4
     }
     this.handleChange = this.handleChange.bind(this);
     this.convertToStar = this.convertToStar.bind(this);
     this.handleMoreReview = this.handleMoreReview.bind(this);
     this.onReport = this.onReport.bind(this);
     this.onHelpfulReview = this.onHelpfulReview.bind(this);
   }

   onReport(review_id) {

      reportReview(review_id).then((resp) => {
        alert('review has been reported!');
      }).catch((err) => {
        console.log('report not approved', err);
      })
   }
  onHelpfulReview(review_id) {
    helpfulReview(review_id).then((resp) => {
      getListReviews(this.props.productId, this.state.sortBy, this.state.reviewCount).then((resp) => {
        const addedResults = resp.data.results;
        this.setState({reviewList: addedResults})
      })
    })
  }
  handleMoreReview() {
    let addReviewCount = this.state.reviewCount + 2;
    this.setState({reviewCount: addReviewCount})
    getListReviews(this.props.productId, this.state.sortBy, this.state.reviewCount).then((resp) => {
      const addedResults = resp.data.results;
      this.setState({reviewList: addedResults})
    })
  }

  handleChange(event) {
    this.setState({sortBy: event.target.value}, () => {
      getListReviews(this.props.productId, this.state.sortBy, this.state.reviewCount).then((resp) => {
        const sortedResult = resp.data.results;
        this.setState({reviewList: sortedResult});
      })
    });
  }

  componentDidMount() {

    getListReviews(this.props.productId).then((response) => {
      // console.log('hello new comment', response);
      this.setState({reviewList: response.data.results})
  }).catch((err) => {
    console.log('failed to getListReviews:',err);
  })

    loadReviews(this.props.productId).then((response) => {
      // console.log('loadReview response', response.data);
      var parseHelper = function(input) {
        var output = parseInt(input);
        return isNaN(output) ? 0 : output;
      };
      var ratingDistributeHelper = function() {
        var ratingDistrubtionArray = [];
        for (var i = 1; i < 6; i++) {
            ratingDistrubtionArray.push( Number(((parseHelper(ratingsObject[`${i}`]) / ratingCount) * 100).toFixed(1)) );
        }
        return ratingDistrubtionArray
      }
      var ratingsObject = response.data.ratings;
      var ratingCount = parseHelper(ratingsObject['1']) + parseHelper(ratingsObject['2']) + parseHelper(ratingsObject['3']) + parseHelper(ratingsObject['4']) + parseHelper(ratingsObject['5']);
      var ratingSum = parseHelper(ratingsObject['1']) + 2 * parseHelper(ratingsObject['2']) + 3 * parseHelper(ratingsObject['3']) + 4 * parseHelper(ratingsObject['4']) + 5 * parseHelper(ratingsObject['5']);

      var average = ratingSum / ratingCount;
      average = Number(average.toFixed(1));
      var recommendObject = response.data.recommended;
      var recommendCount = Number(recommendObject['true']) + Number(recommendObject['false']);
      // console.log('reccoCount', recommendCount)
      var productRecommend = Math.round((recommendObject['true'] / recommendCount) * 100)
      var characteristicsObj = response.data.characteristics;
      var fitPercentage = (Number(characteristicsObj.Fit.value.slice(0, characteristicsObj.Fit.value.indexOf('.') + 3)) / 5) * 100;
      var comfortPercentage = (Number(characteristicsObj.Comfort.value.slice(0, characteristicsObj.Comfort.value.indexOf('.') + 3)) / 5) * 100;

      var diffCharacteristic = response.data.characteristics;
      this.setState({
        rating: isNaN(average) ? 0 : average,
        ratingDistribute: ratingDistributeHelper(),
        recommendPercentage: productRecommend,
        fitPercentage: fitPercentage,
        comfortPercentage: comfortPercentage,

        comfortId: diffCharacteristic.Comfort.id,
        fitId: diffCharacteristic.Fit.id,
        LengthId: diffCharacteristic.Length.id,
        QualityId: diffCharacteristic.Quality.id
      }, () => {
        // console.log('all id after setState', this.state.comfortId, this.state.fitId, this.state.LengthId, this.state.QualityId)
      });

    }).catch((err) => {
      console.log('some errors in loadReview', err);
    })

}

  convertToDate(iso) {
  return new Date(iso).toLocaleDateString("sq-AL",{ year: 'numeric', month: 'short', day: '2-digit' });
  }

  convertToStar(number) {

      let wholeOutput = [];
      let leftOutput = [];
      number = (Math.round(number * 4) / 4).toFixed(2);
      let whole = Number(number.slice(0, 1));
      let left = Number(number.slice(1));
        while (whole > 0) {
          wholeOutput.push("star star-whole fa fa-star fa-xs");
          whole--;
        }
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
    <main className='box' id='reviewsAndRatingsComponent'>
      <div className='child box-child-1'>
        <p className='child-ratingreview'>{'RATINGS & REVIEWS'}</p>
        <div className='avgrating-avgstar'>
          <div className='average-rating'>{this.state.rating}</div>
          <div className='avgstar'>{this.convertToStar(this.state.rating).map((item) => {
            return (
              <span className={item}></span>
            )
          })}</div>
        </div>
        <p className='percentage'>{`${this.state.recommendPercentage}% of reviews recommend this product`}</p>
        <div class="row">
  <div class="side">
    <div>5 star</div>
  </div>
  <div class="middle">
    <div class="bar-container">
      <div style={{width: `${this.state.ratingDistribute[4]}%`}} class="bar-5"></div>
    </div>
  </div>
  <div class="side right">
    <div>150</div>
  </div>
  <div class="side">
    <div>4 star</div>
  </div>
  <div class="middle">
    <div class="bar-container">
      <div style={{width: `${this.state.ratingDistribute[3]}%`}} class="bar-4"></div>
    </div>
  </div>
  <div class="side right">
    <div>150</div>
  </div>
  <div class="side">
    <div>3 star</div>
  </div>
  <div class="middle">
    <div class="bar-container">
      <div style={{width: `${this.state.ratingDistribute[2]}%`}} class="bar-3"></div>
    </div>
  </div>
  <div class="side right">
    <div>150</div>
  </div>
  <div class="side">
    <div>2 star</div>
  </div>
  <div class="middle">
    <div class="bar-container">
      <div style={{width: `${this.state.ratingDistribute[1]}%`}} class="bar-2"></div>
    </div>
  </div>
  <div class="side right">
    <div>150</div>
  </div>
  <div class="side">
    <div>1 star</div>
  </div>
  <div class="middle">
    <div class="bar-container">
      <div style={{width: `${this.state.ratingDistribute[0]}%`}} class="bar-1"></div>
    </div>
  </div>
  <div class="side right">
    <div>150</div>
  </div>
</div>
  <div className='gl-vspace-bpall-small'>
    <div className='remove-intersections___3rBx6'>
    <div className='gl-comparison-bar gl-comparison-bar--triangle'>
    <div className='gl-comparison-bar__title'>
    <p>Size</p>
    </div>
      <div class='gl-comparison-bar__bg'>
        <div style={{left: `${this.state.fitPercentage}%`}} class='gl-comparison-bar__indicator'>
          <div class='gl-comparison-bar__intersections'>
          </div>
        </div>
      </div>
      <div class='gl-comparison-bar__labels'>
            <label class='gl-comparison-bar__label'>Too small</label>
            <label class="gl-comparison-bar__label gl-comparison-bar__label--active">Perfect</label>
            <label class='gl-comparison-bar__label'>Too large</label>
          </div>
     </div>
     </div>
  </div>

  <div className='gl-vspace-bpall-small'>
    <div className='remove-intersections___3rBx6'>
    <div className='gl-comparison-bar gl-comparison-bar--triangle'>
    <div className='gl-comparison-bar__title'>
    <p>Comfort</p>
    </div>
      <div class='gl-comparison-bar__bg'>
        <div style={{left: `${this.state.comfortPercentage}%`}} class='gl-comparison-bar__indicator'>
          <div class='gl-comparison-bar__intersections'>
          </div>
        </div>
      </div>
      <div class='gl-comparison-bar__labels'>
            <label class='gl-comparison-bar__label'>Poor</label>
            <label class="gl-comparison-bar__label gl-comparison-bar__label--active"></label>
            <label class='gl-comparison-bar__label'>Perfect</label>
          </div>
     </div>
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
        <section className='review-sect'>
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
            </div>
            <div className='name-date'>{`${review.reviewer_name}, ${this.convertToDate(review.date)}`}</div>
            </div>
            <div className='sub-review-summary'>{review.summary}</div>
            <div className='sub-review-body'>{review.body}</div>
            <div className='sub-recommend'>{review.recommend ? 'I recommend this product' : null}</div>
            <div>{review.response ? review.response : null}</div>
            <div className='sub-helpful'>
            <div className='sub-1'><p>{'Helpful?'}</p></div>
            <div className='sub-1'><p onClick={() => {this.onHelpfulReview(review.review_id)}} className='helpfulness'>{`Yes (${review.helpfulness})`}</p></div>
            <div className='vertLine'><p> {`|`} </p></div>
            {/*             <div className='sub-1'><p onClick={() => {this.onReport(review.review_id)}} className='report'>{`Report`}</p></div>
 */}
            <div className='sub-1'><p onClick={() => {this.onReport(review.review_id)}} className='report'>{`Report`}</p></div>
            </div>
            <hr></hr>

            </div>
          )
        })}
        </section>

          <div className='two-Button'>
          <div className='two-Button-child1'>
          <button onClick={this.handleMoreReview}><p className='button-moreReview'>{'MORE REVIEWS'}</p></button>
          </div>
          <Window comfortId={this.state.comfortId} fitId={this.state.fitId} LengthId={this.state.LengthId} QualityId={this.state.QualityId} productId={this.props.productId}/>
          </div>
        </div>

    </main>
  )

  }
}