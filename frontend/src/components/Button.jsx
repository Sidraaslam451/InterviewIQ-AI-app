export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  fullWidth = false,
}) {
  const base = "py-2 px-4 rounded font-medium transition-colors";

  const variants = {
    primary: "bg-primary hover:bg-primary-hover text-white",
    secondary: "bg-surface border border-border text-text-primary hover:bg-bg",
    danger: "bg-danger text-white hover:opacity-90",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${fullWidth ? "w-full" : ""} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {children}
    </button>
  );
}