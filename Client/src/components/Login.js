import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import GoogleIcon from '../images/google-icon.svg'
import FacebookIcon from '../images/facebook-icon.svg'
import { connect } from 'react-redux'
import { verifyToken } from './actions/index';
import Google from './Google'
// import Facebook from './Facebook'
const Login = (props) => {
    const [credentials, setCredentials] = useState({ email: "", password: "" })
    const [showPassword, setShowPassword] = useState(false);
    let history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: credentials.email, password: credentials.password })
        });
        const json = await response.json();
        console.log(json);
        if (json.success) {
            localStorage.setItem('token', json.authtoken);
            props.verifyToken(localStorage.getItem('token'));
            history.push('/');
        }
        else {
            alert('Invalid Credentials')
        }
    }

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    return (
        <div className='container'>

            <div className="header text-center my-4">
                <p className="fw-bold fs-3">Login</p>
                <p className="newUser">Not registered yet? <Link className='text-decoration-none' to="/signup">Sign Up</Link>
                </p>
            </div>
            <div className="row g-3 align-items-center">
                <div className="col mx-auto col-sm-4">
                    <div className="form">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email address</label>
                                <input type="email" className="form-control" id="email" name='email' value={credentials.email} onChange={onChange} aria-describedby="emailHelp" />
                            </div>
                            
                            <label htmlFor="password" className="form-label">Password</label>
                            <div className="input-group mb-3 ">
                                <input type={showPassword?"text":"password"} className="form-control" id="password" name='password' value={credentials.password} onChange={onChange} ></input>
                                {showPassword?
                                <span onClick={()=>setShowPassword(false)} class="input-group-text" id="basic-addon1"><i class="fa-solid fa-eye"></i></span>
                                :<span onClick={()=>setShowPassword(true)} class="input-group-text" id="basic-addon1"><i class="fa-solid fa-eye-slash"></i></span>}
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                                <button type="submit" className="btn btn-primary my-2 col-5">Login</button>
                                <Link className='text-decoration-none' to="/forgot-password">Forgot Password</Link>
                            </div>
                        </form>
                        <div className="social-login my-4">
                            <div className="social-login-container d-flex align-items-center justify-content-between">
                                <div className="line" style={{ borderTop: '1px solid black', width: '33%' }}></div>
                                <p className='social-login-content'>Or Sign In With</p>
                                <div className="line" style={{ borderTop: '1px solid black', width: '33%' }}></div>
                            </div>
                            <div className="social-login-icons my-3 d-flex align-items-center justify-content-evenly">
                                <Google />
                                {/* <Facebook /> */}
                                {/* <a href='/#'><img src={GoogleIcon} alt="Google" height={35} width={35} /></a> */}
                                {/* <a href='/#'><img src={FacebookIcon} alt="Facebook" height={35} width={35} /></a> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default connect(null, { verifyToken })(Login)