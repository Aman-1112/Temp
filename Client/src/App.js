import React from "react";
import "./App.css"
import Login from "./components/Login";
import Signup from "./components/Signup";
import ForgotPassword from "./components/ForgotPassword";
import Navbar from "./components/Navbar";
import Errorpage from "./components/Errorpage";
import ProductList from "./components/ProductList";
import SearchList from "./components/SearchList/SearchList";
import ProductPage from "./components/ProductPage";
import CreateProduct from "./components/Temporary/CreateProduct";
import ShoppingCart from "./components/ShoppingCart";
import Shipping from"./components/Shipping";
import Profile from './components/Profile';
import { BrowserRouter as Router,Switch,Route} from "react-router-dom";

function App() {
  return (
    <div>
      <Router>
        <Navbar/>
        <Switch>
          <Route exact path="/" component={ProductList}></Route>
          <Route exact path="/home" component={ProductList}></Route>
          <Route exact path="/login" component={Login}></Route>
          <Route exact path="/signup" component={Signup}></Route>
          <Route exact path="/forgot-password" component={ForgotPassword}></Route>
          <Route exact path="/search/:searchItem" component={SearchList}></Route>
          <Route exact path="/product/:productId" component={ProductPage}></Route>
          <Route exact path="/createproduct" component={CreateProduct}></Route>
          <Route exact path="/cart" component={ShoppingCart}></Route>
          <Route exact path="/shipping" component={Shipping}></Route>
          <Route exact path="/profile" component={Profile}></Route>
          <Route component={Errorpage}></Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
