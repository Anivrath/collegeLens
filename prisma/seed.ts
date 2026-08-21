import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

const colleges = [
  {
    name: "RV College of Engineering",
    slug: "rv-college-of-engineering",
    city: "Bangalore",
    state: "Karnataka",
    fees: 250000,
    rating: 4.5,
  },
  {
    name: "BMS College of Engineering",
    slug: "bms-college-of-engineering",
    city: "Bangalore",
    state: "Karnataka",
    fees: 300000,
    rating: 4.3,
  },
  {
    name: "MS Ramaiah Institute of Technology",
    slug: "ms-ramaiah-institute-of-technology",
    city: "Bangalore",
    state: "Karnataka",
    fees: 280000,
    rating: 4.4,
  },
  {
    name: "Manipal Institute of Technology",
    slug: "manipal-institute-of-technology",
    city: "Manipal",
    state: "Karnataka",
    fees: 450000,
    rating: 4.6,
  },
  {
    name: "PES University",
    slug: "pes-university",
    city: "Bangalore",
    state: "Karnataka",
    fees: 400000,
    rating: 4.4,
  },
  {
    name: "NITK Surathkal",
    slug: "nitk-surathkal",
    city: "Surathkal",
    state: "Karnataka",
    fees: 125000,
    rating: 4.7,
  },
  {
    name: "New Horizon College of Engineering",
    slug: "new-horizon-college-of-engineering",
    city: "Bangalore",
    state: "Karnataka",
    fees: 275000,
    rating: 4.1,
  },
  {
    name: "Dayananda Sagar College of Engineering",
    slug: "dayananda-sagar-college-of-engineering",
    city: "Bangalore",
    state: "Karnataka",
    fees: 290000,
    rating: 4.2,
  },
  {
    name: "Sahyadri College of Engineering and Management",
    slug: "sahyadri-college-of-engineering-and-management",
    city: "Mangalore",
    state: "Karnataka",
    fees: 180000,
    rating: 4.0,
  },
  {
    name: "Canara Engineering College",
    slug: "canara-engineering-college",
    city: "Mangalore",
    state: "Karnataka",
    fees: 160000,
    rating: 3.9,
  },
];

async function main() {
  // Seed colleges (idempotent)
  for (const collegeData of colleges) {
    await prisma.college.upsert({
      where: { slug: collegeData.slug },
      update: {},
      create: collegeData,
    });
  }

  console.log("✅ College data seeded successfully.");

  // Get all colleges to seed relations
  const allColleges = await prisma.college.findMany();

  // Seed courses for each college
  for (const college of allColleges) {
    const existingCourses = await prisma.course.count({
      where: { collegeId: college.id },
    });

    if (existingCourses === 0) {
      await prisma.course.createMany({
        data: [
          {
            name: "Computer Science Engineering",
            duration: "4 years",
            fees: college.fees,
            collegeId: college.id,
          },
          {
            name: "Electronics and Communication Engineering",
            duration: "4 years",
            fees: college.fees - 20000,
            collegeId: college.id,
          },
          {
            name: "Mechanical Engineering",
            duration: "4 years",
            fees: college.fees - 30000,
            collegeId: college.id,
          },
          {
            name: "Information Science Engineering",
            duration: "4 years",
            fees: college.fees - 10000,
            collegeId: college.id,
          },
        ],
      });
    }
  }

  console.log("✅ Course data seeded successfully.");

  // Seed placements for each college
  for (const college of allColleges) {
    const existingPlacements = await prisma.placement.count({
      where: { collegeId: college.id },
    });

    if (existingPlacements === 0) {
      const basePkg = Math.floor(college.rating * 200000);
      await prisma.placement.createMany({
        data: [
          {
            year: 2024,
            averagePackage: basePkg,
            highestPackage: basePkg * 3,
            placementRate: college.rating * 20,
            collegeId: college.id,
          },
          {
            year: 2023,
            averagePackage: Math.floor(basePkg * 0.95),
            highestPackage: Math.floor(basePkg * 2.8),
            placementRate: college.rating * 19,
            collegeId: college.id,
          },
        ],
      });
    }
  }

  console.log("✅ Placement data seeded successfully.");

  // Seed reviews for each college
  for (const college of allColleges) {
    const existingReviews = await prisma.review.count({
      where: { collegeId: college.id },
    });

    if (existingReviews === 0) {
      await prisma.review.createMany({
        data: [
          {
            rating: college.rating,
            comment: `Great college with excellent infrastructure and faculty. The placement opportunities are good and the campus life is vibrant.`,
            collegeId: college.id,
          },
          {
            rating: Math.max(college.rating - 0.5, 3.0),
            comment: `Good college overall. Could improve on extracurricular activities and hostel facilities. Academics are strong.`,
            collegeId: college.id,
          },
          {
            rating: Math.min(college.rating + 0.3, 5.0),
            comment: `Excellent learning environment with experienced professors. Modern labs and industry exposure through internships.`,
            collegeId: college.id,
          },
        ],
      });
    }
  }

  console.log("✅ Review data seeded successfully.");

  // Seed cutoffs for each college
  const courses = ["Computer Science", "Electronics", "Mechanical", "Information Science"];
  const categories = ["General", "OBC", "SC", "ST", "3A", "3B", "2A", "2B"];
  const exams = ["KCET", "COMEDK"];

  for (const college of allColleges) {
    const existingCutoffs = await prisma.cutoff.count({
      where: { collegeId: college.id },
    });

    if (existingCutoffs === 0) {
      const cutoffData = [];
      
      // Base rank calculation based on rating (higher rating = lower rank required)
      const baseRank = Math.floor((5 - college.rating) * 20000);

      for (const exam of exams) {
        for (const course of courses) {
          for (const category of categories) {
            // Adjust rank based on category
            const categoryMultiplier = category === "General" ? 1 : category === "OBC" ? 1.5 : 2;
            const courseMultiplier = course === "Computer Science" ? 1 : 1.3;
            
            cutoffData.push({
              exam,
              course,
              category,
              year: 2024,
              cutoffRank: Math.floor(baseRank * categoryMultiplier * courseMultiplier),
              collegeId: college.id,
            });
          }
        }
      }

      await prisma.cutoff.createMany({ data: cutoffData });
    }
  }

  console.log("✅ Cutoff data seeded successfully.");
}

main()
  .catch((error) => {
    console.error("❌ Error while seeding data:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });