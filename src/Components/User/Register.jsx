import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import MetaData from "../Layout/MetaData";
import { API_BASE_URL, authenticate, getUser } from "../Utils/Helpers";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { name, email, password, confirmPassword } = form;

  useEffect(() => {
    if (getUser()) navigate("/", { replace: true });
  }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match", { position: "bottom-right" });
    }

    setLoading(true);
    try {
      const { data } = await axios.post(`${API_BASE_URL}/register`, { name, email, password });
      authenticate(data, () => navigate("/"));
      toast.success("Account created!", { position: "bottom-right" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed", { position: "bottom-right" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MetaData title="Register" />
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} lg={5}>
            <Form className="shadow-sm p-4 bg-white rounded" onSubmit={submitHandler}>
              <h2 className="mb-4">Register</h2>

              <Form.Group className="mb-3" controlId="name_field">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" name="name" value={name} onChange={onChange} required />
              </Form.Group>

              <Form.Group className="mb-3" controlId="email_field">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" name="email" value={email} onChange={onChange} required />
              </Form.Group>

              <Form.Group className="mb-3" controlId="password_field">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" name="password" value={password} onChange={onChange} minLength={6} required />
              </Form.Group>

              <Form.Group className="mb-4" controlId="confirm_password_field">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control type="password" name="confirmPassword" value={confirmPassword} onChange={onChange} required />
              </Form.Group>

              <Button type="submit" className="shop-cta w-100 py-2" disabled={loading}>
                {loading ? "Creating account..." : "REGISTER"}
              </Button>

              <p className="mt-3 mb-0 text-center">
                Already have an account? <Link to="/login">Login</Link>
              </p>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
}