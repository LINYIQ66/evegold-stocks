import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';

export default function SupportTicketReview({ tickets, onUpdate, isLoading }) {
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [response, setResponse] = useState("");
    const [status, setStatus] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    const handleOpenModal = (ticket) => {
        setSelectedTicket(ticket);
        setResponse(ticket.admin_response || "");
        setStatus(ticket.status);
        setIsModalOpen(true);
    };
    
    const handleCloseModal = () => {
        setSelectedTicket(null);
        setIsModalOpen(false);
    };

    const handleSubmit = async () => {
        if (!selectedTicket) return;
        setIsProcessing(true);
        await onUpdate(selectedTicket.id, status, response);
        setIsProcessing(false);
        handleCloseModal();
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
        <>
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                    <CardTitle>Support Tickets ({tickets.filter(t => t.status === 'Open').length} Open)</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Subject</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? <TableRow><TableCell colSpan={6}>Loading...</TableCell></TableRow> :
                                tickets.map(ticket => (
                                    <TableRow key={ticket.id}>
                                        <TableCell>{ticket.user_email}</TableCell>
                                        <TableCell>{ticket.subject}</TableCell>
                                        <TableCell>{ticket.category}</TableCell>
                                        <TableCell>{format(new Date(ticket.created_date), 'PP')}</TableCell>
                                        <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                                        <TableCell>
                                            <Button variant="outline" size="sm" onClick={() => handleOpenModal(ticket)}>
                                                View & Respond
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Review Ticket: {selectedTicket?.subject}</DialogTitle>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="p-4 bg-slate-50 rounded-lg">
                           <p className="font-semibold text-sm mb-1">User Message:</p>
                           <p className="text-slate-700 whitespace-pre-wrap">{selectedTicket?.message}</p>
                        </div>
                        <div>
                            <label className="font-medium">Admin Response</label>
                            <Textarea value={response} onChange={e => setResponse(e.target.value)} rows={5} />
                        </div>
                        <div>
                            <label className="font-medium">Status</label>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger><SelectValue/></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Open">Open</SelectItem>
                                    <SelectItem value="In Progress">In Progress</SelectItem>
                                    <SelectItem value="Resolved">Resolved</SelectItem>
                                    <SelectItem value="Closed">Closed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={handleCloseModal}>Cancel</Button>
                        <Button onClick={handleSubmit} disabled={isProcessing}>
                            {isProcessing && <Loader2 className="w-4 h-4 mr-2 animate-spin"/>}
                            Update Ticket
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}