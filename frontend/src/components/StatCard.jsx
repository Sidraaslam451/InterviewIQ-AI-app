import Card from "./Card";

export default function StatCard({ label, value }) {
  return (
    <Card>
      <p className="text-text-secondary text-sm mb-1">{label}</p>
      <p className="text-text-primary text-3xl font-semibold">{value}</p>
    </Card>
  );
}