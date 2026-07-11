export default function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-surface border border-border rounded p-6 ${className}`}
    >
      {children}
    </div>
  );
}