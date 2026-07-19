import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Briefcase, Clock, Phone, Lock, Check } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import Card from "../components/Card";
import Button from "../components/Button";

export default function Profile() {
  const { updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
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

  const handleChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });

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

  const handlePasswordChange = (e) => setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });

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

  if (!profile) {
    return (
      <div className="flex items-center justify-center py-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const inputClass =
    "w-full border border-border rounded-lg pl-10 pr-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all";

  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-2xl font-semibold text-text-primary mb-1"
      >
        Profile & Settings
      </motion.h1>
      <p className="text-text-secondary mb-8">Manage your account details</p>

      <div className="flex flex-col md:flex-row gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1">
          <Card className="relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />

            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="w-14 h-14 rounded-full bg-linear-to-br from-primary to-primary-dark flex items-center justify-center text-white font-semibold text-xl shadow-md shadow-primary/30">
                {profile.fullName?.charAt(0)}
              </div>
              <div>
                <h2 className="text-text-primary font-semibold">{profile.fullName}</h2>
                <p className="text-text-secondary text-sm">{profile.email}</p>
              </div>
            </div>

            {error && <p className="text-danger text-sm mb-4 bg-danger/10 px-3 py-2 rounded-lg">{error}</p>}
            {message && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex items-center gap-1.5 text-success text-sm mb-4 bg-success/10 px-3 py-2 rounded-lg"
              >
                <Check size={14} /> {message}
              </motion.p>
            )}

            <form onSubmit={handleSave}>
              <div className="relative mb-4">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input name="fullName" value={profile.fullName} onChange={handleChange} className={inputClass} />
              </div>

              <div className="relative mb-4">
                <Briefcase size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  name="targetRole"
                  value={profile.targetRole}
                  onChange={handleChange}
                  placeholder="Target role"
                  className={inputClass}
                />
              </div>

              <div className="relative mb-4">
                <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  name="experience"
                  value={profile.experience}
                  onChange={handleChange}
                  placeholder="Experience (e.g. 2 years)"
                  className={inputClass}
                />
              </div>

              <div className="relative mb-6">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  className={inputClass}
                />
              </div>

              <Button type="submit" loading={saving}>
                {saving ? "Saving..." : "Save changes"}
              </Button>
            </form>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex-1">
          <Card>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Lock size={16} className="text-primary" />
              </div>
              <h2 className="text-text-primary font-semibold">Change password</h2>
            </div>

            {passwordError && (
              <p className="text-danger text-sm mb-4 bg-danger/10 px-3 py-2 rounded-lg">{passwordError}</p>
            )}
            {passwordMessage && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex items-center gap-1.5 text-success text-sm mb-4 bg-success/10 px-3 py-2 rounded-lg"
              >
                <Check size={14} /> {passwordMessage}
              </motion.p>
            )}

            <form onSubmit={handlePasswordSubmit}>
              <div className="relative mb-4">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="password"
                  name="currentPassword"
                  placeholder="Current password"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  required
                  className={inputClass}
                />
              </div>

              <div className="relative mb-6">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="password"
                  name="newPassword"
                  placeholder="New password"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength={8}
                  className={inputClass}
                />
              </div>

              <Button type="submit" variant="secondary" loading={passwordSaving}>
                {passwordSaving ? "Changing..." : "Change password"}
              </Button>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}