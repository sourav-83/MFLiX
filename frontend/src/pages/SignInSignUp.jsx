// SignInSignUp.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, TextField, Button, styled, Paper, Tabs, Tab, Alert } from "@mui/material";
import { useAuth } from "../components/contexts/AuthContext";

const Wrapper = styled(Paper)`
  max-width: 400px;
  margin: 80px auto;
  padding: 40px;
  background-color: #1c1c1c;
  color: white;
`;

const StyledInput = styled(TextField)`
  margin-bottom: 20px;
  & .MuiInputBase-input {
    color: #d3d3d3;
    background-color: #1c1c1c;
  }
  & .MuiInputLabel-root {
    color: gray;
  }
  & .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline {
    border-color: gray;
  }
  & .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
    border-color: gray;
  }
  & .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline {
    border-color: gray;
  }
  & .MuiOutlinedInput-root.Mui-focused {
    background-color: #1c1c1c;
  }
  & .MuiOutlinedInput-root.Mui-filled {
    background-color: #1c1c1c;
  }
`;

const StyledTabs = styled(Tabs)`
  margin-bottom: 20px;
  & .MuiTabs-indicator {
    background-color: #F5C518;
  }
  & .MuiTab-root {
    color: gray;
    &.Mui-selected {
      color: white;
    }
  }
`;

const OTPContainer = styled(Box)`
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 20px;
`;

const SendOTPButton = styled(Button)`
  min-width: 80px;
  color: white;
  border-color: #555555;
  background-color: #333333;
  
  &:hover {
    background-color: #444444;
    border-color: #666666;
  }
  
  &:disabled {
    color: #666666;
    background-color: #2a2a2a;
    border-color: #444444;
  }
`;

const ResendButton = styled(Button)`
  font-size: 12px;
  padding: 4px 8px;
  min-width: auto;
  color: white;
  background: transparent;
  text-decoration: underline;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  &:disabled {
    color: #666666;
    text-decoration: none;
  }
`;

const SubmitButton = styled(Button)`
  background-color: #F5C518;
  color: white;
  padding: 12px 0;
  font-weight: bold;
  
  &:hover {
    background-color: #F5C518;
  }
  
  &:disabled {
    background-color: #666666;
    color: #999999;
  }
`;

