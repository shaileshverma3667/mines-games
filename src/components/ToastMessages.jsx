const ToastMessages = ({ toasts }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium min-w-[200px] animate-slide-in ${
            toast.type === "error"
              ? "bg-gradient-to-r from-red-500 to-red-600 border border-red-400/50"
              : toast.type === "success"
              ? "bg-gradient-to-r from-green-500 to-green-600 border border-green-400/50"
              : "bg-gradient-to-r from-blue-500 to-blue-600 border border-blue-400/50"
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
};

export default ToastMessages;