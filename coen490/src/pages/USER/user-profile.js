import { Container } from "react-bootstrap"
import { Button } from '@mui/material'
import  LogOut  from '../Authentification/logout';
import { UserProvider } from '../../contexts/user.context';
import React from 'react';
import {MDBCol, MDBInput, MDBButton, MDBContainer,MDBRow,MDBCard,MDBCardText,MDBCardBody,MDBCardImage,MDBBtn,MDBIcon,MDBListGroup,MDBListGroupItem} from 'mdb-react-ui-kit';
import '../../style/user/user-profile.css'
import axios from 'axios';
import { useContext, useState, useEffect } from "react";

export default function HCPProfile() {

const [isEditing, setIsEditing] = useState(false);
var [data, setData] = useState({});
var image;
const [filename, setFilename] = useState(null);

useEffect(() => {
    axios.get("http://localhost:4444/user/profile")
      .then(res => {
        setData(res.data)
      })
      .catch(err => {
        console.log(err)
      })
      
      const formData = new FormData();
      axios.post('http://localhost:4444/user/profile/image', formData, {
        headers: {
      'Content-Type': 'multipart/form-data'
      }
      }).then((res) => {
        setFilename(res.data.filename);
        console.log(res.data)
      }).catch((err) => {
        console.error(err);
      });





  }, [])




const handleEdit = () => {
  setIsEditing(!isEditing);
}

const handleSave = () => {
  // Get the new values from the input fields
  const newName = document.getElementById('full-name').value;
  const newEmail = document.getElementById('email').value;
  const newPhone = document.getElementById('phone').value;
}




  return (
    <>
    <section className = "w-100 h-100" style={{ backgroundColor: '#fff' }}>
      <MDBContainer className="py-5">
        <MDBRow>
          <MDBCol lg="4">
            <MDBCard className="border h-100  w-100" >
              <MDBCardBody className="text-center">
                <MDBCardImage
                  src={`/uploads/${filename}`}
                  alt="avatar"
                  className="rounded-circle"
                  style={{ width: '150px' }}
                  fluid />

              </MDBCardBody>
              <MDBCardBody>
{isEditing ? (
  <>
    <MDBInput label="Full Name" value={data ? data.name : ''} />
    <MDBInput label="Email" value={data ? data.email : ''} />
    <MDBInput label="Phone" value="(097) 234-5678" />
    <MDBInput label="Mobile" value="(098) 765-4321" />
    <MDBInput label="Address" value="Bay Area, San Francisco, CA" />
    <button type="button" class="btn btn-dark" onClick={handleSave}>Save</button>

  </>
) : (
  <>
    <MDBRow>
      <MDBCol sm="3">
        <MDBCardText>Full Name</MDBCardText>
      </MDBCol>
      <MDBCol sm="9">
        <MDBCardText className="text-muted">{data ? data.firstname + " " + data.lastname : 'Loading...'}</MDBCardText>
      </MDBCol>
    </MDBRow>
    <hr />
    <MDBRow>
      <MDBCol sm="3">
        <MDBCardText>Email</MDBCardText>
      </MDBCol>
      <MDBCol sm="9">
        <MDBCardText className="text-muted">{data ? data.email : 'Loading...'}</MDBCardText>
      </MDBCol>
    </MDBRow>
    <hr />
    <MDBRow>
      <MDBCol sm="3">
        <MDBCardText>Phone</MDBCardText>
      </MDBCol>
      <MDBCol sm="9">
        <MDBCardText className="text-muted">{data ? data.phone : 'Loading...'}</MDBCardText>
      </MDBCol>
    </MDBRow>
    <hr />
    <MDBRow>
      <MDBCol sm="3">
        <MDBCardText>City</MDBCardText>
      </MDBCol>
      <MDBCol sm="9">
        <MDBCardText className="text-muted">{data ? data.city : 'Loading...'}</MDBCardText>
        <button type="button" className="btn btn-dark" onClick={handleEdit}>Edit</button>

      </MDBCol>
    </MDBRow>
  </>
)}
</MDBCardBody>



            </MDBCard>


          </MDBCol>
          <MDBCol lg="8">
            <MDBCard className="mb-4 w-100">
              <MDBCardBody>
                  <h5 className="mx-auto w-100 text-center">Describe Your Issues </h5>
                  <MDBCardText className="text-muted ">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum sit amet massa egestas, mattis justo in, tincidunt ligula. Praesent blandit pellentesque erat quis aliquam. Proin feugiat at metus a efficitur. Vivamus vitae ligula dapibus, pulvinar sem sit amet, auctor erat. Praesent vehicula auctor dolor, ac commodo ipsum euismod et. Suspendisse in convallis nisl. Vestibulum ante ipsum primis in faucibus Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum sit amet massa egestas, mattis justo in, tincidunt ligula. Praesent blandit pellentesque erat quis aliquam. Proin feugiat at metus a efficitur. Vivamus vitae ligula dapibus, pulvinar sem sit amet, auctor erat. Praesent vehicula auctor dolor, ac commodo ipsum euismod et. Suspendisse in convallis nisl. Vestibulum ante ipsum primis in faucibu orci luctus et ultrices posuere cubilia curae.</MDBCardText>
              </MDBCardBody>
            </MDBCard>

            <MDBRow>
              <MDBCol md="6">
                <MDBCard className="mb-4 mb-md-0">
                  <MDBCardBody>
                      <h5 className="mx-auto w-100 text-center">Your Past Meetings</h5>
                      <MDBRow>
                        <MDBCol sm ="3">
                          <MDBCardImage
                            src="https://mdbcdn.b-cdn.net/img/new/avatars/1.webp"
                            alt="avatar"
                            className="rounded-circle"
                            style={{ width: '50px' }}
                            fluid />
                        </MDBCol>
                        <MDBCol sm ="6">
                          <MDBCardText className="text-center align-bottom ">January 5th 2022</MDBCardText>
                        </MDBCol>
                      </MDBRow>
                      <MDBRow>
                        <MDBCol sm ="3">
                          <MDBCardImage
                            src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(32).webp"
                            alt="avatar"
                            className="rounded-circle"
                            style={{ width: '50px' }}
                            fluid />
                        </MDBCol>
                        <MDBCol sm ="6">
                          <MDBCardText className="text-center align-bottom ">January 5th 2022</MDBCardText>
                        </MDBCol>
                      </MDBRow>
                      <MDBRow>
                        <MDBCol sm ="3">
                          <MDBCardImage
                            src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(9).webp"
                            alt="avatar"
                            className="rounded-circle"
                            style={{ width: '50px' }}
                            fluid />
                        </MDBCol>
                        <MDBCol sm ="6">
                          <MDBCardText className="text-center align-bottom ">January 5th 2022</MDBCardText>
                        </MDBCol>
                      </MDBRow>
                      <MDBRow className ='test'>
                        <MDBCol sm ="3">
                          <MDBCardImage
                            src="https://mdbcdn.b-cdn.net/img/new/avatars/5.webp"
                            alt="avatar"
                            className="rounded-circle"
                            style={{ width: '50px' }}
                            fluid />
                        </MDBCol>
                        <MDBCol sm ="6">
                          <MDBCardText className="text-center align-center ">January 5th 2022</MDBCardText>
                        </MDBCol>
                      </MDBRow>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>

              <MDBCol md="6">
                <MDBCard className="mb-4 mb-md-0">
                  <MDBCardBody className = "card-data">
                    <MDBRow>
                      <MDBCol>

                        <h5 className="livedata w-100 text-center">Your Live Data</h5>
                      </MDBCol>
                      <div className="form-check form-switch">
                        <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Allow Data to be Handled by HCP</label>
                        <input className="card-data-button form-check-input float-end" type="checkbox" role="switch" id="flexSwitchCheckDefault" defaultChecked />
                      </div>
                      <hr className="divider" />
                      <div className="form-check form-switch">
                        <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Allow Live Tracking and Analysis</label>
                        <input className="card-data-button form-check-input float-end" type="checkbox" role="switch" id="flexSwitchCheckDefault" defaultChecked />
                      </div>
                      <hr className="divider" />
                      <div className="form-check form-switch">
                        <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Allow EasySante to Use Your Data</label>
                        <input className="card-data-button form-check-input float-end align-middle" type="checkbox" role="switch" id="flexSwitchCheckDefault" defaultChecked />
                      </div>
                      <div className="col-md-12 text-center">
                        <button type="button" className="btn btn-danger">Terminate</button>
                      </div>
                    </MDBRow>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      <UserProvider>
        <Container className = "d-flex align-items-center justify-content-center" style = {{ minHeight: "1vh" }}>
          <LogOut />
        </Container>
      </UserProvider>
    </section>
    </>
  );
}
