// Write your code here
import './index.css'
import {Component} from 'react'

import Cookie from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import {Link} from 'react-router-dom'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productDetails: '',
    apiStatus: apiStatusConstants.initial,
    productQuantity: 1,
  }

  componentDidMount() {
    this.getBlogDetails()
  }

  getFormattedSimilarProduct = data => ({
    availability: data.availability,
    brand: data.brand,
    description: data.description,
    id: data.id,
    imageUrl: data.image_url,
    price: data.price,
    rating: data.rating,
    style: data.style,
    title: data.title,
    totalReviews: data.total_reviews,
  })

  getBlogDetails = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const {match} = this.props
    const {params} = match
    const {id} = params

    const token = Cookie.get('jwt_token')
    // console.log(token)
    const url = `https://apis.ccbp.in/products/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await fetch(url, options)
    // console.log(response)

    if (response.ok) {
      const data = await response.json()
      // console.log(data)
      const formattedData = {
        product: this.getFormattedSimilarProduct(data),

        similarProducts: data.similar_products.map(eachItem =>
          this.getFormattedSimilarProduct(eachItem),
        ),
      }

      this.setState({
        productDetails: formattedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      console.log(response.status)
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  decreaseValue = () => {
    const {productQuantity} = this.state
    if (productQuantity > 1) {
      this.setState(prevState => ({
        productQuantity: prevState.productQuantity - 1,
      }))
    }
  }

  increaseValue = () => {
    this.setState(prevState => ({
      productQuantity: prevState.productQuantity + 1,
    }))
  }

  renderOfProductDetails = () => {
    const {productDetails, productQuantity} = this.state
    const {product, similarProducts} = productDetails

    const {
      availability,
      brand,
      description,
      imageUrl,
      price,
      rating,
      title,
      totalReviews,
    } = product

    console.log(productDetails)

    return (
      <>
        <Header />
        <div className="pro-container">
          <img className="product-img" src={imageUrl} alt="product" />
          <div className="data-container">
            <h1 className="product-heading">{title}</h1>
            <p className="product-price">Rs {price}/-</p>

            <div className="rating-con">
              <div className="star-container">
                <p className="rating-para">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="rating-star"
                />
              </div>

              <p className="font-family-para">{totalReviews} Reviews</p>
            </div>

            <p className="font-family-para">{description}</p>
            <p className="font-family-para">
              <span className="available">Available:</span> {availability}
            </p>
            <p className="font-family-para">
              <span className="available">Brand:</span> {brand}
            </p>
            <hr className="horizontal" />
            <div className="increase-items">
              <button
                className="inc-button"
                type="button"
                onClick={this.decreaseValue}
                data-testid="minus "
              >
                <BsDashSquare />
              </button>
              <p className="inc-button padding font-family-para">
                {productQuantity}
              </p>
              <button
                className="inc-button"
                type="button"
                onClick={this.increaseValue}
                data-testid="plus"
              >
                <BsPlusSquare />
              </button>
            </div>
            <button className="add-cart-button" type="button">
              ADD TO CART
            </button>
          </div>
        </div>
        <SimilarProductItem similarProducts={similarProducts} />
      </>
    )
  }

  renderFailureImg = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="products-failure-img"
      />
      <h1 className="failure-heading">Product Not Found</h1>
      <Link to="/products">
        <button className="failure-button" type="button">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  renderLoadingView = () => (
    <div data-testid="loader" className="primedeals-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  render() {
    const {apiStatus} = this.state
    // console.log(apiStatus)

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderOfProductDetails()
      case apiStatusConstants.failure:
        return this.renderFailureImg()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }
}

export default ProductItemDetails
