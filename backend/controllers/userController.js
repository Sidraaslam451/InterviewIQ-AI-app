import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const getProfile = async (req, res) => {
  res.json({
    id: req.user._id,
    fullName: req.user.fullName,
    email: req.user.email,
    targetRole: req.user.targetRole,
    experience: req.user.experience,
    phone: req.user.phone,
  });
};

export const updateProfile = async (req, res) => {
  try {
    const { fullName, targetRole, experience, phone } = req.body;

    const user = await User.findById(req.user._id);

    if (fullName) user.fullName = fullName;
    if (targetRole !== undefined) user.targetRole = targetRole;
    if (experience !== undefined) user.experience = experience;
    if (phone !== undefined) user.phone = phone;

    await user.save();

    res.json({
      message: "Profile updated",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        targetRole: user.targetRole,
        experience: user.experience,
        phone: user.phone,
      },
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Failed to update profile", error: err.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new password are required" });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ message: "New password must be at least 8 characters" });
    }

    const user = await User.findById(req.user._id).select("+password");

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    user.password = newPassword; // pre("save") hook automatically hash kar dega
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ message: "Failed to change password", error: err.message });
  }
};