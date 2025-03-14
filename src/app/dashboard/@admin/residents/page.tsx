import { withAuth } from "@/lib/withAuth";
import { db } from "@/lib/db";
import ResidentTable from '@/components/ResidentTable';

async function ResidentsPage() {
  const residents = await db.resident.findMany({
    include: {
      address: true,
      emergencyContact: true,
      proofOfIdentity: true,
    },
  });

  return (
    <main className="flex flex-col gap-2 lg:gap-2 min-h-[90vh] w-full">
      {residents && residents.length > 0 ? (
        <ResidentTable residents={residents} />
      ) : (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
          <div className="flex flex-col items-center text-center">
            <h3 className="text-2xl font-bold tracking-tight">
              No Residents
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Residents will be shown here when a certificate request is submitted.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}

export default withAuth(ResidentsPage, { allowedRoles: ["ADMIN"] });