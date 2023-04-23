import React, { useEffect } from 'react'
import jwt_decode from "jwt-decode";
import axios from 'axios';
import { connect } from 'react-redux';
import { verifyToken } from './actions/index';
import { useHistory } from "react-router-dom";
function Google(props) {
  const history = useHistory();
  async function onLoginSuccess(res) {
    // console.log(res.credential);
    // console.log(jwt_decode(res.credential));
    let decodedData = jwt_decode(res.credential);
    const user = { name: decodedData.given_name, email: decodedData.email }
    console.log(user);
    let response = await axios.post('/api/auth/googleLogin', user)
    localStorage.setItem('token', response.data);
    await props.verifyToken(localStorage.getItem('token'))
    history.push('/home');
  }

  useEffect(() => {
    setTimeout(() => { //SETTIMEOUT BECOZ FIRST SCRIPT MUST BE LOADED ONLY THEN IT WILL UNDERSTAND GOOGLE.ACCOUNTS
      window.google.accounts.id.initialize({
        client_id: "995982902357-kqvmpqmsuvrnrgff62ofle900mn9lgvc.apps.googleusercontent.com",
        callback: onLoginSuccess
      });

      window.google.accounts.id.renderButton(
        document.querySelector('#google-login'), { theme: "outline", size: "large" }
      )
    }, 500)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div id="google-login">Google</div>
  )
}

export default connect(null, { verifyToken })(Google)