const SignInSignUp = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [tab, setTab] = useState(0);
  const [form, setForm] = useState({ username: "", email: "", password: "", otp: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // OTP related state
  const [generatedOTP, setGeneratedOTP] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [otpExpiry, setOtpExpiry] = useState(null);
  const [lastOtpSent, setLastOtpSent] = useState(0);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Auto-verify OTP when user enters 6 digits
  useEffect(() => {
    if (form.otp && form.otp.length === 6 && otpSent && !otpVerified && generatedOTP) {
      const isValid = verifyOTP();
      if (isValid) {
        setSuccess("OTP verified successfully!");
        setError("");
      }
    }
  }, [form.otp, otpSent, otpVerified, generatedOTP]);

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendOTP = async (email) => {
    const otp = generateOTP();
    setGeneratedOTP(otp);

    try {
      const emailParams = {
        to_email: email,
        otp_code: otp,
        to_name: form.username || 'User',
        from_name: 'MFL!X',
        email: email
      };

      const response = await window.emailjs.send(
        'service_bb3sl3g',
        'template_vsblu5x',
        emailParams,
        'OWGcnCU0RFMayzRxg'
      );

      if (response.status === 200) {
        setOtpSent(true);
        setOtpVerified(false);
        setCountdown(60);
        setOtpExpiry(Date.now() + 10 * 60 * 1000);
        setSuccess("OTP sent to your email successfully!");
        setError("");
        return true;
      } else {
        throw new Error('Failed to send OTP');
      }
    } catch (err) {
      console.error("Error sending OTP:", err);
      setError("Failed to send OTP. Please try again.");
      return false;
    }
  };

  const verifyOTP = () => {
    if (!generatedOTP || !form.otp) return false;

    if (Date.now() > otpExpiry) {
      setError("OTP has expired. Please request a new one.");
      setOtpSent(false);
      setOtpVerified(false);
      setGeneratedOTP("");
      return false;
    }

    if (form.otp === generatedOTP) {
      setOtpVerified(true);
      return true;
    } else {
      setError("Invalid OTP. Please try again.");
      setOtpVerified(false);
      return false;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Limit OTP input to 6 digits
    if (name === 'otp') {
      if (value.length <= 6 && /^\d*$/.test(value)) {
        setForm({ ...form, [name]: value });
      }
    } else {
      setForm({ ...form, [name]: value });
    }

    // Clear messages on input change
    if (error) setError("");
    if (success && name !== 'otp') setSuccess("");
  };

  const handleSendOTP = async () => {
    if (!form.email) {
      setError("Please enter your email first");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Rate limiting
    const now = Date.now();
    if (now - lastOtpSent < 60000) {
      setError("Please wait before requesting another OTP");
      return;
    }

    setLoading(true);
    setLastOtpSent(now);

    const success = await sendOTP(form.email);
    if (success) {
      setForm({ ...form, otp: "" }); // Clear previous OTP
    }

    setLoading(false);
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;

    const now = Date.now();
    if (now - lastOtpSent < 30000) {
      setError("Please wait before requesting another OTP");
      return;
    }

    setLoading(true);
    setLastOtpSent(now);

    const success = await sendOTP(form.email);
    if (success) {
      setForm({ ...form, otp: "" }); // Clear previous OTP
      setOtpVerified(false);
    }

    setLoading(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      // Sign In logic
      if (tab === 0) {
        if (!form.username || !form.password) {
          setError("Please fill in all required fields");
          return;
        }

        const credentials = {
          username: form.username,
          password: form.password,
          user_type_enum: 'signed_in'
        };

        console.log('Attempting sign in with:', credentials);
        const result = await login(credentials);
        console.log('Sign in result:', result);

        if (result.success) {
          setSuccess("Sign in successful!");
          setTimeout(() => navigate("/"), 1000);
        } else {
          setError(result.error || "Invalid credentials");
        }
      }

      // Sign Up logic
      else {
        if (!form.username || !form.email || !form.password) {
          setError("Please fill in all required fields");
          return;
        }

        if (!otpSent) {
          setError("Please send OTP first");
          return;
        }

        if (!otpVerified) {
          setError("Please verify your OTP first");
          return;
        }

        // Clean credentials for signup - only send what backend expects
        const credentials = {
          username: form.username,
          email: form.email,
          password: form.password
        };

        console.log('Attempting sign up with:', credentials);
        const result = await login(credentials);
        console.log('Sign up result:', result);

        if (result.success) {
          setSuccess("Account created successfully!");

          // Add a debug check here
          console.log('Current auth state after signup:', {
            user: result.user,
            isAuthenticated,
            storedUser: localStorage.getItem('user'),
            storedToken: localStorage.getItem('token')
          });

          setTimeout(() => navigate("/"), 1000);
        } else {
          // Show the actual error message from backend
          setError(result.error || "Registration failed");
          console.error('Signup failed with error:', result.error);
        }
      }
    } catch (err) {
      console.error("Authentication error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (_, newVal) => {
    setTab(newVal);
    setError("");
    setSuccess("");
    // Reset all state when switching tabs
    setOtpSent(false);
    setOtpVerified(false);
    setGeneratedOTP("");
    setOtpExpiry(null);
    setCountdown(0);
    setLastOtpSent(0);
    setForm({ username: "", email: "", password: "", otp: "" });
  };

  const isSignUpReady = () => {
    return form.username && form.email && form.password && otpVerified;
  };

  const isSignInReady = () => {
    return form.username && form.password;
  };

  return (
    <Wrapper>
      <Typography variant="h4" align="center" sx={{ mb: 3, color: '#F5C518', fontWeight: 'bold' }}>
        MFL!X
      </Typography>

      <StyledTabs
        value={tab}
        onChange={handleTabChange}
        textColor="inherit"
        indicatorColor="primary"
        centered
      >
        <Tab label="Sign In" />
        <Tab label="Sign Up" />
      </StyledTabs>

      {error && (
        <Alert severity="error" sx={{ mb: 2, backgroundColor: '#d32f2f', color: 'white' }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2, backgroundColor: '#2e7d32', color: 'white' }}>
          {success}
        </Alert>
      )}

      {/* Sign Up Form */}
      {tab === 1 && (
        <>
          <StyledInput
            label="Username"
            variant="outlined"
            fullWidth
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />

          <StyledInput
            label="Email"
            variant="outlined"
            fullWidth
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <StyledInput
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <OTPContainer>
            <StyledInput
              label="Enter OTP"
              variant="outlined"
              fullWidth
              name="otp"
              value={form.otp}
              onChange={handleChange}
              disabled={!otpSent}
              placeholder="6-digit code"
              sx={{ marginBottom: 0 }}
              inputProps={{ maxLength: 6 }}
            />
            <SendOTPButton
              variant="contained"
              onClick={handleSendOTP}
              disabled={loading || !form.email || (otpSent && otpVerified)}
            >
              {otpVerified ? '✓ Sent' : (otpSent ? 'Resend' : 'Send OTP')}
            </SendOTPButton>
          </OTPContainer>

          {otpSent && (
            <Box sx={{ textAlign: 'center', marginBottom: 2 }}>
              <Typography variant="body2" color="gray" sx={{ mb: 1 }}>
                {otpVerified ? (
                  <span style={{ color: '#4caf50' }}>✓ OTP verified successfully!</span>
                ) : (
                  `OTP sent to ${form.email}. Check your inbox.`
                )}
              </Typography>

              {!otpVerified && (
                <Typography variant="body2" color="gray">
                  Didn't receive OTP?{' '}
                  <ResendButton
                    onClick={handleResendOTP}
                    disabled={countdown > 0 || loading}
                  >
                    {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
                  </ResendButton>
                </Typography>
              )}
            </Box>
          )}
        </>
      )}

      {/* Sign In Form */}
      {tab === 0 && (
        <>
          <StyledInput
            label="Username"
            variant="outlined"
            fullWidth
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />

          <StyledInput
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </>
      )}

      <SubmitButton
        variant="contained"
        fullWidth
        onClick={handleSubmit}
        disabled={loading || (tab === 0 ? !isSignInReady() : !isSignUpReady())}
      >
        {loading ? "Loading..." : (tab === 0 ? "Sign In" : "Sign Up")}
      </SubmitButton>

      <Typography variant="body2" align="center" sx={{ mt: 2, color: 'gray' }}>
        {tab === 0 ? "Don't have an account? " : "Already have an account? "}
        <Button
          variant="text"
          onClick={() => setTab(tab === 0 ? 1 : 0)}
          sx={{ color: '#F5C518', textTransform: 'none', p: 0, minWidth: 'auto' }}
        >
          {tab === 0 ? "Sign Up" : "Sign In"}
        </Button>
      </Typography>
    </Wrapper>
  );
};

export default SignInSignUp;