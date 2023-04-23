import axios from 'axios';
import React from 'react'
import FacebookLogin from 'react-facebook-login';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { verifyToken } from './actions';

function Facebook(props) {

    const history = useHistory();

    const responseFacebook = async (response) => {
        console.log(response);
        console.log(response.name, response.id, response.picture.data.url, response.email);
        const fbUser = { id: response.id, name: response.name, email: response.email }
        const res = await axios.post('/api/auth/fbLogin', fbUser)
        localStorage.setItem('token', res.data);
        await props.verifyToken(localStorage.getItem('token'))
        history.push('/home')
    }

    const handleFailure = (err) => {
        console.log(err);
    }

    return (
        <FacebookLogin
            appId="467605931771862"
            // autoLoad={true}
            fields="name,email,picture"
            size="small"
            cookie="true"
            onFailure={handleFailure}
            callback={responseFacebook} />
    )
}

export default connect(null, { verifyToken })(Facebook)
