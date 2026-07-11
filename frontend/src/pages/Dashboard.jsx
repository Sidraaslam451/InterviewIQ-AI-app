import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-text-primary text-2xl font-semibold">
        Welcome, {user?.fullName}
      </h1>
      <p className="text-text-secondary">{user?.email}</p>
    </div>
  );
}