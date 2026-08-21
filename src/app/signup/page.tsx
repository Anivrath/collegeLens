import Navbar from "@/components/Navbar";
import SignupForm from "@/components/SignupForm";

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="mx-auto max-w-md px-6 py-20">
        <div className="rounded-xl border bg-white p-8 shadow-sm">
          <h1 className="mb-6 text-3xl font-bold text-black">Create Account</h1>
          <p className="mb-6 text-gray-600">
            Join CollegeLens to save colleges and participate in discussions.
          </p>
          <SignupForm />
        </div>
      </div>
    </main>
  );
}
