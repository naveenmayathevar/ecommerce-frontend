function Button({ children, onClick, type = "button" }) {
  return (
    <button
      onClick={onClick}
      type={type}
      style={{
        backgroundColor: "var(--color-accent-1)",
        color: "white",
        padding: "10px 15px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontWeight: "600"
      }}
    >
      {children}
    </button>
  );
}

export default Button;
