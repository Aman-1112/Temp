import React from 'react';
import { Link } from 'react-router-dom';
import './Card.css';
import Rating from '@mui/material/Rating';

function calculateAvgRating(rating){
    let sum=0;
    let count=0;
    rating.map((revRatObj)=>{
      sum+=revRatObj.rating;
      count++;
    });
    if(count===0)return 0;
    else
    return sum/count;
  }

function Card(props) {
    return (
        <Link to={`/product/${props.id}`}>
            <div className="card card-of-list">
                <img className="card-img-top" src={`http://${props.imageUrl}`} alt="..." />
                <div className="card-body">
                    <h5 className="card-title">{props.brand}</h5>
                    {
                    calculateAvgRating(props.rating)?
                    <Rating name="half-rating-read"  precision={0.5} readOnly value={calculateAvgRating(props.rating)}/>
                    :<strong>Unrated</strong>
                    }
                    <p>${props.price}</p>
                </div>
            </div>
        </Link>
    )
}

export default Card
