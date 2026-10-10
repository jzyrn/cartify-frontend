import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import MetaData from "../Layout/MetaData";
import { API_BASE_URL, authConfig, getUser, saveUser } from "../Utils/Helpers";

export default function UpdateProfile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const current = getUser();
    if (!current) return navigate("/login", { replace: true });
    setName(current.name);
    setEmail(current.email);
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.put(`${API_BASE_URL}/me/update`, { name, email }, authConfig());
      saveUser(data.user);
      toast.success("Profile updated", { position: "bottom-right" });
      navigate("/me", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed", { position: "bottom-right" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MetaData title="Update Profile" />
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} lg={5}>
            <Form className="shadow-sm p-4 bg-white rounded" onSubmit={submitHandler}>
              <h2 className="mb-4">Update Profile</h2>

              <Form.Group className="mb-3" controlId="name_field">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} required />
              </Form.Group>

              <Form.Group className="mb-4" controlId="email_field">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </Form.Group>

              <Button type="submit" className="shop-cta w-100 py-2" disabled={loading}>
                {loading ? "Saving..." : "UPDATE"}
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
}