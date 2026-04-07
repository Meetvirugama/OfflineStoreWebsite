import {
  registerService,
  loginService,
  verifyOtpService,
  resendOtpService,
  forgotPasswordService,
  resetPasswordService
} from "../services/authService.js";


// REGISTER
export const register = async (req, res) => {
  try {
    const result = await registerService(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { token } = await loginService(email, password);
    res.json({ token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// VERIFY OTP
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    await verifyOtpService(email, otp);
    res.json({ message: "Email verified successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// RESEND OTP
export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await resendOtpService(email);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await forgotPasswordService(email);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const result = await resetPasswordService(email, otp, newPassword);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// LOGOUT
export const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};