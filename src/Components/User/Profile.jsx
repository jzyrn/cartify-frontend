import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import Loader from '../Layout/Loader'
import MetaData from '../Layout/MetaData'

const Profile = () => {
    const { user, loading } = useSelector(state => state.auth)

    return (
        <>
            {loading || !user ? <Loader /> : (
                <>
                    <MetaData title="My Profile" />
                    <Container className="py-5">
                        <Row className="justify-content-center">
                            <Col md={8} lg={5}>
                                <div className="shadow-sm p-4 bg-white rounded">
                                    <h2 className="mb-4">My Profile</h2>
                                    <h5>Full Name</h5>
                                    <p>{user.name}</p>
                                    <h5>Email</h5>
                                    <p>{user.email}</p>
                                    <h5>Joined On</h5>
                                    <p>{user.createdAt && String(user.createdAt).substring(0, 10)}</p>
                                    <Link to="/me/update" className="btn shop-cta w-100 mb-2">Edit Profile</Link>
                                    <Link to="/password/update" className="btn btn-outline-secondary w-100">Change Password</Link>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </>
            )}
        </>
    )
}

export default Profile