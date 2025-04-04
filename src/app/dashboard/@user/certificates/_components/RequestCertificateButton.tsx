"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { createCertificate } from "@/app/dashboard/@user/certificates/actions";
import { CertificateType, Resident } from "@prisma/client";
import { getCertificateTypeLabel } from "@/lib/utils/certificate";
import { useRouter } from "next/navigation";
import { CertificateInput, certificateSchema } from "@/types/types";
import { CertificateFormFields } from "@/components/form/certificate/CertificateFormFields";
import { toast } from "@/components/ui/use-toast";

type RequestCertificateButtonProps = {
  residents: Resident[]
};

export default function RequestCertificateButton({ residents }: RequestCertificateButtonProps) {
  const router = useRouter();
  const formId = "certificate-request-form";
  const [open, setOpen] = useState(false);
  const [selectedResident, setSelectedResident] = useState("");
  const [residentError, setResidentError] = useState(false);
  
  const form = useForm<CertificateInput>({
    resolver: zodResolver(certificateSchema),
    defaultValues: {
      purpose: "",
    },
  });

  const certificateType = form.watch("certificateType");

  // Handle click on the Request Certificate button based on residents availability
  const handleRequestClick = (e: React.MouseEvent) => {
    if (residents.length === 0) {
      e.preventDefault();
      router.push("/pages/services");
    }
  };

  const onSubmit = async (values: CertificateInput) => {
    if (!selectedResident) {
      setResidentError(true);
      return;
    }

    try {
      await createCertificate(values, parseInt(selectedResident));
      toast({
        title: "Certificate requested successfully",
        description: "Your certificate request has been submitted.",
      });
      
      // Reset form and close dialog
      form.reset();
      setSelectedResident("");
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error submitting request",
        description: "There was an error processing your request. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={handleRequestClick}>Request Certificate</Button>
      </DialogTrigger>
      {residents.length > 0 ? (
        <DialogContent className="max-h-[80vh] flex flex-col p-0">
          <div className="px-6 pt-6">
            <DialogHeader>
              <DialogTitle>Request New Certificate</DialogTitle>
              <DialogDescription>
                Fill out the form below to request a new certificate.
              </DialogDescription>
            </DialogHeader>
          </div>
          
          <div className="overflow-y-auto px-6 flex-1">
            <Form {...form}>
              <form id={formId} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="resident" className="text-right">Resident <span className="text-red-600 font-bold">*</span></Label>
                  <div className="col-span-3">
                    <Select 
                      onValueChange={(value) => {
                        setSelectedResident(value);
                        setResidentError(false);
                      }}
                      value={selectedResident}
                    >
                      <SelectTrigger className={residentError ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select resident" />
                      </SelectTrigger>
                      <SelectContent>
                        {residents.map((resident: Resident) => (
                          <SelectItem key={resident.id} value={resident.id.toString()}>
                            {resident.firstName} {resident.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {residentError && (
                      <p className="text-sm font-medium text-red-500 mt-1">
                        Please select a resident
                      </p>
                    )}
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="certificateType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Certificate Type <span className="text-red-600 font-bold">*</span></FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select certificate type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(CertificateType).map(([key, value]) => (
                            <SelectItem key={key} value={value}>
                              {getCertificateTypeLabel(value)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="purpose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Purpose <span className="text-red-600 font-bold">*</span></FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <CertificateFormFields 
                  certificateType={certificateType}
                  form={form}
                />
                
                {["SOLO_PARENT", "COHABITATION", "GOOD_MORAL", "NO_INCOME", "RESIDENCY", "TRANSFER_OF_RESIDENCY", "LIVING_STILL", "BIRTH_FACT"].includes(certificateType) && (
                  <FormField
                    control={form.control}
                    name="requestOf"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Request of <span className="text-red-600 font-bold">*</span></FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </form>
            </Form>
          </div>
          
          <div className="border-t px-6 py-4 mt-auto">
            <Button 
              type="submit"
              form={formId}
              className="w-full"
            >
              Submit Request
            </Button>
          </div>
        </DialogContent>
      ) : null}
    </Dialog>
  );
}