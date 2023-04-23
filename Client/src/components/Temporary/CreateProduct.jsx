import axios from 'axios';
import React, { useState } from 'react'

function CreateProduct() {
    const [newProduct, setNewProduct] = useState({
        name: "", brand: "", image: "", category: "", price: "", description: ""
    });
    function handleChange(e) {
        setNewProduct({ ...newProduct, [e.target.id]: e.target.value });
    }
    function handleSubmit() {
        axios.post('/api/v1/product/create', newProduct);
    }
    return (
        <div className='text-center'>
            <h3 >New Product</h3>
            <form  /* method='POST' */ /* action='/api/v1/product/create' */>{/* WHY DON'T WE USE ACTION FOR SENDING DATA */}
                <label className="my-3 " htmlFor='name'>Name: </label>
                <input id='name' className='w-25' type="text" autoComplete='off' onChange={handleChange} placeholder="Product Name must including brand Name"></input>
                <br />

                <label className="my-3" htmlFor='brand'>Brand: </label>
                <input id='brand' type="text" onChange={handleChange} placeholder="Product Brand"></input>
                <br />

                <label className="my-3" htmlFor='image'>Image url: </label>
                <input id='image' type="text" onChange={handleChange} placeholder="fileSize >50kb + no http:/"></input>
                <br />

                <label className="my-3" htmlFor='category'>Category: </label>
                <input id='category' type="text" onChange={handleChange} placeholder="men|women|electronics"></input>
                <br />

                <label className="my-3" htmlFor='price'>Price: </label>
                <input id='price' type="text" onChange={handleChange} placeholder="Product price"></input>
                <br />

                <label className="my-3" htmlFor='description'>Description: </label>
                <input id='description' type="text" onChange={handleChange} placeholder="Product Description"></input>
                <br />

                <button onClick={handleSubmit}>Add Product</button>
            </form>
        </div>
    )
}

export default CreateProduct