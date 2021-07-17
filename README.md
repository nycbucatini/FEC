# FEC
[atelier37.herokuapp.com](http://atelier37.herokuapp.com)
An e-commerce platform. Minimalist with bright colors, designed with younger consumers in mind.

# Team
- Anthony Ye : [Product Overview](#Product-Overview), [Questions and Answers](#Questions-and-Answers)

- David Wang : [Ratings and Reviews](#Ratings-and-Reviews)

- Iva Pierotic : [Related Items](#Related-Items)

---

## Built With
> Frontend

<img src="https://img.shields.io/badge/Framework-React-%2362DAFB?logo=react"/><img src="https://img.shields.io/badge/Bundler-Webpack-%2375AFCC?logo=webpack"/><img src="https://img.shields.io/badge/Framework-Express.js-critical?logo=express"/> <img src="https://img.shields.io/badge/HTTP-Axios-purple"/>

---

## Project Initialization

1. Ensure node is installed on your development environment

2. Run npm install to install packages

3. Create a new file config.js in the project directory with your api key.
```
  export default const KEY = 'api key';
```
4. npm run react-dev to bundle files
5. npm run server-dev to start server
6. Go to localhost:3000 in browser which will automatically redirect to /product/11001

# Product Overview

- Default Gallery with thumbnail carousel
- Expanded Gallery with thumbnail carousel
- 2.5X Zoom and Pan
- Conditionally rendered thumbnail arrows
- Product Information panel with adjusted styling for on sale styles
- Style selector widget with image icons and SVG overlay for selected style
- Size and Quantity selectors
- Favorite button that interacts with Related Products widget
- Product Description and Features

# Related Items

- Related products tile carousel
- Saved Outfits tile carousel
- Product image, link, price, and review stars
- product comparison modal
- Save outfit button using window.localStorage
- Remove from saved button
# Questions and Answers

- Search bar highlights matching text
- Mark Question or Answer as Helpful
- Report Question or Answer
- Load more questions and load more answers buttons
- Expand Image modal
- Add Question modal
- Add Answers modal with image upload

# Ratings and Reviews

- New Review Modal with image upload
- Review detail radio buttons
- Mark review helpful
- Report Review
- Overview graphic with characteristics bars
- Sort reviews
