"use client";

import { useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2, Search } from "lucide-react";
import { CertificateStatus, CertificateType } from "@prisma/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CertificateTable from "./CertificateTable";
import { Input } from "@/components/ui/input";
import { useQueryState } from "nuqs";
import { getCertificateStatusBadge } from "@/components/utils";
import { AdminCertificate } from "@/types/admin";

const ITEMS_PER_PAGE = 10;

interface CertificateAdminProps {
  initialCertificates: AdminCertificate[];
  initialTotal: number;
}

export default function CertificateAdmin({ initialCertificates, initialTotal }: CertificateAdminProps) {
  const [page, setPage] = useQueryState("page", { defaultValue: 1, parse: Number });
  const [type, setType] = useQueryState("type", { defaultValue: "ALL" });
  const [status, setStatus] = useQueryState("status", { defaultValue: "ALL" });
  const [search, setSearch] = useQueryState("search", { defaultValue: "" });
  const isInitialLoadRef = useRef(true);

  const previousDataRef = useRef({
    certificates: initialCertificates, // Removed JSON.parse
    total: initialTotal,
    page: 1,
    totalPages: Math.ceil(initialTotal / ITEMS_PER_PAGE),
  });

  // Fetch certificates with pagination, filtering, and search
  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: ["certificates", page, status, type, search],
    queryFn: async () => {
      // When a query executes, we're no longer in the initial load
      isInitialLoadRef.current = false;
      
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", ITEMS_PER_PAGE.toString());
      if (status !== "ALL") params.set("status", status);
      if (type !== "ALL") params.set("type", type);
      if (search) params.set("search", search);

      const res = await fetch(`/api/admin/certificates?${params}`);
      if (!res.ok) throw new Error("Failed to fetch certificates");
      const data = await res.json();
      
      previousDataRef.current = data;
      return data;
    },
    staleTime: 0,
    initialData: isInitialLoadRef.current ? previousDataRef.current : undefined,
    // Use the previous data as a placeholder while loading
    // This is useful for keeping the UI responsive while data is being fetched
    placeholderData: !isInitialLoadRef.current || 
                  (status === "ALL" && 
                  type === "ALL" && 
                  search === "" && 
                  page === 1 ) ?
      previousDataRef.current : undefined,
    // Check if we should skip the initial query
    enabled: !(isInitialLoadRef.current && 
              status === "ALL" && 
              type === "ALL" && 
              search === "" && 
              page === 1 && 
              initialCertificates.length > 0),
    // This will prevent the query from running on the initial render
    // and will only run when the page, status, type, or search changes
  });
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value || null);
    setPage(1); // Reset to first page on search change
  };

  const handleStatusChange = (value: string) => {
    setStatus(value || null);
    setPage(1); // Reset to first page on status change
  };
  const handleTypeChange = (value: string) => {
    setType(value || null);
    setPage(1); // Reset to first page on type change
  };

  const certificates = data?.certificates || [];
  const totalPages = data?.totalPages || Math.ceil(initialTotal / ITEMS_PER_PAGE);
  const totalCertificates = data?.total || initialTotal;

  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-col items-start justify-between space-y-4 border-b pb-4 @container">  
        <div>
          <CardTitle className="text-2xl font-bold text-green-primary">Certificate Requests</CardTitle>
          <CardDescription>Manage all certificate requests for Barangay Bahay Toro</CardDescription>
        </div>

        <div className="flex w-full flex-col gap-2 @lg:flex-row sm:gap-4">
          <div className="relative w-full">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search certificates..."
              value={search || ""}
              onChange={handleSearchChange}
              className="w-full pl-8"
            />
          </div>
          
          <div className="flex w-full flex-col gap-2 @sm:flex-row sm:space-x-2 sm:space-y-0">
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                {Object.keys(CertificateStatus).map((key) => (
                  <SelectItem key={key} value={key}>{getCertificateStatusBadge(key as CertificateStatus)}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={type} onValueChange={handleTypeChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                {Object.keys(CertificateType).map((key) => (
                  <SelectItem key={key} value={key}>{key.replace(/_/g, " ")}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-green-primary" />
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-red-500">Error loading certificates. Please try again.</p>
          </div>
        ) : certificates.length > 0 ? (
          <>
            <div className="relative w-full overflow-x-auto">
              {isFetching && <LoaderComponent/>}
              <CertificateTable 
                certificates={certificates} 
                isLoading={isFetching} 
                refetch={refetch}  // Add this line
              />
            </div>
            <div className="flex items-center justify-between border-t p-4">
              <div className="text-sm text-muted-foreground">
                Showing {((page - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(page * ITEMS_PER_PAGE, totalCertificates)} of {totalCertificates} certificates
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setPage(Math.max(page - 1, 1))} 
                  disabled={page === 1 || isFetching}
                  className="px-1 min-[500px]:px-3"
                >
                  <ChevronLeft className="mr-1 h-4 w-4" /> <span className="hidden min-[500px]:inline">Previous</span>
                </Button>
                <div className="text-nowrap text-sm">
                  <span className="hidden min-[500px]:inline">Page</span> {page} of {totalPages}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setPage(page < totalPages ? page + 1 : page)} 
                  disabled={isFetching || page >= totalPages}
                  className="px-1 min-[500px]:px-3"
                >
                  <span className="hidden min-[500px]:inline">Next</span> <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="relative m-6 flex flex-1 items-center justify-center rounded-lg border border-dashed py-20 shadow-sm">
            {isFetching && <LoaderComponent/>}
            <div className="flex flex-col items-center text-center">
              <h3 className="text-2xl font-bold tracking-tight">No Certificate Requests</h3>
              <p className="mb-3 text-sm text-muted-foreground">
                Certificate requests will be shown here when they are submitted.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function LoaderComponent() {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 pt-10">
      <Loader2 className="h-8 w-8 animate-spin text-green-primary" />
    </div>
  );
}