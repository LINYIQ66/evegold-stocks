import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Send, Loader2 } from "lucide-react";
import { format } from "date-fns";

export default function SupportTickets({ tickets, onSubmit, isLoading }) {
    const { register, handleSubmit, control, reset, formState: { errors } } = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFormSubmit = async (data) => {
        setIsSubmitting(true);
        await onSubmit(data);
        setIsSubmitting(false);
        reset();
    };
    
    const getStatusBadge = (status) => {
        const styles = {
            "Open": "bg-blue-100 text-blue-800",
            "In Progress": "bg-yellow-100 text-yellow-800",
            "Resolved": "bg-green-100 text-green-800",
            "Closed": "bg-gray-100 text-gray-800",
        };
        return <Badge className={styles[status]}>{status}</Badge>;
    };

    return (
        <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader><CardTitle>Submit a New Ticket</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                            <div>
                                <Label htmlFor="subject">Subject</Label>
                                <Input id="subject" {...register("subject", { required: "Subject is required" })} />
                                {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>}
                            </div>
                            <div>
                                <Label htmlFor="category">Category</Label>
                                <Controller
                                    name="category"
                                    control={control}
                                    rules={{ required: "Please select a category" }}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger><SelectValue placeholder="Select a category..." /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                                                <SelectItem value="Technical Issue">Technical Issue</SelectItem>
                                                <SelectItem value="Billing">Billing Question</SelectItem>
                                                <SelectItem value="Feature Request">Feature Request</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
                            </div>
                            <div>
                                <Label htmlFor="message">Message</Label>
                                <Textarea id="message" {...register("message", { required: "Message cannot be empty" })} rows={5} />
                                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
                            </div>
                            <Button type="submit" disabled={isSubmitting} className="w-full">
                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                                Submit Ticket
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
            <div className="md:col-span-2">
                 <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader><CardTitle>My Tickets ({tickets.length})</CardTitle></CardHeader>
                    <CardContent>
                       {isLoading ? <p>Loading tickets...</p> : tickets.length === 0 ? (
                           <p className="text-slate-500 text-center py-8">You have no support tickets.</p>
                       ) : (
                           <Accordion type="single" collapsible className="w-full">
                               {tickets.map(ticket => (
                                   <AccordionItem key={ticket.id} value={ticket.id}>
                                       <AccordionTrigger>
                                           <div className="flex justify-between items-center w-full pr-4">
                                               <span className="font-semibold">{ticket.subject}</span>
                                               {getStatusBadge(ticket.status)}
                                           </div>
                                       </AccordionTrigger>
                                       <AccordionContent className="space-y-4">
                                            <p className="text-sm text-slate-500">
                                                Category: {ticket.category} | Submitted: {format(new Date(ticket.created_date), 'PPp')}
                                            </p>
                                            <div className="p-4 bg-slate-50 rounded-lg">
                                               <p className="font-semibold text-sm mb-1">Your Message:</p>
                                               <p className="text-slate-700 whitespace-pre-wrap">{ticket.message}</p>
                                            </div>
                                            {ticket.admin_response && (
                                                <div className="p-4 bg-blue-50 rounded-lg">
                                                   <p className="font-semibold text-sm mb-1 text-blue-800">Admin Response:</p>
                                                   <p className="text-blue-900 whitespace-pre-wrap">{ticket.admin_response}</p>
                                                </div>
                                            )}
                                       </AccordionContent>
                                   </AccordionItem>
                               ))}
                           </Accordion>
                       )}
                    </CardContent>
                 </Card>
            </div>
        </div>
    );
}