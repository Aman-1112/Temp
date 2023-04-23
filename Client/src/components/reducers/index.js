import { combineReducers } from "redux";

const fetchProductReducer = (state = [], action) => {
    //REDUCER IS PURE
    let newState;
    switch (action.type) {
        case "FETCH_PRODUCTS":
            //! please try find solution in less than O(N*N)
            newState = [...state];
            for (let i = 0; i < action.payload.length; i++) {
                let j = 0;
                for (; j < newState.length; j++) {
                    if (action.payload[i]._id === newState[j]._id) {
                        break;
                    }
                }
                if (j === newState.length) {
                    newState.push(action.payload[i]);
                }
            }
            return newState;
        case "FETCH_SEARCHED_PRODUCTS":
            //! please try find solution in less than O(N*N)
            newState = [...state];
            for (let i = 0; i < action.payload.length; i++) {
                let j = 0;
                for (; j < newState.length; j++) {
                    if (action.payload[i]._id === newState[j]._id) {
                        break;
                    }
                }
                if (j === newState.length) {
                    newState.push(action.payload[i]);
                }
            }
            return newState;
        case "FETCH_PRODUCT":
            newState = [...state];
            for (let i = 0; i < newState.length; i++) {
                if (newState[i]._id === action.payload._id) {
                    return newState;
                }
            }
            newState.push(action.payload);
            return newState;
        case "PUSH_REV_RAT":
            newState = [...state];
            newState.map((product)=>{
                console.log("pushing rev rat to redux")
                if(product._id===action.payload.productId){
                    delete action.payload.productId;
                    product.rating.push(action.payload);
                }
            })
            return newState;
        default:
            return state;
    }
};

const userDetailReducer = (
    state = { isSignedIn: false, profile: {}, cartItems: [], orders: [] }, action) => {
    switch (action.type) {
        case "VERIFY_TOKEN":
            if (action.payload) {
                return {
                    isSignedIn: true,
                    profile: {
                        id: action.payload.data._id,
                        name: action.payload.data.name,
                        avatar: action.payload.data.avatar,
                        email: action.payload.data.email,
                        userPic:action.payload.data.userPic
                    },
                    cartItems: action.payload.data.myCart,
                    orders: action.payload.data.orders,
                };
            } else {
                return { isSignedIn: false, profile: {}, cartItems: [], orders: [] };
            }
        case "UPDATE_CART":
            let exist = false;
            for (let i = 0; i < state.cartItems.length; i++) {
                if (state.cartItems[i].product._id === action.payload.product._id) {
                    exist = true;
                    state.cartItems[i].quantity =
                        parseInt(state.cartItems[i].quantity) +
                        parseInt(action.payload.quantity);
                }
            }
            if (!exist) {
                state.cartItems.push({
                    product: action.payload.product,
                    quantity: action.payload.quantity,
                });
            }
            return { ...state };
        case "DELETE_ITEM":
            state.cartItems = state.cartItems.filter(
                (item) => item.product._id !== action.payload.productId
            );
            return { ...state };
        case "ADD_ORDER":
            state.cartItems = [];
            state.orders = action.payload.data;
            return { ...state };
        case "UPDATE_PIC":
            // let newState={...state,//!Why error must check
            //     userPic:{
            //         img:action.payload,
            //         name:state.profile.userPic.name
            //     }
            // }
            // return newState;
            state.profile.userPic.img=action.payload;
            return {...state};
        default:
            return state; //MUST NEEDED FOR INTIAL RENDER AND MUST NOT BE UNDEFINED
    }
};

export const rootReducers = combineReducers({
    fetchProductReducer: fetchProductReducer,
    userDetailReducer: userDetailReducer,
});
