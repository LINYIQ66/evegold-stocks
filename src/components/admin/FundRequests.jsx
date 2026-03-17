
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { CheckCircle, XCircle, Search, ExternalLink, Loader2 } from "lucide-react";

export default function FundRequests({ requests, onUpdateRequest, isLoading }) {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [isSubmitting, setIsSubmitting] = useState(false); // BUG FIX 1: Add submitting state

  const handleReview = (request) => {
    setSelectedRequest(request);
    setNotes(request.admin_notes || "");
    setIsModalOpen(true);
  };

  const handleSubmit = async (status) => {
    setIsSubmitting(true); // BUG FIX 1: Set submitting true
    try {
      await onUpdateRequest(selectedRequest.id, status, notes);
      setIsModalOpen(false);
      setSelectedRequest(null);
      setNotes("");
    } catch (error) {
      console.error("Failed to update request:", error);
      // Optionally show an error message to the user
    } finally {
      setIsSubmitting(false); // BUG FIX 1: Set submitting false
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    return <Badge className={styles[status]}>{status}</Badge>;
  };

  const filteredRequests = requests.filter(r => 
    (statusFilter === 'all' || r.status === statusFilter) &&
    (r.user_email.toLowerCase().includes(searchTerm.toLowerCase()) || r.id.includes(searchTerm))
  );

  return (
    <>
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Fund Requests Management</CardTitle>
          <div className="flex flex-col md:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input 
                placeholder="Search by user email or request ID..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Asset</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={8} className="text-center">Loading requests...</TableCell></TableRow>
              ) : filteredRequests.length === 0 ? (
                <TableRow><TableCell colSpan={8} className="text-center">No requests found.</TableCell></TableRow>
              ) : (
                filteredRequests.map(request => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.user_email}</TableCell>
                    <TableCell className="capitalize">{request.request_type}</TableCell>
                    <TableCell>{request.asset}</TableCell>
                    <TableCell>${request.amount.toFixed(2)}</TableCell>
                    <TableCell>{request.method}</TableCell>
                    <TableCell>{format(new Date(request.created_date), 'PPp')}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => handleReview(request)}>Review</Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {selectedRequest && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Review Fund Request</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="font-semibold">User:</p><p>{selectedRequest.user_email}</p></div>
                <div><p className="font-semibold">Request ID:</p><p className="text-sm">{selectedRequest.id}</p></div>
                <div><p className="font-semibold">Type:</p><p className="capitalize">{selectedRequest.request_type}</p></div>
                <div><p className="font-semibold">Status:</p>{getStatusBadge(selectedRequest.status)}</div>
                <div><p className="font-semibold">Asset:</p><p>{selectedRequest.asset}</p></div>
                <div><p className="font-semibold">Amount:</p><p>${selectedRequest.amount.toFixed(2)}</p></div>
                <div><p className="font-semibold">Method:</p><p>{selectedRequest.method}</p></div>
                {selectedRequest.proof_of_payment_url && (
                    <div>
                        <p className="font-semibold">Proof of Payment:</p>
                        <a href={selectedRequest.proof_of_payment_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                            View Proof <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>
                )}
              </div>
              <div>
                <p className="font-semibold mb-2">Admin Notes:</p>
                <Textarea 
                  placeholder="Add review notes here..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  disabled={isSubmitting} // Disable textarea during submission
                />
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <Button variant="outline" className="gap-2 text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => handleSubmit('rejected')} disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />} Reject
                </Button>
                <Button className="gap-2 bg-green-600 hover:bg-green-700" onClick={() => handleSubmit('approved')} disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />} Approve
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
