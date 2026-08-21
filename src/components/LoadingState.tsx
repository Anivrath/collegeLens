export default function LoadingState({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-black"></div>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}
