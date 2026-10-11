import React from 'react'
import { Link } from 'react-router-dom'
import { Container } from 'react-bootstrap'
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

                    <section className="cartify-profile">
                        <div className="cartify-profile-banner">
                            <span className="bubble b1" />
                            <span className="bubble b2" />
                            <span className="bubble b3" />
                            <span className="bubble b4" />
                        </div>

                        <Container>
                            <div className="cartify-profile-card">
                                <div className="cartify-profile-avatar">
                                    {user.avatar?.url ? (
                                        <img src={user.avatar.url} alt={user.name} />
                                    ) : (
                                        <i className="fa fa-user-o" />
                                    )}
                                </div>

                                <h2 className="cartify-profile-name">{user.name}</h2>
                                <p className="cartify-profile-email">{user.email}</p>

                                <div className="cartify-profile-stats">
                                    <div>
                                        <strong>
                                            {user.createdAt
                                                ? new Date(user.createdAt).toLocaleDateString('en-PH', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                })
                                                : '-'}
                                        </strong>
                                        <span>Joined</span>
                                    </div>
                                    <div>
                                        <strong className="text-capitalize">{user.role}</strong>
                                        <span>Account</span>
                                    </div>
                                </div>

                                <div className="cartify-profile-actions">
                                    <Link to="/me/update" className="cartify-profile-btn primary">Edit Profile</Link>
                                    <Link to="/password/update" className="cartify-profile-btn outline">Change Password</Link>
                                </div>
                            </div>
                        </Container>
                    </section>
                </>
            )}
        </>
    )
}

export default Profile