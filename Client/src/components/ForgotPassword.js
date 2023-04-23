import React from 'react'

export default function ForgotPassword() {
    return (
        <div className='container'>
            <div className="header text-center my-4">
                <p className="fw-bold fs-3">Reset Password</p>
            </div>
            <div className="row g-3 align-items-center">
                <div className="col mx-auto col-sm-4">
                    <div className="form">
                        <form>
                            <div className="mb-4">
                                <label htmlFor="email" className="form-label">Email address</label>
                                <input type="email" className="form-control" id="email" aria-describedby="emailHelp" />
                            </div>
                            <div className="button text-center my-4 py-3">
                                <button type="submit" className="btn btn-primary col-4">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}