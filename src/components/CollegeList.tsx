"use client";

import { useEffect, useState } from "react";
import CollegeCard from "./CollegeCard";

type College = {
  id: number;
  name: string;
  slug: string;
  city: string;
  state: string;
  fees: number;
  rating: number;
};

export default function CollegeList() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchColleges() {
      try {
        const response = await fetch("/api/colleges");

        if (!response.ok) {
          throw new Error("Failed to fetch colleges");
        }

        const result = await response.json();

        setColleges(result.data);
      } catch (error) {
        console.error("Error fetching colleges:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchColleges();
  }, []);

  if (loading) {
    return <p className="text-black">Loading colleges...</p>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {colleges.map((college) => (
        <CollegeCard key={college.id} college={college} />
      ))}
    </div>
  );
}