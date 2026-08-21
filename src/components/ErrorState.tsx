type ErrorStateProps = {
  message: string;
  retry?: () => void;
};

export default function ErrorState({ message, retry }: ErrorStateProps) {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="text-center">
        <div className="mb-4 text-6xl">⚠️</div>
        <h3 className="mb-2 text-2xl font-bold text-red-900">Error</h3>
        <p className="mb-6 text-red-700">{message}</p>
        {retry && (
          <button
            onClick={retry}
            className="rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-800"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
