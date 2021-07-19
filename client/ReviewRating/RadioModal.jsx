
import React from 'react';
import Radio from './Radio.jsx';
import UploadImg from './UploadImg.jsx';
import axios from 'axios';
import {postReview} from '../../helpers/helper.js';
export default class RadioModal extends React.Component {
  constructor(props) {
    super(props);
    this.options = ['Size', 'Width', 'Comfort', 'Quality', 'Length', 'Fit'];
    this.sizeOptions = ['A size too small', '1/2 a size too small', 'Perfect', '1/2 a size too big', 'A size too wide']
    this.state = {
      selectedOption: null,
      summaryText: '',
      summaryBody: '',
      displayName: '',
      userEmail: '',
      summaryCounter: 60,
      minBodyCounter: 50,
      bodyCounter: 1000,
      comfortValue: null,
      qualityValue: null,
      lengthValue: null,
      fitValue: null,
      characterObj: {},
      submitted: false
    }

    this.handleSelection = this.handleSelection.bind(this);
    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.postRequest = this.postRequest.bind(this);
  }

  handleSelection(title, options) {
    let characterObj = JSON.parse(JSON.stringify(this.state.characterObj));
    if (title === 'Comfort') {
      const integer  = parseInt(options, 10)
      characterObj[this.props.comfortId] = integer
      this.setState({comfortValue: options, characterObj: characterObj})
    }
    if (title === 'Quality') {
      const integer  = parseInt(options, 10)
      characterObj[this.props.QualityId] = integer
      this.setState({qualityValue: options, characterObj: characterObj})
    }
    if (title === 'Length') {
      const integer  = parseInt(options, 10)
      characterObj[this.props.LengthId] = integer
      this.setState({lengthValue: options, characterObj: characterObj})
    }
    if (title === 'Fit') {
      const integer  = parseInt(options, 10)
      characterObj[this.props.fitId] = integer
      this.setState({fitValue: options, characterObj: characterObj})
    }
  }
  handleOptionChange(e) {
    this.setState({
      selectedOption: e.target.value
    });
  }

  handleTextChange(e) {
    this.setState({[e.target.name]: e.target.value});
      if (e.target.name === 'summaryText') {
        let summaryCounter = this.state.summaryCounter-1;
        this.setState({summaryCounter:summaryCounter})
      } else {
        if (this.state.minBodyCounter > 0) {
          let minBodyCounter = this.state.minBodyCounter-1;
          this.setState({minBodyCounter:minBodyCounter})
        }
        let bodyCounter = this.state.bodyCounter-1;
        this.setState({bodyCounter:bodyCounter})
      }
  }

  postRequest() {
    this.setState({submitted:true})
    console.log(this.state.characterObj, this.state.selectedOption);

    postReview(this.props.productId, this.props.rating, this.state.summaryText,
      this.state.summaryBody, this.state.selectedOption, this.state.displayName,
      this.state.userEmail,[] ,this.state.characterObj)
      .then(() => {
          console.log('form submission success');
      })
      .catch((err) => {
        console.log('form submission error out due to', err);
      })
  }

  render() {
    return (
  <div className="container">
  <div>
  <h4 className='recommend-h4'>Do you recommend this product</h4>
  <form className= 'yesNo-radio'>
  <div className="radio">
        <label>
          <input type="radio" value='true' onChange={this.handleOptionChange} checked={this.state.selectedOption === 'true'} />
          Yes
        </label>
    </div>
    <div className="radio">
      <label>
      <input type="radio" value='false' onChange={this.handleOptionChange} checked={this.state.selectedOption === 'false'}/>
        No
    </label>
  </div>
  </form>
  </div>
  <div className='reviewsummary-container'>
  <label className='review-label'>Review Summary</label>
  <textarea onChange={this.handleTextChange} name='summaryText' value={this.state.summaryText} placeholder='Best purchase ever'></textarea>
  <p className='summary-word-counter'>{this.state.summaryCounter}</p>
  </div>
  <div className='reviewbody-container'>
  <label>Review Body</label>
    <textarea onChange={this.handleTextChange} name='summaryBody' value={this.state.summaryBody} placeholder='Why did you like the product or not?'></textarea>
    <p className='charLeft'>{this.state.minBodyCounter === 0? 'Minimum reached' : `Minimum required characters left ${this.state.minBodyCounter}`
}</p>
<UploadImg />
<label>Nickname</label>
<input className='nickName-input' onChange={this.handleTextChange} name='displayName' placeholder='Example: jackson11!'></input>
<p className='privacy-p'>For privacy reasons, do not use your full name or email address</p>

<label>Email</label>
<input type='email' className='Email-input'  onChange={this.handleTextChange} name='userEmail' placeholder='jackson11@email.com'></input>
<p className='privacy-p'>For authentication reasons, you will not be emailed</p>
  </div>
    <Radio selected={this.handleSelection} title={'Comfort'} descriptions={['Uncomfortable', 'Slightly uncomfortable', 'Ok', 'Comfortable', 'Perfect']}/>
    <Radio selected={this.handleSelection} title={'Quality'} descriptions={['Poor', 'Below average', 'What I expected', 'Pretty great', 'Perfect']}/>
    <Radio selected={this.handleSelection} title={'Length'} descriptions={['Runs Short', 'Runs slightly short', 'Perfect', 'Runs slightly long', 'Runs long']}/>
    <Radio selected={this.handleSelection} title={'Fit'} descriptions={['Runs tight', 'Runs slightly tight', 'Perfect', 'Runs slightly long', 'Runs long']} />
    <div className='submit-wrapper'>
    <button onClick={this.postRequest}>{!this.state.submitted ? 'Submit' : 'Your review has been Submitted'}</button>
    </div>
</div>
    )
  }
}