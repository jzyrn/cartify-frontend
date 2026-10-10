import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import MetaData from "../Layout/MetaData";
import { API_BASE_URL, authenticate, getUser } from "../Utils/Helpers";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // e.g. /login?redirect=shipping
  const redirect = new URLSearchParams(location.search).get("redirect");
  const goAfterLogin = () => navigate(redirect ? `/${redirect}` : "/");

  useEffect(() => {
    if (getUser()) navigate(redirect ? `/${redirect}` : "/", { replace: true });
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_BASE_URL}/login`, { email, password });
      authenticate(data, goAfterLogin);
      toast.success(`Welcome back, ${data.user.name}!`, { position: "bottom-right" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed", { position: "bottom-right" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MetaData title="Login" />
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} lg={5}>
            <Form className="shadow-sm p-4 bg-white rounded" onSubmit={submitHandler}>
              <h2 className="mb-4">Login</h2>

              <Form.Group className="mb-3" controlId="email_field">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </Form.Group>

              <Form.Group className="mb-4" controlId="password_field">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </Form.Group>

              <Button type="submit" className="shop-cta w-100 py-2" disabled={loading}>
                {loading ? "Logging in..." : "LOGIN"}
              </Button>

              <p className="mt-3 mb-0 text-center">
                New to Cartify? <Link to="/register">Create an account</Link>
              </p>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
}