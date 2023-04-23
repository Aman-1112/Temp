import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { connect } from 'react-redux';
import { verifyToken, addOrder } from './actions';
import { useHistory, Link } from 'react-router-dom';
import moment from 'moment';

const steps = [
  'Shipping Address',
  'Payment',
  'Order Confirmation'];

function Shipping(props) {
  const history = useHistory();
  React.useEffect(() => {
    (async () => {
      try {
        await props.verifyToken(localStorage.getItem('token'))
      } catch (error) {
        console.error(error);
        history.push('/login')
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const firstTime = React.useRef(true);

  React.useEffect(() => {
    if (firstTime.current) {
      firstTime.current = false;
      return;
    }
    console.log(props.userDetail);
    if (props.userDetail.cartItems.length === 0 && activeStep < 3) {
      history.push('/cart')
      alert('Pls add items to your cart')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props])

  const [activeStep, setActiveStep] = React.useState(0);
  /************personal info Logic****/
  const [data, setData] = React.useState({
    phoneNo: null,
    streetAddress: null,
    city: null,
    zipCode: null,
    country: null
  });
  const handleData = (e) => {
    setData({ ...data, [e.target.id]: e.target.value })
  }
  /************************/
  const [errorObj, setErrorObj] = React.useState([])
  const handleNext = () => {
    console.log("handle Next Called");
    if (activeStep === 0) {

      let copy = [];
      if (!data.phoneNo || data.phoneNo.length < 4 || isNaN(Number(data.phoneNo))) {
        copy.push("phoneNo")
      }
      if (!data.streetAddress) {
        copy.push("streetAddress")
      }
      if (!data.city) {
        copy.push("city")
      }
      if (!data.zipCode || data.zipCode.length < 3 || isNaN(Number(data.zipCode))) {
        copy.push("zipCode")
      }
      if (!data.country) {
        copy.push("country")
      }
      setErrorObj(copy)

      if (copy.length === 0) {
        setErrorObj([]);

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    }
    else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  /**************paymentMode Logic**********/
  const [mode, setMode] = React.useState('Card');

  const handleChange = (event) => {
    setMode(event.target.value);
  };
  /******************************/

  /*****************Card Logic ***********/
  const [card, setCard] = React.useState("")
  const [expiry, setExpiry] = React.useState("")

  function handleCard(e) {
    let oldValue = e.target.value;
    oldValue = oldValue.replaceAll('-', '');
    let newValue = "";
    for (let i = 0; i < oldValue.length; i++) {
      if (i % 4 === 0 && i !== 0) newValue += '-';
      newValue += oldValue[i];
    }
    setCard(newValue)
  }

  function handleExpiry(e) {
    let oldValue = e.target.value;
    oldValue = oldValue.replaceAll('/', '');
    let newValue = "";
    for (let i = 0; i < oldValue.length; i++) {
      if (i % 2 === 0 && i !== 0) newValue += '/';
      newValue += oldValue[i];
    }
    setExpiry(newValue)
  }
  function handleCardHolder(e) {
    setCardHolder(e.target.value);
  }
  /**********************/

  const [cardHolder, setCardHolder] = React.useState(null)
  const handlePayment = async () => {
    let copy = [];
    let m = mode === 'Card' ? document.querySelector('#cvv').value : document.querySelector('#upi-id').value;

    if (mode === 'Card') {
      if (!card || card.length !== 19 || isNaN(Number(card.replaceAll('-', '')))) {
        copy.push("card");
      }
      if (!expiry || expiry.split('/')[0] * 1 > 12 || isNaN(Number(expiry.replace('/', '')))) {
        copy.push('expiry')

      }
      if (!cardHolder) {
        copy.push('cardHolder')
      }
      if (m === '' || isNaN(Number(m))) { // NO STATE DUE TO PRIVACY ISSUE
        copy.push(mode)
      }
      if (expiry.split('/')[1] * 1 < moment().format('YY') * 1) {
        copy.push('cardExpired');
      }
    } else {
      if (m === '' || !m.includes('@ok') || !m.split('@ok')[1]) {
        copy.push(mode)
      }
    }
    setErrorObj(copy);
    if (copy.length === 0) {
      setErrorObj([]);

      /***DELIVERY DATE */
      const today = moment();
      const tenDaysLater = moment(today).add(10, 'days').format('YYYY-MM-DD');
      /************** */

      setActiveStep(3);//! HACK TO REMOVE BUG
      await props.addOrder({
        userId: props.userDetail.profile.id,
        orderedItems: props.userDetail.cartItems.map(item => { return ({productId:item.product._id, productName: item.product.name, quantity: item.quantity }) }),
        phoneNo: data.phoneNo,
        streetAddress: data.streetAddress,
        city: data.city,
        zipCode: data.zipCode,
        country: data.country,
        deliveryDate: tenDaysLater
        //not adding card to db
      })
    }
  }
  /******************************************************STEP 0 SHIPPING_ADDRESS**********************************************/
  const shippingAddress = () => {
    return (
      <div sx={{ mt: 3 }}>
        <TextField
          id="phoneNo"
          label="Phone No"
          type="tel"
          required
          inputProps={{ maxLength: 10 }}
          value={data.phoneNo}
          onChange={handleData}
          margin="normal"
          error={errorObj.includes("phoneNo") ? true : false}
          helperText={errorObj.includes("phoneNo") ? "Pls Enter Valid Phone Number" : null}
        />
        <br />
        <TextField
          id="streetAddress"
          label="Street Address"
          variant="outlined"
          required
          inputProps={{
            maxLength: 40
          }}
          value={data.streetAddress}
          onChange={handleData}
          margin="normal"
          error={errorObj.includes("streetAddress") ? true : false}
          helperText={errorObj.includes("streetAddress") ? "Pls Enter Valid Street Address" : null} />
        <br />
        <TextField
          id="city"
          label="City"
          variant="outlined"
          required
          inputProps={{ maxLength: 20 }}
          value={data.city}
          onChange={handleData}
          margin="normal"
          error={errorObj.includes("city") ? true : false}
          helperText={errorObj.includes("city") ? "Pls Enter Valid city" : null} />
        <br />
        <TextField
          id="zipCode"
          label="Postal/Zip Code"
          variant="outlined"
          required
          inputProps={{ maxLength: 20 }}
          value={data.zipCode}
          onChange={handleData}
          margin="normal"
          error={errorObj.includes("zipCode") ? true : false}
          helperText={errorObj.includes("zipCode") ? "Pls Enter Valid zipCode" : null} />
        <br />
        <TextField
          id="country"
          label="Country"
          variant="outlined"
          required
          inputProps={{ maxLength: 20 }}
          value={data.country}
          onChange={handleData}
          margin="normal"
          error={errorObj.includes("country") ? true : false}
          helperText={errorObj.includes("country") ? "Pls Enter Valid country" : null} />
      </div>
    )
  }
  /******************************************************STEP 1 PAYMENT_MODE**********************************************/
  const payment = () => {
    return (
      <div style={{ marginTop: "4rem" }}>
        <FormControl>
          <FormLabel sx={{ mb: 2 }}>Payment Mode</FormLabel>
          <RadioGroup
            value={mode}
            onChange={handleChange}
          >
            <FormControlLabel id="check-box" value="Card" control={<Radio />} label="Credit/Debit Card" />
            <FormControlLabel id="check-box" value="Upi" control={<Radio />} label="UPI(Google Pay)" />
          </RadioGroup>
        </FormControl>
      </div>
    )
  }
  /******************************************************STEP 2 ORDER_CONFIMATION**********************************************/
  const placeOrder = () => {

    function handleTotal() {
      let total = 0;
      props.userDetail.cartItems.forEach(item => total += (item.product.price * item.quantity));
      total += 50.00;
      return total.toFixed(2);
    }
    return (
      <div className='d-flex flex-md-row flex-column'>
        <div className='d-inline-block w-md-50 w-100 text-start'>
          <div className="card text-dark bg-light mb-3" >
            <div className="card-body">
              <h6 className='text-center w-75'>Summary</h6>
              <div className='d-flex flex-row justify-content-around'>
                <div>
                  <div className='d-flex justify-content-between'>
                    <h6 className="card-title"><strong>Your Information</strong></h6>
                  </div>
                  <hr style={{ borderTop: "1.5px dashed black", background: "none", marginTop: 0 }} />
                  <div className="mb-4">
                    <p className="card-text">{props.userDetail.profile.name}</p>
                    <p className="card-text">{props.userDetail.profile.email}</p>
                  </div>
                </div>
                <div>
                  <div className='d-flex justify-content-between'>
                    <h6 className="card-title"><strong>Shipping Address</strong></h6>
                    <a href="/#" onClick={(e) => { e.preventDefault(); setActiveStep(0) }} ><i className="fa-solid fa-pen-to-square"></i></a>
                  </div>
                  <hr style={{ borderTop: "1.5px dashed black", background: "none", marginTop: 0 }} />
                  <div className="mb-4">
                    <p className="card-text">{data.streetAddress}</p>
                    <p className="card-text">{data.city}</p>
                    <p className="card-text">{data.zipCode}</p>
                    <p className="card-text">{data.country}</p>
                    <p className="card-text">{data.phoneNo}</p>
                  </div>

                </div>
              </div>
              <div className='d-flex justify-content-between'>
                <h6 className="card-title"><strong>Ordered Items</strong></h6>
                <Link to="/cart"><i className="fa-solid fa-pen-to-square"></i></Link>
              </div>
              <hr style={{ borderTop: "1.5px dashed black", background: "none", marginTop: 0 }} />
              <table className="table">
                <thead >
                  <tr>
                    <th scope="col">SNo.</th>
                    <th scope="col">Item</th>
                    <th scope="col">Price</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Total</th>
                  </tr>
                </thead>
                <tbody>

                  {props.userDetail.cartItems.map((item, index) => {
                    return (
                      <tr className="text-center align-middle">
                        <th scope="row">{index + 1}</th>
                        <td className='d-flex align-items-center'><img className="w-25 me-2 " src={`http://${item.product.image}`} alt="oops"></img>
                          <span>{item.product.name}</span>
                        </td>
                        <td>
                          ${item.product.price}
                        </td>
                        <td>
                          {item.quantity}
                        </td>
                        <td>
                          ${item.product.price * item.quantity}
                        </td>
                      </tr>
                    )
                  })}
                  <tr>
                    <td></td>
                    <td>Delivery Charges</td>
                    <td></td>
                    <td></td>
                    <td>$50</td>
                  </tr>
                </tbody>
              </table>
              <h4>{`Expected Delivery by ${moment().add(10, 'days').format('DD/MM/YYYY')}`}</h4>
            </div>
          </div>
        </div>
        <div className='d-inline-block w-md-50 w-100'>
          {mode === 'Card' ?
            <>
              {card.match(RegExp(/^4\d/)) ? 'VISA' : null}
              {card.match(RegExp(/^5[1-5]\d/)) ? 'MASTER CARD' : null}
              {card.match(RegExp(/^3[47][0-9]/)) ? 'AMERICAN EXPRESS' : null}
              <TextField
                id="cardNo"
                label="Card No"
                type="tel"
                margin="normal"
                inputProps={{ maxLength: 19 }}
                value={card}
                onChange={handleCard}
                error={errorObj.includes('card') ? true : false}
                helperText={errorObj.includes('card') ? "Enter valid card Number" : null}
              />
              <br />
              <TextField
                label="Name on Card"
                margin="normal"
                value={cardHolder}
                inputProps={{ maxLength: 30 }}
                onChange={handleCardHolder}
                error={errorObj.includes('cardHolder') ? true : false}
                helperText={errorObj.includes('cardHolder') ? "Enter cardHolder Name" : null}
              />
              <br />
              <TextField
                sx={{ mr: 3 }}
                label="Expiry date"
                placeholder="MM/YY"
                margin="normal"
                inputProps={{ maxLength: 5 }}
                value={expiry}
                onChange={handleExpiry}

                error={errorObj.includes('expiry') ? true : false}
                helperText={errorObj.includes('expiry') ? "Enter valid expiry" : null}
              />
              <TextField
                id="cvv"
                label="CVV"
                margin="normal"
                type="password"
                inputProps={{ maxLength: 3 }}
                error={errorObj.includes('Card') ? true : false}
                helperText={errorObj.includes('Card') ? "Enter valid cvv" : null}
              />
              {errorObj.includes('cardExpired') ? <p style={{ color: "red" }}>Card is Expired !!!!</p> : null}
            </> :
            <>

              <img className='w-25' src="https://lh3.googleusercontent.com/RkN2IcvWd4DWNTVbh8Ma2G77D42Gd5HP0Deydf9FmzbDUMxLNsmWUSE8k562PgEPKzmF_OGWIiySxhdLUdNcxJ3t8kc7JugTaAhHYA" alt="ppp" />
              <TextField
                id="upi-id"
                label="Enter Upi Id"
                type="tel"
                margin="normal"
                placeholder='<yourName>@ok<bankName>'
                inputProps={{ maxLength: 16 }}
                error={errorObj.includes('Upi') ? true : false}
                helperText={errorObj.includes('Upi') ? "Enter valid Upi id" : null}
              />
            </>
          }
          <button onClick={handlePayment} className='btn btn-dark w-75'>{`Pay  $${handleTotal()}`}</button>
        </div>
      </div>
    )
  }

  const getStepContent = () => {
    switch (activeStep) {
      case 0: return shippingAddress()
      case 1: return payment()
      case 2: return placeOrder()
      default: return null
    }
  }

  return (
    <Box sx={{ width: '100%' }} textAlign='center'>
      <Stepper className='my-3' activeStep={activeStep} alternativeLabel={true} >
        {steps.map((label) => {
          const stepProps = {};
          const labelProps = {};
          return (
            <Step key={label}{...stepProps}>
              <StepLabel id="step-icon" {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography component={'span'} sx={{ mt: 2, mb: 1 }}>
            <i className="fa-solid fa-circle-check fa-3x"></i>
            <h3>Your Order is Completed !!!</h3>
            <a href="/" className='btn btn-secondary rounded-pill'>Continue Shopping</a>
          </Typography>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Box >
            <Typography component={'span'}>
              {getStepContent()}
            </Typography>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            {activeStep === steps.length - 1 ? null : <Button
              id="button"
              onClick={handleNext}
              variant="contained"
              sx={{ background: "black" }}
            >
              Next
            </Button>}
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
}

function mapStateToProps(state) {
  return ({ userDetail: state.userDetailReducer })
}

export default connect(mapStateToProps, { verifyToken, addOrder })(Shipping)
