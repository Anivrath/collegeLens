import SaveCollegeButton from "@/components/SaveCollegeButton";

type College = {
  id: number;
  name: string;
  slug: string;
  city: string;
  state: string;
  fees: number;
  rating: number;
};

type CollegeCardProps = {
  college: College;
};

export default function CollegeCard({ college }: CollegeCardProps) {
  return (
    <div className="rounded-xl border bg-white p-6 text-black shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-2 flex items-start justify-between">
        <h2 className="text-xl font-semibold text-black">{college.name}</h2>
        <SaveCollegeButton collegeId={college.id} variant="icon" />
      </div>

      <p className="mb-4 text-gray-600">
        {college.city}, {college.state}
      </p>

      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Annual Fees</p>
          <p className="text-lg font-bold text-black">
            ₹{(college.fees / 100000).toFixed(2)}L
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Rating</p>
          <p className="text-lg font-bold text-black">{college.rating} ⭐</p>
        </div>
      </div>

      <a
        href={`/colleges/${college.slug}`}
        className="block rounded-lg bg-black py-2 text-center text-sm font-medium text-white hover:bg-gray-800"
      >
        View Details
      </a>
    </div>
  );
}