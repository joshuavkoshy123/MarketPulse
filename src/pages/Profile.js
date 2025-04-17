import { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import { signOut } from 'firebase/auth';
import { auth } from '../config/config';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userInfo, setUserInfo] = useState(null);

  const navigate = useNavigate();

  // Fetch user info on initial render (from localStorage or API)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    if (user) {
      setUserInfo(user);
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email);
    }
  }, []);

  // Handle form submission
  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
    } else {
      // Update profile logic (you can send this to the server or update locally)
      const updatedUser = { firstName, lastName, email, password };
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      setUserInfo(updatedUser);
      alert("Profile Updated Successfully!");
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('userInfo');
      navigate('/login');
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  return (
    <div className="profileScreen">
      <h2>Information</h2>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="firstName" className="mb-3">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled
          />
        </Form.Group>

        <Form.Group controlId="lastName" className="mb-3">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled
          />
        </Form.Group>

        <Form.Group controlId="Email" className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="Email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled
          />
        </Form.Group>

        <Button type="submit" variant="primary">
          Update Profile
        </Button>
      </Form>

      <Button variant="danger" onClick={handleLogout} className="mt-3">
        Logout
      </Button>
    </div>
  );
}

export default Profile;
