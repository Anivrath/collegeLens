export default function Navbar() {
  return (
    <nav className="border-b bg-black">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <h2 className="text-xl font-bold">CollegeLens</h2>

        <div className="flex gap-6 text-sm">
          <a href="/">Home</a>
          <a href="/colleges">Colleges</a>
          <a href="/compare">Compare</a>
          <a href="/predictor">Predictor</a>
        </div>
      </div>
    </nav>
  );
}