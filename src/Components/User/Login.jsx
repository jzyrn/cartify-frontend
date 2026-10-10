import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Container, Row, Col, Form, Button } from 'react-bootstrap'

import Loader from '../Layout/Loader'
import MetaData from '../Layout/MetaData'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useDispatch, useSelector } from 'react-redux'
import { login, clearErrors } from '../../actions/userActions'

const Login = () => {
    const { isAuthenticated, error, loading } = useSelector(state => state.auth)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()

    const submitHandler = (e) => {
        e.preventDefault()
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
            toast.error(error, { position: 'bottom-right' })
            dispatch(clearErrors())
        }
    }, [error, isAuthenticated, dispatch, navigate, redirect])

    return (
        <>
            {loading ? <Loader /> : (
                <>
                    <MetaData title={'Login'} />
                    <Container className="py-5">
                        <Row className="justify-content-center">
                            <Col md={8} lg={5}>
                                <Form className="shadow-sm p-4 bg-white rounded" onSubmit={submitHandler}>
                                    <h2 className="mb-4">Login</h2>

                                    <Form.Group className="mb-3" controlId="email_field">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="password_field">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </Form.Group>

                                    <div className="text-end mb-3">
                                        <Link to="/password/forgot">Forgot Password?</Link>
                                    </div>

                                    <Button id="login_button" type="submit" className="shop-cta w-100 py-2">
                                        LOGIN
                                    </Button>

                                    <p className="mt-3 mb-0 text-center">
                                        New to Cartify? <Link to="/register">Create an account</Link>
                                    </p>
                                </Form>
                            </Col>
                        </Row>
                    </Container>
                </>
            )}
        </>
    )
}

export default Login