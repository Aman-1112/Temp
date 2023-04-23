import React from 'react';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';


/// Progress Bar from Material UI
import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { updateUserPic } from './actions';

function CircularProgressWithLabel(props) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="caption" component="div" color="text.secondary">
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}
/////

CircularProgressWithLabel.propTypes = {
  value: PropTypes.number.isRequired,
};

function Profile(props) {
  const handleStatus = (delivery) => {
    let d = new Date();

    const [deliveryYear, deliveryMonth, deliveryDate] = delivery.split('-');

    if (d.getFullYear() < parseInt(deliveryYear)) {
      return false;
    } else if (d.getFullYear() > parseInt(deliveryYear)) {
      return true;
    } else {
      if (d.getMonth() + 1 < parseInt(deliveryMonth)) {
        return false;
      } else if (d.getMonth() + 1 > parseInt(deliveryMonth)) {
        return true;
      } else {
        if (d.getDate() < parseInt(deliveryDate)) {
          return false;
        } else if (d.getDate() > parseInt(deliveryDate)) {
          return true;
        } else {
          return false;
        }
      }
    }
  }

  const [userProfileImage, setUserProfileImage] = useState(null);

  useEffect(() => {
    if (Object.keys(props.userDetail.profile).length && props.userDetail.profile.userPic.name) {
      let userPic = props.userDetail.profile.userPic;
      setUserProfileImage(`data:${userPic.name.split('.')[1]};base64,${userPic.img}`);
    }
  }, [props.userDetail.profile])

  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);

  //BELOW IS CODE TO CONVERT TO BASE64 ENCODING
  // const base64Converter=(binaryArray)=>{
  //   let base64String = btoa(String.fromCharCode(...new Uint8Array(binaryArray)));
  //   return base64String;
  // }

  useEffect(() => {
    if (file) {
      const uploadFile = async () => {
        let fd = new FormData();//FORM OBJECT
        // console.log(file)
        fd.append('userPic', file);//? APPENDS FILE DATA TO FORM OBJECT
        fd.append('userId', props.userDetail.profile.id);//? APPENDS FORM DATA TO FORM OBJECT
        // console.log(fd) //you won't get anything

        // for (var [key, value] of fd.entries()) { 
        //   console.log(key, value);
        // }
        try {
          const res = await axios.post('/api/auth/profile/pic', fd, {
            onUploadProgress: (ProgressEvent) => {
              let uploadPercentage = Math.round((ProgressEvent.loaded / ProgressEvent.total) * 100);
              console.log(uploadPercentage + "%");
              setProgress(uploadPercentage);
            }
          });
          setFile(null);
          setTimeout(() => {
            setProgress(0);
          }, 50);
          let userPic = res.data.userPic;
          await props.updateUserPic(userPic.img)
          setUserProfileImage(`data:${userPic.name.split('.')[1]};base64,${userPic.img}`);
        } catch (error) {
          console.error(error);
          alert(`${error}`)
        }
      }
      uploadFile();
    }
  }, [file])

  const getFile = (e) => {
    setFile(e.target.files[0]);
  }

  //TODO Replace this by using useRef
  const triggerFileInput = () => {
    document.querySelector('.ppfile').click();
  }

  if (!Object.keys(props.userDetail.profile).length) {
    return <h6>Loading....</h6>
  } else {
    return (
      <div className='d-flex flex-md-row flex-column justify-content-evenly'>
        <div className="text-center">
          <h4>My Profile</h4>
          {
            (progress > 0) ?
              <div>
                <CircularProgressWithLabel value={progress} />
              </div>
              :
              <div className="profile-pic-card card ">
                <img className='profile-pic rounded-circle'
                  src={
                    userProfileImage ||
                    props.userDetail.profile.avatar
                  }
                  alt="profilepic"></img>
                <div className="card-img-overlay">
                  <p className='img-text' onClick={triggerFileInput}>Click to upload your image</p>

                  <input className='ppfile' style={{ display: "none" }} onChange={getFile} type="file" name="userPic" ></input>
                </div>
              </div>
          }
          <p><strong>Name</strong> : {props.userDetail.profile.name}</p>
          <p><strong>Email</strong> : {props.userDetail.profile.email}</p>
          <Link className='btn btn-secondary rounded-pill mt-4' to="/">Continue Shopping</Link>
        </div>
        <div>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">ORDER_DATE</th>
                <th scope='col'>DELIVERY_DATE</th>
                <th scope="col">PRODUCTS</th>
                <th scope="col">DELIVERY_STATUS</th>
              </tr>
            </thead>
            <tbody>
              {props.userDetail.orders.map((order, index) =>
                <tr>
                  <th scope="row">{index + 1}</th>
                  <td>{order.orderedAt.split('T')[0]}</td>
                  <td>{order.deliveryDate}</td>
                  <td>{order.orderedItems.map(product => <p className='d-flex justify-content-around'>{product.productName}<strong>X{product.quantity}</strong> </p>)}</td>
                  <td>{handleStatus(order.deliveryDate) ? <h6><i className="fas fa-check fa-2x" style={{ color: "green" }}></i>Delivered
                  </h6> : <h6><i className="far fa-clock fa-2x" style={{ color: "red" }}></i>Pending</h6>}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

}
function mapStateToProps(state) {
  return ({ userDetail: state.userDetailReducer })
}
export default connect(mapStateToProps,{updateUserPic})(Profile)