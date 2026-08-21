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
  await prisma.college.createMany({
    data: colleges,
    skipDuplicates: true,
  });

  console.log("✅ College data seeded successfully.");
}

main()
  .catch((error) => {
    console.error("❌ Error while seeding college data:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });