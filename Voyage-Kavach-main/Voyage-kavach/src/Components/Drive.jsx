import React from 'react'
import logo from './Indian_taxi_driver_image.png';
import logo3 from './4604286.png'
import logo2 from './cal.jpg'
import logo4 from './images.png'
import { Link } from 'react-router-dom';
export default function Drive() {
   
     document.body.style = 'background: black; margin: 0; paddingTop: 56px; height: 100vh;';

return (
  <>
    <div className="container-fluid p-0" style={{ height: '100vh', display: 'flex', paddingTop: '56px' }}>
      <div className="row w-100 m-0" style={{ padding: '0', margin: '0' }}>

        {/* Left Side with Text and Form */}
        <div className="col-md-6 d-flex flex-column justify-content-center p-5">
          <h1 className="text-white h2" style={{fontSize:'50px',paddingBottom:'15px',paddingTop:'55px'}}>Drive when you want, make what you need</h1>
          <p className="text-white" style={{fontSize:'20px'}}>Earn on your own schedule.</p>
          <p className="text-white" style={{fontSize:'20px'}}>Apni WagonR uthao aur chalo</p>
          <form>
            <Link type="submit" className="btn btn-primary" to="/driversignup">Get Started</Link>
          </form>
        </div>

        {/* Right Side with Image */}
        <div className="col-md-6 d-none d-md-flex justify-content-center align-items-center p-0">
            <img 
              src={logo} 
              className="img-fluid" 
              alt="Taxi driver" 
              style={{ maxWidth: '80%', height: '90%' ,paddingTop:'80px'}} 
            />
          </div>
        </div>
        </div>
        <div className="container-fluid p-5" style={{ backgroundColor: 'white' }}>
            <h1 className='text-center font-weight-bold'>Why drive with us</h1>
            <div className="row">
              
              {/* First Card */}
              <div className="col-md-4">
                <div className="card border-0" style={{ width: '100%',height:'250px' }}>
                  <img className="card-img-top" src={logo2} style={{height:'100px',width:'100px',objectFit: 'cover', margin: '0 auto'}} alt="Card image cap"></img>
                  <div className="card-body">
                    <h5 className="card-title text-center">Set your own hours</h5>
                    <p className="card-text text-center">You decide when and how often you drive.</p>
                  </div>
                </div>
              </div>

              {/* Second Card */}
              <div className="col-md-4">
                <div className="card border-0" style={{ width: '100%',height:'250px' }}>
                  <img className="card-img-top" src={logo3} alt="Card image cap" style={{height:'100px',width:'100px',objectFit: 'cover', margin: '0 auto'}}></img>
                  <div className="card-body">
                    <h5 className="card-title text-center">Get paid fast</h5>
                    <p className="card-text text-center">Weekly payments in your bank account.</p>
                    </div>
                </div>
              </div>

              {/* Third Card */}
              <div className="col-md-4">
                <div className="card border-0" style={{ width: '100%',height:'250px' }}>
                  <img className="card-img-top" src={logo4} alt="Card image cap" style={{height:'100px',width:'100px',objectFit: 'cover', margin: '0 auto'}}></img>
                  <div className="card-body">
                    <h5 className="card-title text-center">Get support at every turn</h5>
                    <p className="card-text text-center">If there’s anything that you need, you can reach us anytime.</p>
                   
                  </div>
                </div>
              </div>

            </div>
          </div>
    </>
  )
}
