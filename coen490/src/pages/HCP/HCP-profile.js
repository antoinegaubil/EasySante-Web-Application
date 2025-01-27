import { Container } from "react-bootstrap"
import  LogOut  from '../Authentification/logout';
import { UserProvider } from '../../contexts/user.context';
import React from 'react';
import {MDBCol, MDBInput, MDBButton, MDBContainer,MDBRow,MDBCard,MDBCardText,MDBCardBody,MDBCardImage,MDBBtn,MDBIcon,MDBListGroup,MDBListGroupItem} from 'mdb-react-ui-kit';
import '../../style/HCP/hcp-profile.css'
import axios from 'axios';
import '../../style/user/calendar.css'
import { useContext, useState, useEffect } from "react";
import '../../style/user/user-dashboard.css';
import logo from '../../style/490LogoWhite.png';


export default function HCPProfile() {

  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState({});
  const [file, setFile] = useState(null);
  const [filename, setFilename] = useState(null);
  const [userProfile, setUserProfile] = useState([]);

  const [past, setPast] = useState([]);


  useEffect(() => {
    axios.get("http://localhost:4444/hcp/profile")
      .then(res => {
        setUserProfile(res.data.avatar)
        setData(res.data)
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  useEffect(() => {
    axios.get("http://localhost:4444/hcp/past")
      .then(res => {
        setPast(res.data)
        console.log(res.data)
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = (e) => {
  const formData = new FormData();
  formData.append('file', file);
  axios.post('http://localhost:4444/hcp/profile/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  .then((res) => {
    setFilename(res.data);
  })
  .catch((err) => {
    console.error(err);
  });
};



  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsEditing(false);

    const userResponse = await fetch('http://localhost:4444/hcp/profile/edit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });


    if (file) {
        handleFileUpload();
        console.log("file detected")
    }
    window.location.reload()

  };



const handleInputChange = (e) => {
  setData({
    ...data,
    [e.target.name]: e.target.value,
  });
};



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
    <section className = "w-200 h-100">
      <MDBContainer className="bg1">
        <MDBRow>
          <MDBCol lg="4" >
            <MDBCard style={{background: "transparent", border: '0px'}}>
              <MDBCardBody style={{background: "transparent"}}>
              {isEditing ? (
                <>
                <form onSubmit={handleSubmit}>
                  <input type="file" onChange={handleFileChange} />
                </form>

                <MDBRow>
                <MDBCardBody style={{background: "transparent"}}>
                    <MDBInput label="Full Name" labelPosition="top" value={`${data.firstname} ${data.lastname}`} onChange={handleInputChange} name="fullname" />
                    <MDBInput label="Email" labelPosition="top" value={data.email} onChange={handleInputChange} name="email" />
                    <MDBInput label="Phone" labelPosition="top" value={data.phone} onChange={handleInputChange} name="phone"/>
                    <MDBInput label="City" labelPosition="top" value={data.city} onChange={handleInputChange} name="city" />
                  <button type="button" className="btn btn-dark mt-3" onClick={handleSave}>Save</button>
                </MDBCardBody>
              </MDBRow>

              </>

              ) : (
  <>
  <MDBCardImage
    src={userProfile}
    alt="avatar"
    className="rounded-circle"
    style={{ width: '150px', marginLeft: '90px' }}
    fluid />
    <MDBCardBody style={{background: "transparent", border: '0px'}}>
  <MDBRow >
    <MDBCol sm="3">
      <MDBCardText>Name</MDBCardText>
    </MDBCol>
    <MDBCol>
      <MDBCardText style = {{color: 'white'}}>{data ? data.firstname + " " + data.lastname : 'Loading...'}</MDBCardText>
    </MDBCol>
  </MDBRow>
  <hr />
  <MDBRow >
    <MDBCol sm="3">
      <MDBCardText>Email</MDBCardText>
    </MDBCol>
    <MDBCol sm="9">
      <MDBCardText style = {{color: 'white'}}>{data ? data.email : 'Loading...'}</MDBCardText>
    </MDBCol>
  </MDBRow>
  <hr />
  <MDBRow>
    <MDBCol sm="3">
      <MDBCardText>Vocation</MDBCardText>
    </MDBCol>
    <MDBCol sm="9">
      <MDBCardText style = {{color: 'white'}}>{data ? data.profession : 'Loading...'}</MDBCardText>
    </MDBCol>
  </MDBRow>
  <hr />
  <MDBRow>
    <MDBCol sm="3">
      <MDBCardText>Specialty</MDBCardText>
    </MDBCol>
    <MDBCol sm="9">
      <MDBCardText style = {{color: 'white'}}>{data ? data.specialty : 'Loading...'}</MDBCardText>
    </MDBCol>
  </MDBRow>
  <hr />
  <MDBRow>
    <MDBCol sm="3">
      <MDBCardText>City</MDBCardText>
    </MDBCol>
    <MDBCol sm="9">
      <MDBCardText style = {{color: 'white'}}>{data ? data.city : 'Loading...'}</MDBCardText>
      <button type="button" className="button-21" onClick={handleEdit}>Edit</button>
    </MDBCol>
  </MDBRow>
</MDBCardBody>

  </>
)}
</MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol lg="8">
            <MDBCard style={{background: "transparent", border: '0px'}}>
              <MDBCardBody>
                  <h5 className="mx-auto w-100 text-center">About You</h5>
                  <MDBCardText>As a licensed therapist, I have devoted my career to helping individuals overcome personal challenges and achieve greater emotional well-being. My education and certifications are a testament to my dedication to 
                    providing compassionate and effective therapy services. I hold a Master of Science in Clinical Psychology from Concordia University, where I received extensive training in various therapeutic modalities and gained a deep understanding of human behavior and psychological principles. 
                    Additionally, I am licensed by Quebec and have met rigorous standards of education, training, and experience to become a licensed therapist. </MDBCardText>
              </MDBCardBody>
            </MDBCard>

            <MDBRow>
            <MDBRow style={{ width: '100%' }}>
              <MDBCol md="6">
                <MDBCard className="mb-4 mb-md-0" style={{ background: "transparent", border: '0px' }}>
                <MDBCardBody style={{ width: '100%' }}>
                    <h5 className="mx-auto w-100 text-center">Your Past Meetings</h5>
                    {past.map((item, index) => (
                      <MDBRow key={past[index][0].firstname}>
                        <MDBCol sm="3">
                          <MDBCardImage
                            src={past[index][0].avatar}
                            alt="avatar"
                            className="rounded-circle"
                            style={{ width: '50px' }}
                            fluid />
                        </MDBCol>
                        <MDBCol sm="6">
                          <MDBCardText className="text-center align-bottom ">{past[index][0].firstname} {past[index][0].lastname}</MDBCardText>
                        </MDBCol>
                      </MDBRow>
                    ))}
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
              </MDBRow>

              <MDBCol md="6">
                <MDBCard className="mb-4 mb-md-0" style = {{background: "transparent", border: '0px'}}>
                  <MDBCardBody className = "card-data">
                    <MDBRow>

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
    </div>
    </main>
    </>
  );
}
