import React, { useState } from 'react';
import { TextField, Button, Typography, Container } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';

export default function RegistrationForm() {
  const [formData, setFormData] = useState({ username: '', password: '', name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess(false);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    // Simple frontend validation example
    if (!formData.username || !formData.password || !formData.email) {
      setError('Please fill all required fields');
      setLoading(false);
      return;
    }

    // Replace this with your API call
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
    }, 1500);
  };

  return (
    <Container>
      <div className="glass-card">
        <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 'bold', letterSpacing: 2 }}>
          Join FitnessPro
        </Typography>

        <form onSubmit={handleSubmit} noValidate>
          <div className="floating-input">
            <PersonIcon />
            <input
              type="text"
              name="username"
              placeholder=" "
              value={formData.username}
              onChange={handleChange}
              autoComplete="username"
            />
            <label>Username *</label>
          </div>

          <div className="floating-input">
            <LockIcon />
            <input
              type="password"
              name="password"
              placeholder=" "
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
            <label>Password *</label>
          </div>

          <div className="floating-input">
            <BadgeIcon />
            <input
              type="text"
              name="name"
              placeholder=" "
              value={formData.name}
              onChange={handleChange}
            />
            <label>Full Name</label>
          </div>

          <div className="floating-input">
            <EmailIcon />
            <input
              type="email"
              name="email"
              placeholder=" "
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
            />
            <label>Email *</label>
          </div>

          {error && <Typography color="error" align="center">{error}</Typography>}

          <Button
            type="submit"
            fullWidth
            className="shine-button"
            disabled={loading}
            sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}
          >
            {loading ? 'Registering...' : 'Register'}
          </Button>

          {success && (
            <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
              <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
              <path className="checkmark__check" fill="none" d="M14 27l7 7 16-16" />
            </svg>
          )}
        </form>
      </div>
    </Container>
  );
}
