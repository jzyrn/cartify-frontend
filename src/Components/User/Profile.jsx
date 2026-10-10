import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import MetaData from "../Layout/MetaData";
import { API_BASE_URL, authConfig, getUser, logout, saveUser } from "../Utils/Helpers";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!getUser()) return navigate("/login", { replace: true });

    const getProfile = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/me`, authConfig());
        setUser(data.user);
        saveUser(data.user);
      } catch (error) {
        // token expired / invalid -> log out and go to login
        toast.error(error.response?.data?.message || "Please log in again", { position: "bottom-right" });
        logout(() => navigate("/login", { replace: true }));
      } finally {
        setLoading(false);
      }
    };
    getProfile();
  }, []);

  if (loading) return <Container className="py-5"><p>Loading...</p></Container>;
  if (!user) return null;

  return (
    <>
      <MetaData title="Your Profile" />
      <Container className="py-5">
        <h2 className="mb-4">My Profile</h2>
        <Row>
          <Col md={4} className="mb-4 text-center">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
              style={{ width: 120, height: 120, background: "#222", color: "#fff", fontSize: 48 }}
            >
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <Link to="/me/update" className="btn btn-outline-dark w-100">Edit Profile</Link>
          </Col>

          <Col md={6}>
            <h5>Full Name</h5>
            <p>{user.name}</p>

            <h5>Email Address</h5>
            <p>{user.email}</p>

            <h5>Role</h5>
            <p className="text-capitalize">{user.role}</p>

            <h5>Joined On</h5>
            <p>{String(user.createdAt).substring(0, 10)}</p>

            {user.role !== "admin" && (
              <Link to="/orders/me" className="btn btn-dark w-100 mt-2">My Orders</Link>
            )}
            <Link to="/password/update" className="btn btn-outline-dark w-100 mt-3">Change Password</Link>
          </Col>
        </Row>
      </Container>
    </>
  );
}