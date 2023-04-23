import React from 'react'
import { connect } from 'react-redux';
import { deleteItem, addProductToCart } from './actions/index';
function CartItem(props) {

    return (
        <li className='d-flex flex-md-row flex-column align-items-center justify-content-between CartItem my-2' style={{ backgroundColor: "rgb(248,249,250)" }}>
            <img className="ms-5" src={`http://${props.productImg}`} alt="sorry!"></img>
            <h5 className='w-25'>{props.productName}</h5>
            <h6 className='me-2'>{`$${props.productPrice}`}</h6>
            <div className='d-flex operator'>
                <button className="btn btn-dark fa-solid fa-plus" onClick={() => props.addProductToCart({ id: props.userDetail.profile.id, product: props.product, quantity: '1' })}></button>
                <div className='mx-2'>{props.quantity}</div>
                <button className="btn btn-dark fa-solid fa-minus" onClick={() => props.addProductToCart({ id: props.userDetail.profile.id, product: props.product, quantity: '-1' })}></button>
            </div>
            <button className="btn btn-danger fa-solid fa-trash" onClick={() => props.deleteItem({ userId: props.userDetail.profile.id, productId: props.productId })}></button>
        </li>
    )
}
function mapStateToProps(state) {
    return {
        userDetail: state.userDetailReducer
    }
}
export default connect(mapStateToProps, { deleteItem, addProductToCart })(CartItem)