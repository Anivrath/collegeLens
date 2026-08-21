import Navbar from "@/components/Navbar";
import CollegeCard from "@/components/CollegeCard";
export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h1 className="text-5xl font-bold text-gray-900">
          Find the right college for your future
        </h1>

        <p className="mt-4 text-lg text-gray-600">
          Search, compare and discover colleges in one place.
        </p>

        <div className="mt-8 flex gap-3">
          <input
            type="text"
            placeholder="Search colleges..."
            className="w-full max-w-xl rounded-lg border px-4 py-3"
          />

          <button className="rounded-lg bg-black px-6 py-3 text-white">
            Search
          </button>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 pb-20">
  <h2 className="mb-6 text-2xl font-bold text-black">
    Popular Colleges
  </h2>

  <div className="grid gap-6 md:grid-cols-3">
    <CollegeCard
      name="RV College of Engineering"
      location="Bangalore"
      fees="₹2.5L"
      rating={4.5}
    />

    <CollegeCard
      name="BMS College of Engineering"
      location="Bangalore"
      fees="₹3.0L"
      rating={4.3}
    />

    <CollegeCard
      name="MS Ramaiah Institute of Technology"
      location="Bangalore"
      fees="₹2.8L"
      rating={4.4}
    />
  </div>
</section>
    </main>
  );
}