type CollegeCardProps = {
  name: string;
  location: string;
  fees: string;
  rating: number;
};

export default function CollegeCard({
  name,
  location,
  fees,
  rating,
}: CollegeCardProps) {
  return (
    <div className="rounded-xl border bg-white p-5 text-black shadow-sm">
      <h2 className="text-xl font-semibold text-black">
        {name}
      </h2>

      <p className="mt-2 text-gray-700">
        {location}
      </p>

      <div className="mt-4 flex justify-between">
        <span className="text-gray-900">{fees}</span>
        <span className="text-gray-900">⭐ {rating}</span>
      </div>
    </div>
  );
}