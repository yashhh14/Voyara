import React from 'react'
import { NavLink } from 'react-router-dom';

const Success = ({ onClose , message, link}) => {
  return (
    <>
      <div className="modal show" style={{ display: "block" }} tabIndex="-1" >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-body">
              <p>{message}</p>
            </div>
            <div className="modal-footer">
              <NavLink to={link} className="btn btn-secondary" onClick={onClose}>
                Close
              </NavLink>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};
export default Success