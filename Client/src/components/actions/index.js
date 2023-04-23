import axios from 'axios';

export const fetchAllProducts = (page) => {
    return (
        async (dispatch, _getState) => {
            const res = await axios.get('/api/v1/product/List', {
                params: {
                    page: page,
                    limit: 4
                }


            });
            const data = res.data.data;
            dispatch({ type: 'FETCH_PRODUCTS', payload: data })
        }
    )
}

export const fetchSearchedProducts = (searchItem) => {
    return (
        async (dispatch, _getState) => {
            const res = await axios.get(`/api/v1/product/search/${searchItem}`);
            dispatch({ type: 'FETCH_SEARCHED_PRODUCTS', payload: res.data.productList })
        }
    )
}

export const fetchProduct = (productId) => {
    return (
        async (dispatch, _getState) => {
            const res = await axios.get(`/api/v1/product/${productId}`);
            dispatch({ type: 'FETCH_PRODUCT', payload: res.data.data })
        }
    )
}

export const verifyToken = (token) => {//VERIFYING USER AND UPDATING CART OF REDUX STORE
    return (
        async (dispatch, _getState) => {
            let res = null;
            if (token) {
                res = await axios.get('/api/auth/verify', {
                    params: {
                        token: token
                    }
                });
                console.log('verifytokens',res,res.data);
            }
            dispatch({ type: 'VERIFY_TOKEN', payload: res })//THIS WON'T RUN IF THERE WILL BE ERROR IN ABOVE REQUEST
        }
    )
}

export const addProductToCart = (item) => { //ADDING TO CART (DB AND REDUX) AND SAME FOR INCRE/DECREMENT
    console.log("payload_item_from_addProductToCart",item);
    return (
        async (dispatch, getState) => {
            await axios.post('/api/auth/updateCart', item)
            dispatch({ type: 'UPDATE_CART', payload: item });
        }
    )
}

export const deleteItem = (ids) => {
    return (
        async (dispatch, _getState) => {
            dispatch({ type: 'DELETE_ITEM', payload: ids })
            await axios.post('/api/auth/delete', ids)
        }
    )
}

export const addOrder=(order)=>{
    return(
        async (dispatch)=>{
            const res=await axios.post('/api/auth/addOrder',order)
            console.log('locha',res);
            dispatch({type:'ADD_ORDER',payload:res})
        }
    )
}

export const updateUserPic=(userPic)=>{// TODO MAKE PROPER ACTION CREATOR
    console.log("update pic in redux")
    return ({type:'UPDATE_PIC',payload:userPic});
}

export const pushRevRat=(revRatObj)=>{// TODO MAKE PROPER ACTION CREATOR
    return({type:'PUSH_REV_RAT',payload:revRatObj})
}