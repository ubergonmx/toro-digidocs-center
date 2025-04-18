import { withAuth } from "@/lib/auth/withAuth";
import { db } from "@/lib/db";
import ResidentAdmin from "./_components/ResidentAdmin";
import { residentWithRelations } from "@/types/shared";

async function ResidentsPage() {
  // Initial data fetch for SSR - limited to first page only
  const residents = await db.resident.findMany({
    take: 10,
    orderBy: {
      lastName: "asc",
    },
    ...residentWithRelations,
  });

  // Count total residents for pagination
  const totalCount = await db.resident.count();
  
  // Serialize the data to avoid date serialization issues
  const serializedResidents = JSON.parse(JSON.stringify(residents));

  return (
    <main className="flex min-h-[90vh] w-full flex-col gap-2">
      <ResidentAdmin initialResidents={serializedResidents} initialTotal={totalCount} />
    </main>
  );
}

export default withAuth(ResidentsPage, { allowedRoles: ["ADMIN"] });