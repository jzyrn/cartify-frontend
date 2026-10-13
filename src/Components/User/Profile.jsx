import React from 'react'
import { Link } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Loader from '../Layout/Loader'
import MetaData from '../Layout/MetaData'

const GREEN = '#1a3329'
const GOLD = '#c9a227'

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
                                {/* MUI Avatar: shows the photo, or the first letter of the name */}
                                <div className="cartify-profile-avatar">
                                    <Avatar
                                        src={user.avatar?.url || undefined}
                                        alt={user.name}
                                        sx={{
                                            width: '100%',
                                            height: '100%',
                                            bgcolor: GREEN,
                                            color: GOLD,
                                            fontSize: 40,
                                            fontWeight: 700,
                                        }}
                                    >
                                        {user.name?.charAt(0).toUpperCase()}
                                    </Avatar>
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
                                        {/* MUI Chip for the account role */}
                                        <Chip
                                            label={user.role}
                                            size="small"
                                            sx={{
                                                bgcolor: GOLD,
                                                color: GREEN,
                                                fontWeight: 700,
                                                textTransform: 'capitalize',
                                            }}
                                        />
                                        <span>Account</span>
                                    </div>
                                </div>

                                <div className="cartify-profile-actions">
                                    {/* MUI Buttons that still navigate with react-router */}
                                    <Button
                                        component={Link}
                                        to="/me/update"
                                        variant="contained"
                                        sx={{
                                            bgcolor: GREEN,
                                            color: GOLD,
                                            fontWeight: 700,
                                            '&:hover': { bgcolor: '#12241c' },
                                        }}
                                    >
                                        Edit Profile
                                    </Button>
                                    <Button
                                        component={Link}
                                        to="/password/update"
                                        variant="outlined"
                                        sx={{
                                            color: GREEN,
                                            borderColor: GREEN,
                                            fontWeight: 700,
                                            '&:hover': { borderColor: GREEN, bgcolor: 'rgba(26, 51, 41, 0.06)' },
                                        }}
                                    >
                                        Change Password
                                    </Button>
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