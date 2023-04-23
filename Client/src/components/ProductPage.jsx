import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import {GlassMagnifier} from 'react-image-magnifiers';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { fetchProduct, verifyToken, addProductToCart, pushRevRat } from './actions/index';
import './ProductPage.css';
import Rating from '@mui/material/Rating';

function ProductPage(props) {
  const quantity = useRef(0);
  const history = useHistory();
  const productId = props.match.params.productId;

  useEffect(() => {
    props.fetchProduct(productId);
    props.verifyToken(localStorage.getItem('token'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const product = props.Products.find(({ _id }) => _id === productId)

  function handleAddToCart(e) {
    e.preventDefault();
    // console.log(quantity.current.value);
    if (!quantity.current.value) {
      alert("Input some Quantity!")
      return;
    } else {
      if (props.userDetail.isSignedIn) {
        // console.log(props.userDetail);
        let productCopy = { ...product };
        delete productCopy.rating;//REMOVING RATING SECTION CAUSE PAYLOAD GETTING TOO LARGE
        props.addProductToCart({ id: props.userDetail.profile.id, product: productCopy, quantity: quantity.current.value })
        history.push('/cart')
      } else {
        history.push('/login')
      }
    }
  }

  const [rating, setRating] = useState(null);
  const [review, setReview] = useState("");

  const submitRevRat = async () => {
    if(props.userDetail.isSignedIn===false){
      history.push('/login')
      return;
    }

    if (rating === null) {
      alert('Please Enter the Rating');
      return;
    }
    if (review === "") {
      alert('Please Enter the review');
      return;

    }
    try {
      const res = await axios.post('/api/v1/product/revRat', { productId, userId: props.userDetail.profile.id, rating, review });
      console.log(res);

      props.pushRevRat({ productId, userId: {_id:props.userDetail.profile.id, userPic: props.userDetail.profile.userPic, name: props.userDetail.profile.name, avatar: props.userDetail.profile.avatar }, rating, review })
      setRating(null);
      setReview("");
    } catch (error) {
      alert(error);
    }
  }

  function calculateAvgRating() {
    if (props.Products.length === 0) return 0;
    let sum = 0;
    let count = 0;
    product.rating.map((revRatObj) => {
      sum += revRatObj.rating;
      count++;
    });
    if (count === 0) return 0;
    else
      return sum / count;
  }

  function renderWriteReview() {
    if ((product.rating.find(rate => rate.userId._id === props.userDetail.profile.id)) === undefined
      &&
      props.userDetail.orders.map(item => item.orderedItems.find(ordItem => ordItem.productId === product._id)) !== undefined
    ) {
      // console.log("render write review");
      return true;
    } else {
      // console.log("do not render write review");
      return false;
    }
  }

  if (!product) {
    return <div className="loader">Loading...</div>
  } else {
    return (
      <>
        <button className="btn btn-secondary home" onClick={() => window.history.back()}><ArrowBackIcon/></button>
        <div className="container">
          <div className="row">
            <div id="productImage" className="col-12 col-md-5 ">
              {/* <GlassMagnifier
                className="productImg"
                imageSrc={`https://${product.image}`}
                magnifierBorderColor="grey"
                magnifierSize="40%"
                imageAlt="Product image"
              /> */}
            </div>
            <div className="col-12 col-md-4 productDetail" >
              <h2>{product && product.brand[0].toUpperCase() + product.brand.slice(1)}</h2>
              <hr />
              <h2>{product.name}</h2>
              <hr />
              <Rating name="half-rating-read" precision={0.5} readOnly value={calculateAvgRating()} />
              <hr />
              <p><strong>Price:</strong> ${product.price}</p>
              <hr />
              <p><strong>Description: </strong>{product.description ? product.description : product.name}</p>
              <p><strong>Category: </strong>{product.category}</p>
            </div>
            <div className="col-12 col-md-3">
              <div className="card card-of-detail" >
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">Price:<p className="price">${product.price}</p></li>
                  <li className="list-group-item">Quantity:
                    <select className="form-select w-50" ref={quantity} >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                      <option value="8">8</option>
                      <option value="9">9</option>
                      <option value="10">10</option>
                    </select></li>
                  <li className="list-group-item cart"><a href='/#' onClick={handleAddToCart} className="btn btn-dark">Add to Cart</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className='revRatSection d-flex flex-column flex-lg-row'>

          {product.rating.map((revRatObj) => {
            return (
              <div className='customerRevRat w-lg-50 w-100'>
                <h5>Customer Ratings</h5>
                {/* TODO DO BINARY TO BASE64 CONVERSION IN PRODUCT CONTROLLER
                <img className='profile-pic rounded-circle'
                src={
                 revRatObj.userId.userPic.img.data
                 ||
                 revRatObj.userId.avatar
                }
                alt="profilepic"></img> */}
                <p>{revRatObj.userId.name}</p>
                <Rating name="half-rating-read" precision={0.5} readOnly value={revRatObj.rating} />
                <p>{revRatObj.review}</p>
                <hr></hr>
              </div>
            )

          })}

        {
          renderWriteReview() ?
            <div className="form-group writeReview w-lg-50 w-100">
              <h5>Write Review</h5>
              <select onChange={e => setRating(parseInt(e.target.value))} className="form-control" id="rating">
                <option value="none" selected={!rating} disabled hidden>Select a rating</option>
                <option value="1">1 Useless</option>
                <option value="2">2 Poor</option>
                <option value="3">3 Ok</option>
                <option value="4">4 Good</option>
                <option value="5">5 Excellent</option>
              </select>
              <textarea onChange={(e) => setReview(e.target.value)} className="form-control" id="review" rows="3" value={review} placeholder="Comment"></textarea>
              <button onClick={submitRevRat} className="btn btn-primary">Submit</button>
            </div> :
            null
        }

      </div>
      </>
    )
  }
}
function mapStateToProps(state) {
  return {
    Products: state.fetchProductReducer,
    userDetail: state.userDetailReducer
  }
}
export default connect(mapStateToProps, { fetchProduct, verifyToken, addProductToCart, pushRevRat })(ProductPage)