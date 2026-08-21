import Navbar from "@/components/Navbar";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="mx-auto max-w-md px-6 py-20">
        <div className="rounded-xl border bg-white p-8 shadow-sm">
          <h1 className="mb-6 text-3xl font-bold text-black">Sign In</h1>
          <p className="mb-6 text-gray-600">
            Welcome back! Sign in to your account to continue.
          </p>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
