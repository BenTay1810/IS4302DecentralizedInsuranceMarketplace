import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import colors from '../styles/colors';
import { Link } from 'react-router-dom';

function List1() {
  return (
    <div>
      <div className="container" style={{ width: '400px', padding: '30px' }}>
        {/* Progress Bar */}
        <div className="d-flex align-items-center mb-4">
            <div
                className="rounded-circle text-white d-flex align-items-center justify-content-center"
                style={{ width: '40px', height: '40px', backgroundColor: colors.darkblue }}
            >
                1
            </div>
            <div className="flex-grow-1" style={{ height: '2px', backgroundColor: 'grey' }}></div>
            <Link to="/list2">
                <div
                    className="rounded-circle text-white d-flex align-items-center justify-content-center"
                    style={{ width: '40px', height: '40px', backgroundColor: colors.lightblue }}
                >
                    2
                </div>
            </Link>
            <div className="flex-grow-1" style={{ height: '2px', backgroundColor: 'grey' }}></div>
            <Link to="/list3">
                <div
                    className="rounded-circle text-white d-flex align-items-center justify-content-center"
                    style={{ width: '40px', height: '40px', backgroundColor: colors.lightblue }}
                >
                    3
                </div>
            </Link>
        </div>
      </div>

      <h2 className="text-center mb-4">Let's verify your identity.</h2>

      <div className="container-fluid bg-light p-4" style={{ width: '85%', margin: '0 auto' }}>
        <form className="bg-light p-4 rounded">
          <div className="form-group text-start mb-3">
            <label className="text-left" style={{ textAlign: 'left' }}>First Name</label>
            <input type="text" className="form-control"/>
          </div>

          <div className="form-group text-start mb-3">
            <label className="text-left" style={{ textAlign: 'left' }}>Last Name</label>
            <input type="text" className="form-control" />
          </div>

          <div className="form-group text-start mb-3">
            <label className="text-left" style={{ textAlign: 'left' }}>Identification No.</label>
            <input type="text" className="form-control"/>
          </div>

          <div className="form-group text-start mb-3">
            <label className="text-left" style={{ textAlign: 'left' }}>Contact No.</label>
            <input type="text" className="form-control" />
          </div>

          <div className="form-group text-start mb-3">
            <label className="text-left" style={{ textAlign: 'left' }}>Account No.</label>
            <input type="text" className="form-control"/>
          </div>

          <div className="form-group text-start mb-3">
            <label className="text-left" style={{ textAlign: 'left' }}>Email Address</label>
            <input type="email" className="form-control"/>
          </div>

          {/* <div className="form-group mb-3">
            <label className="text-left" style={{ textAlign: 'left' }}>Upload Proof of Identification</label>
            <button className="btn btn-secondary btn-block">Upload</button>
          </div> */}

          <div className="text-end"> 
            <Link to="/list2"> 
                <button
                    type="button"
                    className="btn btn-block"
                    style={{ backgroundColor: colors.darkblue, color: 'white' }}
                >
                    Next
                </button>
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
}

export default List1;