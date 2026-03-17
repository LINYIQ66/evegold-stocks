import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, CheckCircle, AlertTriangle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function KYCForm({ user, onSubmit, isLoading }) {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    if (user) {
      setValue("full_name", user.full_name || "");
      setValue("email", user.email || "");
      setValue("date_of_birth", user.date_of_birth || "");
      setValue("nationality", user.nationality || "");
      setValue("contact_number", user.contact_number || "");
      setValue("residential_address", user.residential_address || "");
      setValue("occupation", user.occupation || "");
      setValue("source_of_funds", user.source_of_funds || "");
    }
  }, [user, setValue]);

  const handleFormSubmit = async (data) => {
    setIsSubmitting(true);
    const result = await onSubmit(data);
    setSubmitStatus(result);
    setIsSubmitting(false);
    
    if (result.success) {
      setTimeout(() => setSubmitStatus(null), 3000);
    }
  };

  const sourceOfFunds = watch("source_of_funds");

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-900">
          <User className="w-6 h-6 text-blue-600" />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="full_name">Full Name (as per passport)</Label>
              <Input id="full_name" {...register("full_name", { required: "Full name is required" })} />
              {errors.full_name && <p className="text-red-500 text-sm mt-1">{errors.full_name.message}</p>}
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" {...register("email")} disabled />
            </div>
            <div>
              <Label htmlFor="date_of_birth">Date of Birth</Label>
              <Input id="date_of_birth" type="date" {...register("date_of_birth", { required: "Date of birth is required" })} />
              {errors.date_of_birth && <p className="text-red-500 text-sm mt-1">{errors.date_of_birth.message}</p>}
            </div>
            <div>
              <Label htmlFor="nationality">Nationality</Label>
              <Input id="nationality" {...register("nationality", { required: "Nationality is required" })} />
              {errors.nationality && <p className="text-red-500 text-sm mt-1">{errors.nationality.message}</p>}
            </div>
            <div>
              <Label htmlFor="contact_number">Contact Number</Label>
              <Input id="contact_number" {...register("contact_number", { required: "Contact number is required" })} />
              {errors.contact_number && <p className="text-red-500 text-sm mt-1">{errors.contact_number.message}</p>}
            </div>
            <div>
              <Label htmlFor="occupation">Occupation</Label>
              <Input id="occupation" {...register("occupation", { required: "Occupation is required" })} />
              {errors.occupation && <p className="text-red-500 text-sm mt-1">{errors.occupation.message}</p>}
            </div>
          </div>
          <div>
            <Label htmlFor="residential_address">Residential Address</Label>
            <Input id="residential_address" {...register("residential_address", { required: "Address is required" })} />
            {errors.residential_address && <p className="text-red-500 text-sm mt-1">{errors.residential_address.message}</p>}
          </div>
          <div>
            <Label htmlFor="source_of_funds">Source of Funds</Label>
            <Select onValueChange={(value) => setValue("source_of_funds", value, { shouldValidate: true })} value={sourceOfFunds}>
                <SelectTrigger id="source_of_funds">
                    <SelectValue placeholder="Select your primary source of funds" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Salary">Salary</SelectItem>
                    <SelectItem value="Inheritance">Inheritance</SelectItem>
                    <SelectItem value="Investment Income">Investment Income</SelectItem>
                    <SelectItem value="Business Profit">Business Profit</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
            </Select>
            <input type="hidden" {...register("source_of_funds", { required: "Source of funds is required" })} />
            {errors.source_of_funds && <p className="text-red-500 text-sm mt-1">{errors.source_of_funds.message}</p>}
          </div>
          
          <AnimatePresence>
            {submitStatus && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`flex items-center gap-2 text-sm p-3 rounded-lg ${
                  submitStatus.success 
                    ? 'text-green-600 bg-green-50' 
                    : 'text-red-600 bg-red-50'
                }`}
              >
                {submitStatus.success ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Information saved successfully!
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4" />
                    Submission failed: {submitStatus.error}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="flex justify-end pt-4 border-t border-slate-200">
            <Button type="submit" disabled={isSubmitting || isLoading} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Saving...
                </div>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Save Information
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}