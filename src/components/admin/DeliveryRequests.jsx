import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

export default function DeliveryRequests({ redemptions, onUpdateStatus, isLoading }) {
    const [selectedRedemption, setSelectedRedemption] = useState(null);
    const [trackingNumber, setTrackingNumber] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    const handleOpenModal = (redemption) => {
        setSelectedRedemption(redemption);
        setTrackingNumber(redemption.tracking_number || "");
    };

    const handleCloseModal = () => setSelectedRedemption(null);

    const handleUpdate = async (newStatus) => {
        if (!selectedRedemption) return;
        setIsProcessing(true);
        await onUpdateStatus(selectedRedemption.id, newStatus, trackingNumber);
        setIsProcessing(false);
        handleCloseModal();
    };
    
    const getStatusBadge = (status) => {
        const styles = {
            processing: "bg-yellow-100 text-yellow-800",
            shipped: "bg-blue-100 text-blue-800",
            delivered: "bg-green-100 text-green-800",
            cancelled: "bg-red-100 text-red-800"
        };
        return <Badge className={styles[status]}>{status}</Badge>;
    };

    return (
        <>
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader><CardTitle>Delivery Requests</CardTitle></CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {isLoading ? <p>Loading...</p> : redemptions.filter(r => r.delivery_requested_date).map(r => (
                            <div key={r.id} className="p-4 bg-slate-50 rounded-lg">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold">{r.user_email}</p>
                                        <p>{r.quantity} x {r.product_name}</p>
                                        <p className="text-sm text-slate-600">{r.delivery_address}</p>
                                        {r.delivery_notes && <p className="text-xs italic text-slate-500">Notes: {r.delivery_notes}</p>}
                                    </div>
                                    <div className="text-right">
                                        {getStatusBadge(r.status)}
                                        <p className="text-xs mt-1">Req: {format(new Date(r.delivery_requested_date), 'PP')}</p>
                                        <Button size="sm" variant="outline" className="mt-2" onClick={() => handleOpenModal(r)}>Manage</Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Dialog open={!!selectedRedemption} onOpenChange={handleCloseModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Manage Delivery</DialogTitle>
                        <DialogDescription>Update status and add tracking information.</DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <p><strong>Item:</strong> {selectedRedemption?.quantity} x {selectedRedemption?.product_name}</p>
                        <div>
                            <label>Tracking Number</label>
                            <Input value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} />
                        </div>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => handleUpdate('cancelled')} disabled={isProcessing}>Cancel Order</Button>
                        <Button variant="secondary" onClick={() => handleUpdate('shipped')} disabled={!trackingNumber || isProcessing}>
                            {isProcessing ? <Loader2 className="animate-spin" /> : 'Mark as Shipped'}
                        </Button>
                        <Button onClick={() => handleUpdate('delivered')} disabled={isProcessing}>
                            {isProcessing ? <Loader2 className="animate-spin" /> : 'Mark as Delivered'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}