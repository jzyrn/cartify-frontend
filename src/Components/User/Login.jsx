import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

import Loader from '../Layout/Loader'
import MetaData from '../Layout/MetaData'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import InputAdornment from '@mui/material/InputAdornment'
import { useDispatch, useSelector } from 'react-redux'
import { login, clearErrors } from '../../actions/userActions'

// change the file name if your image is named differently
import loginImage from '../../assets/cartify_panel.png'

const GREEN = '#1a3329'
const GOLD = '#c9a227'

// keeps the MUI inputs in the site's green instead of the default blue
const fieldSx = {
    mb: 2,
    '& label.Mui-focused': { color: GREEN },
    '& .MuiOutlinedInput-root.Mui-focused fieldset': { borderColor: GREEN },
}

const Login = () => {
    const { isAuthenticated, error, loading } = useSelector(state => state.auth)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loginError, setLoginError] = useState('')
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()

    const submitHandler = (e) => {
        e.preventDefault()
        setLoginError('')
        dispatch(login(email, password))
    }

    const redirect = location.search ? new URLSearchParams(location.search).get('redirect') : ''

    useEffect(() => {
        if (isAuthenticated && redirect === 'shipping') {
            navigate(`/${redirect}`)
        } else if (isAuthenticated) {
            navigate('/')
        }
        if (error) {
            // shown as a MUI Alert inside the form
            setLoginError(error)
            dispatch(clearErrors())
        }
    }, [error, isAuthenticated, dispatch, navigate, redirect])

    return (
        <>
            {loading ? <Loader /> : (
                <>
                    <MetaData title={'Login'} />

                    <section className="auth-page">
                        <div className="auth-shell">
                            {/* left: the full image, no text on top */}
                            <div className="auth-visual">
                                <img src={loginImage} alt="Cartify" />
                            </div>

                            {/* right: form */}
                            <div className="auth-form-side">
                                <h1 className="auth-title">Your account</h1>
                                <p className="auth-subtitle">Sign in to see your cart and profile.</p>

                                <div className="auth-tabs">
                                    <span className="auth-tab active">Sign in</span>
                                    <Link to="/register" className="auth-tab">Create account</Link>
                                </div>

                                {/* MUI Alert replaces the error toast */}
                                {loginError && (
                                    <Alert
                                        severity="error"
                                        onClose={() => setLoginError('')}
                                        sx={{ mb: 2 }}
                                    >
                                        {loginError}
                                    </Alert>
                                )}

                                <form onSubmit={submitHandler}>
                                    <TextField
                                        id="email_field"
                                        label="Email"
                                        type="email"
                                        placeholder="you@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        fullWidth
                                        sx={fieldSx}
                                    />

                                    <TextField
                                        id="password_field"
                                        label="Password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        fullWidth
                                        sx={fieldSx}
                                        slotProps={{
                                            input: {
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <Button
                                                            size="small"
                                                            onClick={() => setShowPassword((show) => !show)}
                                                            sx={{ color: GREEN, minWidth: 0 }}
                                                        >
                                                            {showPassword ? 'Hide' : 'Show'}
                                                        </Button>
                                                    </InputAdornment>
                                                ),
                                            },
                                        }}
                                    />

                                    <div className="auth-forgot">
                                        <Link to="/password/forgot">Forgot password?</Link>
                                    </div>

                                    <Button
                                        id="login_button"
                                        type="submit"
                                        variant="contained"
                                        fullWidth
                                        sx={{
                                            bgcolor: GREEN,
                                            color: GOLD,
                                            fontWeight: 700,
                                            letterSpacing: 1,
                                            py: 1.5,
                                            '&:hover': { bgcolor: '#12241c' },
                                        }}
                                    >
                                        SIGN IN
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </section>
                </>
            )}
        </>
    )
}

export default Login