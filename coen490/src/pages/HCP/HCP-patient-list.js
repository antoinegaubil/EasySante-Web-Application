import axios from 'axios';
import { useContext, useState, useEffect } from "react";
import React from 'react';
import '../../style/HCP/HCP-patient-list.css'
import {
  MDBCard,
  MDBCardImage,
  MDBCardBody,
  MDBCardTitle,
  MDBBtn,
  MDBRow,
  MDBContainer,
  MDBCol,
  MDBCardHeader,
  MDBModal,
  MDBModalBody,
  MDBModalHeader,
  MDBModalFooter,
  MDBSpinner,
  MDBCardText,
  MDBModalDialog,
  MDBModalContent
} from 'mdb-react-ui-kit';
import logo from '../../style/490LogoWhite.png';



export default function HCPPatientList(){

  const [reason, setReason] = useState('');
  const [type, setType] = useState('');
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [basicModal, setBasicModal] = useState(false);
  const [cardData, setCardData] = useState([]);




  const toggleShow = (user) => {

        setCardData(user);
        console.log(cardData);
        setBasicModal(!basicModal)

      };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const response = await fetch('http://localhost:4444/HCP/booked/all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: null,
      });
      try {
        const data = await response.json();
        console.log(data);
        setData(data);
        setSearchResults(data);
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);


  const handleView = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  }

    return (
    <>
    <main className="hero-section">
    <div className="hero-content">
      <nav className="navbar" style={{marginLeft: "20px", width: "1740px" }}>
        <img className="nav-logo" src={logo}/>
        <ul className="nav-links">
          <a href="/HCP-dashboard">Dashboard</a>
          <a href="/HCP-connect">Connect</a>
          <a href="/HCP-patient-list">View Appointments</a>
          <a href="/HCP-profile">Profile</a>
        </ul>
      </nav>
    {isLoading ? (
          <MDBSpinner className="lds-roller" style={{marginLeft: '850px', marginTop: '00px'}} />
        ) : (
      <MDBContainer className = "w-100">
        {data.map((subArray) => (
          <MDBRow key={subArray[0]._id} style={{height: '100px', paddingTop: '20px'}}>
            {subArray.map((user) => (
              <MDBCol key={user._id} style={{ border: '1px'}}>
                <MDBCard class="mb-3">
                  <MDBCardBody className="d-flex" >
                    <MDBCardImage
                      src={user.avatar}
                      alt="avatar"
                      className="me-3"
                      style={{ maxWidth: "50px" }}
                    />
                    <div>
                      <div>
                        {user.firstname} {user.lastname}
                      </div>
                      <div style={{ fontSize: "0.8rem" }}>
                        Visit Your Schedule For More Information.
                      </div>
                    </div>
                    <div className="ms-auto">

                    <MDBBtn class='button-21' style={{maxWidth: '300px', maxHeight: '40px'}} onClick={() => toggleShow(user)} >View Profile</MDBBtn>

                      <MDBModal show={basicModal} setShow={setBasicModal} tabIndex='-1'>
                          <MDBModalDialog>
                            {cardData && (
                              <MDBModalContent
                                style={{
                                  width: '800px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  height: '500px',
                                  borderRadius: '20px',
                                  top: '50%',
                                  left: '50%',
                                  marginTop: '500px',
                                  transform: 'translate(-50%, -50%)',
                                  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.25)'
                                }}
                              >
                                <MDBModalBody>
                                  <MDBRow>
                                    <MDBCol lg='6'>
                                      <MDBCardImage
                                        src={cardData.avatar}
                                        alt='avatar'
                                        className='rounded-circle'
                                        class='imgClass'
                                        fluid

                                      />
                                      <MDBCardBody className='pt-1'>
                                        <MDBRow>
                                          <MDBCol sm='3'>
                                            <MDBCardText style={{color: 'black'}}>Name</MDBCardText>
                                          </MDBCol>
                                          <MDBCol>
                                            <MDBCardText className='text-muted'>{cardData.firstname} {cardData.lastname}</MDBCardText>
                                          </MDBCol>
                                        </MDBRow>
                                        <hr />
                                        <MDBRow>
                                          <MDBCol sm='3'>
                                            <MDBCardText  style={{color: 'black'}}>Email</MDBCardText>
                                          </MDBCol>
                                          <MDBCol sm='9'>
                                            <MDBCardText className='text-muted'>{cardData.email}</MDBCardText>
                                          </MDBCol>
                                        </MDBRow>
                                        <hr />
                                        <MDBRow>
                                          <MDBCol sm='3'>
                                            <MDBCardText  style={{color: 'black'}}>Phone Number</MDBCardText>
                                          </MDBCol>
                                          <MDBCol sm='9'>
                                            <MDBCardText className='text-muted'>{cardData.phone}</MDBCardText>
                                          </MDBCol>
                                        </MDBRow>
                                        <hr />
                                        <MDBRow>
                                          <MDBCol sm='3'>
                                            <MDBCardText  style={{color: 'black'}}>City</MDBCardText>
                                          </MDBCol>
                                          <MDBCol sm='9' >
                                            <MDBCardText className='text-muted'>{cardData.city}</MDBCardText>
                                          </MDBCol>
                                        </MDBRow>
                                        <hr />
                                        <MDBRow>
                                          <MDBCol sm='3'>
                                            <MDBCardText  style={{color: 'black'}}>City</MDBCardText>
                                          </MDBCol>
                                          <MDBCol sm='9'>
                                            <MDBCardText className='text-muted'>{cardData.city}</MDBCardText>
                                          </MDBCol>
                                        </MDBRow>
                                      </MDBCardBody>
                                    </MDBCol>
                                    <MDBCol lg='6'>
                                      <h2 className='fw-bold mb-3' style={{color: 'black'}}>A Little Bit About Myself</h2>
                                      <MDBCardText className='text-muted text-center'>
                                          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                                          in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                                          sunt in culpa qui officia deserunt mollit anim id est laborum.
                                        </MDBCardText>
                                      </MDBCol>
                                    </MDBRow>
                                  </MDBModalBody>
                                </MDBModalContent>
                              )}
                            </MDBModalDialog>
                          </MDBModal>
                            <a
                              class="button-21"
                              href="/HCP-connect"
                              role="button"
                              data-ripple-color="primary"
                              >Message<i class="fas fa-envelope ms-2"></i
                            ></a>
                            <a
                              class="button-21"
                              href="/HCP-connect"
                              role="button"
                              data-ripple-color="primary"
                              >Call<i class="fas fa-phone ms-2"></i
                            ></a>
                    </div>

                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            ))}
          </MDBRow>
        ))}
      </MDBContainer>
    )}

      <MDBModal isOpen={isModalOpen} toggle={() => setIsModalOpen(false)}>
        <MDBModalHeader>
          {selectedUser && `${selectedUser.firstname} ${selectedUser.lastname}`}
        </MDBModalHeader>
        <MDBModalBody>
          {selectedUser && (
            <>
              <div>
                <strong>First Name:</strong> {selectedUser.firstname}
              </div>
              <div>
                <strong>Last Name:</strong> {selectedUser.lastname}
              </div>
              <div>
                <strong>Email:</strong> {selectedUser.email}
              </div>
              <div>
                <strong>Phone:</strong> {selectedUser.phone}
              </div>
              {/* add more fields as needed */}
            </>
          )}
        </MDBModalBody>
      </MDBModal>
      </div>
      </main>
    </>
  );


};
