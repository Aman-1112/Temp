import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { verifyToken } from './actions/index';
import CartItem from './CartItem';
import { Link } from 'react-router-dom';
import './ShoppingCart.css';

function ShoppingCart(props) {
    useEffect(() => {
        props.verifyToken(localStorage.getItem('token'));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    function handleCart() {

        if (props.userDetail.cartItems.length !== 0) {
            return (props.userDetail.cartItems.map(item =>
                <CartItem
                    key={item.product._id}
                    productId={item.product._id}
                    productName={item.product.name}
                    productImg={item.product.image}
                    productPrice={item.product.price}
                    quantity={item.quantity}
                    product={item.product}
                />))
        }
        else {
            return (<h4>Your Cart is Empty ...Poor</h4>)
        }
    }

    function handleProductPrice() {
        if (props.userDetail.cartItems)
            return (props.userDetail.cartItems.map((item, index) =>
                
                <tr>
                    <th scope="row">{index + 1}</th>
                    <td>{item.product.name}</td>
                    <td>${`${(item.product.price * item.quantity).toFixed(2)}`}</td>
                </tr>))
    }
    function calculateTotal() {
        let total = 0;
        if (props.userDetail.cartItems.length !== 0) {
            props.userDetail.cartItems.forEach(item => total += (item.product.price * item.quantity))
            total += 50.00;
            return total.toFixed(2);
        } else {
            return '0.00';
        }
    }
    return (
        <div>
            <div>
                <h2 className="d-inline-block me-5">Your Shopping Cart</h2>
                <Link to="/">Continue Shopping</Link>
            </div>
            <ul className='list-group '>
                {handleCart()}
            </ul>
            <div className="card sub-total" >
                <div className="card-body">
                    <h5 className="card-title">Sub-Total</h5>
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Product</th>
                                <th scope="col">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {handleProductPrice()}
                            {props.userDetail.cartItems.length ? <tr>
                                <td></td>
                                <td>Delivery Charge</td>
                                <td>$50.00</td>
                            </tr> : null}
                            <tr>
                                <td></td>
                                <td></td>
                                <td>${calculateTotal()}</td>
                            </tr>
                        </tbody>
                    </table>
                    {props.userDetail.cartItems.length ?
                        <Link to="/shipping" className="btn btn-dark w-100">Place Order</Link>
                        : <Link to="/shipping" className="btn btn-dark disabled w-100">Place Order</Link>}
                </div>
            </div>
        </div>
    )
}
const mapStateToProps = (state) => {
    return ({ userDetail: state.userDetailReducer })
}

export default connect(mapStateToProps, { verifyToken })(ShoppingCart)