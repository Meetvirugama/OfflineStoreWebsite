import useToastStore from "@core/hooks/useToast";
import "@/styles/Toast.css";

export default function Toast() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast--${toast.type} animate-fade`}>
          <span className="toast__icon">
            {toast.type === "success" && "✅"}
            {toast.type === "error" && "❌"}
            {toast.type === "info" && "ℹ️"}
            {toast.type === "warning" && "⚠️"}
          </span>
          <span className="toast__msg">{toast.message}</span>
          <button
            className="toast__close"
            onClick={() => removeToast(toast.id)}
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
