"use client";
import { useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter, 
} from "@/components/ui/card";
import { CertificateRequest, Payment, Resident } from "@prisma/client";
import RequestCertificateButton from "./RequestCertificateButton";
import PaymentButton from "./PaymentButton";
import { FileText } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  getCertificateStatusBadge,
  getCertificateStatusIcon,
  getPaymentStatusBadge, 
} from "@/components/utils";
import { formatDate } from "@/lib/utils";
import { useQueryState } from "nuqs";

type CertificateWithPayment = CertificateRequest & {
  payments: Payment[];
};

type ResidentWithCertificates = Resident & {
  certificateRequests: CertificateWithPayment[];
};

type CertificatesClientProps = {
  residents: ResidentWithCertificates[],
};

export default function CertificatesClient({ residents }: CertificatesClientProps) {
  const [activeTab, setActiveTab] = useQueryState("residentId", {
    defaultValue: residents[0]?.bahayToroSystemId || "",
  });

  // Count total certificates for this user (across all residents)
  const totalCertificates = residents.reduce((sum, resident) => {
    return sum + resident.certificateRequests.length;
  }, 0);

  // Get count of certificates in each status
  const statusCounts = residents.reduce((counts, resident) => {
    resident.certificateRequests.forEach(cert => {
      counts[cert.status] = (counts[cert.status] || 0) + 1;
    });
    return counts;
  }, {} as Record<string, number>);

  return (
    <Card className="shadow-md">
      <CardHeader className="px-7 flex flex-row items-center justify-between border-b pb-4">
        <div>
          <CardTitle className="text-2xl font-bold text-green-primary">My Certificates</CardTitle>
          <CardDescription>Manage your certificate requests</CardDescription>
        </div>
        <RequestCertificateButton residents={residents} />
      </CardHeader>
      
      {residents.length > 0 && (
        <>
          {residents.length > 1 ? (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="px-6 pt-2">
                <TabsList className="w-full justify-start bg-muted/30">
                  {residents.map(resident => (
                    <TabsTrigger 
                      key={resident.bahayToroSystemId} 
                      value={resident.bahayToroSystemId}
                      className="text-sm data-[state=active]:bg-background"
                    >
                      {resident.firstName} {resident.lastName}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              
              {residents.map(resident => (
                <TabsContent key={resident.bahayToroSystemId} value={resident.bahayToroSystemId} className="px-0 py-0 mt-0">
                  <CertificateList resident={resident} />
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <CertificateList resident={residents[0]} />
          )}
        </>
      )}
      
      <CardFooter className="border-t p-4 flex justify-between text-sm text-muted-foreground">
        <div>Total certificates: {totalCertificates}</div>
        <div className="flex gap-2">
          {Object.entries(statusCounts).map(([status, count]) => (
            <TooltipProvider key={status}>
              <Tooltip>
                <TooltipTrigger>
                  <span className="flex items-center gap-1">
                    {getCertificateStatusIcon(status)}
                    <span className="font-medium">{count}</span>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{status.replace(/_/g, " ")}: {count}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}

function CertificateList({ resident }: { resident: ResidentWithCertificates }) {
  const hasCertificates = resident.certificateRequests.length > 0;

  // Helper function to check if a certificate has been paid
  const isCertificatePaid = (certificate: CertificateWithPayment): boolean => {
    // Certificate is considered paid if status is beyond AWAITING_PAYMENT
    if (certificate.status !== "AWAITING_PAYMENT" && certificate.status !== "PENDING" && 
        certificate.status !== "UNDER_REVIEW" && certificate.status !== "REJECTED" && 
        certificate.status !== "CANCELLED") {
      return true;
    }
    
    // Or if there's an active payment with SUCCEEDED or VERIFIED status
    if (certificate.payments.length > 0) {
      const latestPayment = certificate.payments[0]; // We're getting the most recent active payment
      return latestPayment.paymentStatus === "SUCCEEDED" || latestPayment.paymentStatus === "VERIFIED";
    }
    
    return false;
  };

  return (
    <CardContent className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">
            {resident.firstName} {resident.lastName}
          </h3>
          <p className="text-sm text-muted-foreground">ID: {resident.bahayToroSystemId}</p>
        </div>
      </div>

      {hasCertificates ? (
        <ScrollArea className="max-h-[500px] pr-4">
          <Accordion type="single" collapsible className="w-full">
            {resident.certificateRequests.map((certificate) => (
              <AccordionItem key={certificate.id} value={certificate.id.toString()} className="border border-muted rounded-lg mb-3 overflow-hidden">
                <AccordionTrigger className="px-4 py-3 hover:no-underline [&>svg]:text-muted-foreground [&>svg]:h-5 [&>svg]:w-5 [&>svg]:shrink-0">
                  <div className="flex flex-1 items-center justify-between">
                    <div className='flex flex-col items-start text-start'>
                      <h4 className="font-medium">{certificate.certificateType.replace(/_/g, " ")}</h4>
                      <p className="text-sm text-muted-foreground">Ref: {certificate.referenceNumber}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getCertificateStatusBadge(certificate.status)}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 pt-1">
                  <div className="grid gap-2 text-sm">
                    <div className="grid grid-cols-2 gap-1">
                      <div className="text-muted-foreground">Purpose:</div>
                      <div>{certificate.purpose}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      <div className="text-muted-foreground">Requested:</div>
                      <div>{formatDate(certificate.requestDate)}</div>
                    </div>
                    {certificate.payments.length > 0 && (
                      <div className="grid grid-cols-2 gap-1">
                        <div className="text-muted-foreground">Payment Status:</div>
                        <div className="flex items-center">
                          {getPaymentStatusBadge(certificate.payments[0].paymentStatus)}
                        </div>
                      </div>
                    )}
                    {certificate.remarks && (
                      <div className="grid grid-cols-2 gap-1">
                        <div className="text-muted-foreground">Remarks:</div>
                        <div>{certificate.remarks}</div>
                      </div>
                    )}
                    {certificate.status === "AWAITING_PAYMENT" && !isCertificatePaid(certificate) && (
                      <div className="mt-2">
                        <PaymentButton certificateId={certificate.id} />
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollArea>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-10 border border-dashed rounded-lg">
          <FileText className="h-12 w-12 text-muted-foreground mb-3" />
          <h3 className="text-lg font-medium">No certificates yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Request your first certificate to see it here
          </p>
        </div>
      )}
    </CardContent>
  );
}
