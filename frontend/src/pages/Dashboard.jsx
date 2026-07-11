import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-bg p-8">
      <h1 className="text-text-primary text-2xl font-semibold">
        Welcome, {user?.fullName}
      </h1>
      <p className="text-text-secondary mb-4">{user?.email}</p>
      <button
        onClick={logout}
        className="bg-danger text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}