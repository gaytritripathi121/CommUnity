import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  FormControlLabel,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { loginUser, registerUser } from '../authSlice';
import { useNavigate } from 'react-router-dom';
import { COMMUNITY_TYPES } from '@shared/constants';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const AuthForm = ({ isLogin }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    communities: [],
    isNGO: false,
    ngoName: '',
    joiningForNGO: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      await dispatch(loginUser(form));
    } else {
      await dispatch(registerUser(form));
    }
    navigate('/communities');
  };

  return (
    <Container maxWidth="sm">
      <Box
        component="form"
        onSubmit={handleSubmit}
        mt={4}
        display="flex"
        flexDirection="column"
        gap={2}
        sx={{
          backgroundColor: 'white',
          padding: 4,
          borderRadius: 3,
          boxShadow: 3,
        }}
      >
        

        {!isLogin && (
          <>
            <TextField
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Username"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircleIcon />
                  </InputAdornment>
                ),
              }}
            />

            <FormControl fullWidth>
              <InputLabel>Communities</InputLabel>
              <Select
                multiple
                name="communities"
                value={form.communities}
                onChange={(e) =>
                  setForm({ ...form, communities: e.target.value })
                }
                input={<OutlinedInput label="Communities" />}
                renderValue={(selected) => selected.join(', ')}
              >
                {COMMUNITY_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    <Checkbox checked={form.communities.includes(type)} />
                    <ListItemText primary={type} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Checkbox
                  name="isNGO"
                  checked={form.isNGO}
                  onChange={handleChange}
                />
              }
              label="Are you part of an NGO?"
            />

            {form.isNGO && (
              <>
                <TextField
                  label="NGO Name"
                  name="ngoName"
                  value={form.ngoName}
                  onChange={handleChange}
                  required
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      name="joiningForNGO"
                      checked={form.joiningForNGO}
                      onChange={handleChange}
                    />
                  }
                  label="Are you joining on behalf of this NGO?"
                />
              </>
            )}
          </>
        )}

        <TextField
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={form.password}
          onChange={handleChange}
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword((prev) => !prev)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          type="submit"
          variant="contained"
          sx={{
    borderRadius: 2,
    py: 1.5,
    mt: 1,
    backgroundColor: '#4a148c',
    '&:hover': {
      backgroundColor: '#38006b',
    },
  }}
>
          {isLogin ? 'Login' : 'Register'}
        </Button>
      </Box>
    </Container>
  );
};

export default AuthForm;
