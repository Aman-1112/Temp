import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link } from 'react-router-dom';

import { fetchAllProducts } from './actions';
import Card from './Card';
import './ProductList.css';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

function ProductList(props) {
  const [productList, setProductList] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    props.fetchAllProducts(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const firstUpdate = useRef(true);

  useEffect(() => {//WILL NOT RUN ON INITIAL RENDER so we used firstUpdate
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    if (props.fetchProductReducer.length < (page * 4)) {//where 4 is limit
      setHasMore(false);
    }
    setProductList(props.fetchProductReducer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props])

  function fetchData() {
    setPage(page + 1);
  }

  useEffect(() => {
    if (productList.length !== 0) {
      props.fetchAllProducts(page);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  return (
    <>
    <InfiniteScroll
      dataLength={productList.length}
      next={fetchData}
      hasMore={hasMore}
      loader={<div className="d-flex flex-column flex-sm-row justify-content-evenly text-center">
        <Skeleton style={{ width: "250px", height: "300px", margin: "1rem" }}></Skeleton>
        <Skeleton style={{ width: "250px", height: "300px", margin: "1rem" }}></Skeleton>
        <Skeleton style={{ width: "250px", height: "300px", margin: "1rem" }}></Skeleton>
        <Skeleton style={{ width: "250px", height: "300px", margin: "1rem" }}></Skeleton>
      </div>
        // <div className="m-5 d-flex justify-content-center">
        //   <div className="spinner-border" role="status">
        //     <span className="visually-hidden">Loading...</span>
        //   </div>
        // </div>
      }
      endMessage={
        <p style={{ textAlign: 'center' }}>
          <b>Yay! You have seen it all</b>
        </p>
      }
    >
      {
        <>
          {productList.length ? <div id="carouselExampleIndicators" className="carousel slide " data-bs-ride="carousel">

            <div className="carousel-inner">
              <div className="carousel-item active " data-bs-interval="2000" >
                <Link style={{ color: "black" }} to='/product/6293e17305cc0cca7a52869e'>
                  <img className="carousel-img" src={"https://m.media-amazon.com/images/I/61Tc7hKz-lS._SX679_.jpg"} alt="..." />
                  <div className="info">
                    <h5>Mi Smart Band 6</h5>
                    <h5>$34.99</h5>
                  </div>
                </Link>
              </div>
              <div className="carousel-item " data-bs-interval="2000">
                <Link style={{ color: "black" }} to='/product/6295f8cceb1141d3a890c8d3'>
                  <img className="carousel-img" src={"http://i0.wp.com/living.ai/wp-content/uploads/2020/12/product2.jpg?resize=1536%2C1536&ssl=1"} alt="..." />
                  <div className="info">
                    <h5>EMO: The Coolest AI Desktop Pet</h5>
                    <h5>$199.99</h5>
                  </div>
                </Link>
              </div>

              <div className="carousel-item" data-bs-interval="2000">
                <Link style={{ color: "black" }} to='/product/6295fb8aeb1141d3a890c8d5'>
                  <img className="carousel-img" src={"http://lp2.hm.com/hmgoepprod?set=format%5Bwebp%5D%2Cquality%5B79%5D%2Csource%5B%2Fe2%2Fb4%2Fe2b488f870a9306c4057e2c6f154cb3e76544599.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5Bmen_tshirtstanks_shortsleeve%5D%2Ctype%5BDESCRIPTIVESTILLLIFE%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url%5Bfile%3A%2Fproduct%2Fmain%5D"} alt="..." />
                  <div className="info">
                    <h5>H&M : T-shirt</h5>
                    <h5>$69.9</h5>
                  </div>
                </Link>
              </div>
              <div className="carousel-item" data-bs-interval="2000">
                <Link style={{ color: "black" }} to='/product/6296100beb1141d3a890c916'>
                  <img className="carousel-img" src={"http://lp2.hm.com/hmgoepprod?set=format%5Bwebp%5D%2Cquality%5B79%5D%2Csource%5B%2F62%2Fd4%2F62d43f21d0ea977e33de7c35a846cbc5a76ab644.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5Bladies_dresses_mididresses%5D%2Ctype%5BDESCRIPTIVESTILLLIFE%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url%5Bfile%3A%2Fproduct%2Fmain%5D"} alt="..." />
                  <div className="info">
                    <h5>H&M : sleeveless Shirt</h5>
                    <h5>$99</h5>
                  </div>
                </Link>
              </div>
            </div>
            <button className="carousel-control-prev " type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" ></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next " type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
              <span className="carousel-control-next-icon" ></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div> : <Skeleton style={{ width: "100%", height: "12rem" }}></Skeleton>}
          {productList.length !== 0 && (
            <div style={{ textAlign: 'center' }}>
              {productList.map((ele, index) => (
                <Card
                  key={index}
                  id={ele._id}
                  name={ele.name}
                  imageUrl={ele.image}
                  brand={ele.brand}
                  price={ele.price}
                  rating={ele.rating}
                />
              ))}
            </div>
          )}
        </>
      }
    </InfiniteScroll>
      <footer className="bg-dark text-white">Made By Abhishek & Aman &copy;2022</footer>
    </>
  )
}

function mapStateToProps(state) {
  return { fetchProductReducer: state.fetchProductReducer }
}

export default connect(mapStateToProps, { fetchAllProducts })(ProductList)

