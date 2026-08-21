type EmptyStateProps = {
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
};

export default function EmptyState({ title, message, action }: EmptyStateProps) {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="text-center">
        <h3 className="mb-2 text-2xl font-bold text-gray-900">{title}</h3>
        <p className="mb-6 text-gray-600">{message}</p>
        {action && (
          <button
            onClick={action.onClick}
            className="rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-800"
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
}
