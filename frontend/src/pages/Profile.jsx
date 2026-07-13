import { useState, useEffect } from "react";
import api from "../services/api";
import Card from "../components/Card";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const { updateUser } = useAuth();
  const [error, setError] = useState("");

  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await api.get("/user/profile");
      setProfile(res.data);
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setSaving(true);

    try {
      const res = await api.put("/user/profile", {
        fullName: profile.fullName,
        targetRole: profile.targetRole,
        experience: profile.experience,
        phone: profile.phone,
      });
      setMessage("Profile updated successfully");
      setProfile(res.data.user);
      updateUser({ fullName: res.data.user.fullName });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordMessage("");
    setPasswordSaving(true);

    try {
      await api.put("/user/change-password", passwordForm);
      setPasswordMessage("Password changed successfully");
      setPasswordForm({ currentPassword: "", newPassword: "" });
    } catch (err) {
      setPasswordError(err.response?.data?.message || "Failed to change password");
    } finally {
      setPasswordSaving(false);
    }
  };

  if (!profile) return <p className="text-text-secondary">Loading profile...</p>;

  return (
    <div>
      <h1 className="text-text-primary text-2xl font-semibold mb-6">Profile & Settings</h1>

      <Card className="max-w-md mb-6">
        <h2 className="text-text-primary font-medium mb-4">Profile details</h2>

        {error && <p className="text-danger text-sm mb-3">{error}</p>}
        {message && <p className="text-success text-sm mb-3">{message}</p>}

        <form onSubmit={handleSave}>
          <label className="block text-text-secondary text-sm mb-1">Full name</label>
          <input
            name="fullName"
            value={profile.fullName}
            onChange={handleChange}
            className="w-full border border-border rounded px-3 py-2 mb-4 text-text-primary"
          />

          <label className="block text-text-secondary text-sm mb-1">Email</label>
          <input
            value={profile.email}
            disabled
            className="w-full border border-border rounded px-3 py-2 mb-4 text-text-secondary bg-bg"
          />

          <label className="block text-text-secondary text-sm mb-1">Target role</label>
          <input
            name="targetRole"
            value={profile.targetRole}
            onChange={handleChange}
            placeholder="e.g. Frontend Developer"
            className="w-full border border-border rounded px-3 py-2 mb-4 text-text-primary"
          />

          <label className="block text-text-secondary text-sm mb-1">Experience</label>
          <input
            name="experience"
            value={profile.experience}
            onChange={handleChange}
            placeholder="e.g. 2 years"
            className="w-full border border-border rounded px-3 py-2 mb-4 text-text-primary"
          />

          <label className="block text-text-secondary text-sm mb-1">Phone</label>
          <input
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            className="w-full border border-border rounded px-3 py-2 mb-6 text-text-primary"
          />

          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </form>
      </Card>

      <Card className="max-w-md">
        <h2 className="text-text-primary font-medium mb-4">Change password</h2>

        {passwordError && <p className="text-danger text-sm mb-3">{passwordError}</p>}
        {passwordMessage && <p className="text-success text-sm mb-3">{passwordMessage}</p>}

        <form onSubmit={handlePasswordSubmit}>
          <label className="block text-text-secondary text-sm mb-1">Current password</label>
          <input
            type="password"
            name="currentPassword"
            value={passwordForm.currentPassword}
            onChange={handlePasswordChange}
            required
            className="w-full border border-border rounded px-3 py-2 mb-4 text-text-primary"
          />

          <label className="block text-text-secondary text-sm mb-1">New password</label>
          <input
            type="password"
            name="newPassword"
            value={passwordForm.newPassword}
            onChange={handlePasswordChange}
            required
            minLength={8}
            className="w-full border border-border rounded px-3 py-2 mb-6 text-text-primary"
          />

          <Button type="submit" disabled={passwordSaving}>
            {passwordSaving ? "Changing..." : "Change password"}
          </Button>
        </form>
      </Card>
    </div>
  );
}