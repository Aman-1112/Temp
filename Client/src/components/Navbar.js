import React, { useState, useEffect } from 'react';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { FiLogOut } from 'react-icons/fi';
import { VscAccount } from 'react-icons/vsc';
import { Link, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { verifyToken } from './actions/index';

function Navbar(props) {
    const [isSignedIn, setIsSignedIn] = useState(false);
    let history = useHistory();

    const handleLogout = async () => {
        localStorage.removeItem('token');
        await props.verifyToken(localStorage.getItem('token'))//TAKES TIME
        setIsSignedIn(props.userDetail.isSignedIn);
        history.push('/home');
    }
    const [search, setSearch] = useState('');//DON'T USE NULL COZ VALUE ATTR.CAN'T BE NULL INSTEAD CONSIDER EMPTY STRING
    useEffect(() => {
        (async () => {
            await props.verifyToken(localStorage.getItem('token'))
            setIsSignedIn(props.userDetail.isSignedIn)
        })()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.userDetail.isSignedIn])

    function handleBadge() {
        if (props.userDetail.cartItems.length !== 0) {
            let count = 0;
            props.userDetail.cartItems.forEach(item => count = count + parseInt(item.quantity))
            return (<span className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger'>{count}</span>)
        } else {
            return null
        }
    }
    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <Link className="navbar-brand ps-1" to="/home">E-commerce</Link>
                    <button className="navbar-toggler me-4" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon "></span>
                    </button>
                    <div className="collapse navbar-collapse justify-content-evenly " id="navbarSupportedContent">
                        <form className="d-flex my-2" >
                            <input className="form-control me-2" type="search" placeholder="Search" onChange={e => { setSearch(e.target.value) }} value={search} aria-label="Search" />
                            <Link to={`/search/${search}`}><button className="btn btn-outline-dark" type="submit" style={{ marginRight: '1rem' }}>Search</button></Link>
                        </form>
                        <div>
                            <Link className='text-reset text-decoration-none mx-3 position-relative' to="/cart"><AiOutlineShoppingCart size={33} /><strong>Cart</strong>
                                {handleBadge()}
                            </Link>
                            {!isSignedIn ? <Link className='text-reset text-decoration-none mx-2' to="/login"><VscAccount size={33} /><strong>Signin</strong></Link> : <button style={{ border: "none", background: "bottom" }} onClick={handleLogout}><FiLogOut size={30} /><strong>Logout</strong></button>}
                        </div>
                    </div>
                </div>
                
                {isSignedIn ?<>
                    <Link to="/profile"><img style={{border:"1px solid black",borderRadius:"100%",width:"4rem",height:"4rem"}} 
                    src={
                        props.userDetail.profile.hasOwnProperty('userPic')?
                        `data:${props.userDetail.profile.userPic.name.split('.')[1]};base64,${props.userDetail.profile.userPic.img}`
                        :
                        `${props.userDetail.profile.avatar}&size=50`} alt='profilepic'></img></Link>
                    <h6 style={{ marginRight: "5rem" }}> Welcome! <br />{(props.userDetail.profile.name)}</h6></>
                    : 
                    null}
            </nav>
        </div>
    )
}
function mapStateToProps(state) {
    return ({ userDetail: state.userDetailReducer })
}
export default connect(mapStateToProps, { verifyToken })(Navbar)