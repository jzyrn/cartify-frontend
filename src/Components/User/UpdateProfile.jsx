import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import MetaData from "../Layout/MetaData";
import { updateProfile, loadUser, clearErrors } from "../../actions/userActions";
import { UPDATE_PROFILE_RESET } from "../../constants/userConstants";

const DEFAULT_AVATAR = "https://placehold.co/100x100?text=User";

export default function UpdateProfile() {
  const { user } = useSelector((state) => state.auth);
  const { error, isUpdated, loading } = useSelector((state) => state.user);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(DEFAULT_AVATAR);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setAvatarPreview(user.avatar?.url || DEFAULT_AVATAR);
    }
  }, [user]);

  useEffect(() => {
    if (error) {
      toast.error(error, { position: "bottom-right" });
      dispatch(clearErrors());
    }
    if (isUpdated) {
      toast.success("Profile updated", { position: "bottom-right" });
      dispatch(loadUser());
      dispatch({ type: UPDATE_PROFILE_RESET });
      navigate("/me", { replace: true });
    }
  }, [dispatch, error, isUpdated, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.set("name", name);
    formData.set("email", email);
    if (avatar) formData.set("avatar", avatar); // only send if a new file was chosen
    dispatch(updateProfile(formData));
  };

  const onChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result);
        setAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <MetaData title="Update Profile" />
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} lg={5}>
            <Form className="shadow-sm p-4 bg-white rounded" onSubmit={submitHandler} encType="multipart/form-data">
              <h2 className="mb-4">Update Profile</h2>

              <Form.Group className="mb-3" controlId="name_field">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} required />
              </Form.Group>

              <Form.Group className="mb-3" controlId="email_field">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </Form.Group>

              <Form.Group className="mb-4" controlId="avatar_upload">
                <Form.Label>Avatar</Form.Label>
                <div className="d-flex align-items-center">
                  <Image src={avatarPreview} roundedCircle width={64} height={64} className="me-3" alt="Avatar preview" />
                  <Form.Control type="file" accept="image/*" onChange={onChange} />
                </div>
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