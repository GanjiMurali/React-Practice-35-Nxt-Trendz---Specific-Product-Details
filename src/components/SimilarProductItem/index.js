// Write your code here
import './index.css'

const SimilarProductItem = props => {
  // const {similarProducts} = props

  const getSimilarProductCard = () => {
    const {similarProducts} = props
    return similarProducts.map(eachValue => {
      const {brand, imageUrl, price, rating, title, id} = eachValue
      return (
        <li className="similar-list-item" key={id}>
          <img className="similar-img" src={imageUrl} alt="similar product" />
          <h1 className="similar-para">{title}</h1>
          <p className="similar-brand">by {brand}</p>
          <div className="similar-rating">
            <p className="similar-price">Rs: {price}/-</p>
            <div className="star-container">
              <p>{rating}</p>
              <img
                src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                alt="star"
                className="rating-star"
              />
            </div>
          </div>
        </li>
      )
    })
  }

  return (
    <div className="similar-cards-con">
      <h1 className="similar-product-heading">Similar Products</h1>
      <ul className="unOrder-list">{getSimilarProductCard()}</ul>
    </div>
  )
}

export default SimilarProductItem
