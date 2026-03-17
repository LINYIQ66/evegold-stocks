import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Truck, Loader2 } from "lucide-react";
import { format } from "date-fns";

export default function MyPhysicalInventory({ redemptions, onDeliveryRequest, isLoading }) {
    const [selectedRedemption, setSelectedRedemption] = useState(null);
    const [address, setAddress] = useState("");
    const [notes, setNotes] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    const handleOpenModal = (redemption) => {
        setSelectedRedemption(redemption);
        setAddress(redemption.delivery_address || "");
        setNotes("");
    };

    const handleCloseModal = () => {
        setSelectedRedemption(null);
    };

    const handleSubmit = async () => {
        if (!selectedRedemption) return;
        setIsProcessing(true);
        await onDeliveryRequest(selectedRedemption.id, address, notes);
        setIsProcessing(false);
        handleCloseModal();
    };
    
    const unrequestedRedemptions = redemptions.filter(r => r.status === 'processing' && !r.delivery_requested_date);
    const requestedRedemptions = redemptions.filter(r => r.delivery_requested_date);

    return (
        <>
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                    <CardTitle>My Physical Assets</CardTitle>
                    <p className="text-slate-600">Manage your redeemed items and request delivery.</p>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-semibold text-lg mb-2">Ready for Delivery ({unrequestedRedemptions.length})</h3>
                            {isLoading ? <p>Loading...</p> : unrequestedRedemptions.length > 0 ? (
                                <div className="space-y-3">
                                    {unrequestedRedemptions.map(r => (
                                        <div key={r.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                            <div>
                                                <p className="font-bold">{r.quantity} x {r.product_name}</p>
                                                <p className="text-xs text-slate-500">Redeemed on {format(new Date(r.created_date), 'PP')}</p>
                                            </div>
                                            <Button size="sm" onClick={() => handleOpenModal(r)}>Request Delivery</Button>
                                        </div>
                                    ))}
                                </div>
                            ) : <p className="text-sm text-slate-500">You have no items pending a delivery request.</p>}
                        </div>

                         <div>
                            <h3 className="font-semibold text-lg mb-2">Delivery History ({requestedRedemptions.length})</h3>
                            {isLoading ? <p>Loading...</p> : requestedRedemptions.length > 0 ? (
                                <div className="space-y-3">
                                    {requestedRedemptions.map(r => (
                                        <div key={r.id} className="p-3 bg-slate-100 rounded-lg">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="font-bold">{r.quantity} x {r.product_name}</p>
                                                    <p className="text-xs text-slate-500">Requested on {format(new Date(r.delivery_requested_date), 'PP')}</p>
                                                </div>
                                                <Badge className={r.status === 'shipped' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}>{r.status}</Badge>
                                            </div>
                                            {r.tracking_number && <p className="text-xs mt-1">Tracking: {r.tracking_number}</p>}
                                        </div>
                                    ))}
                                </div>
                            ) : <p className="text-sm text-slate-500">No delivery history found.</p>}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={!!selectedRedemption} onOpenChange={handleCloseModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Request Delivery</DialogTitle>
                        <DialogDescription>Confirm your delivery address and add any special instructions.</DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <p><strong>Item:</strong> {selectedRedemption?.quantity} x {selectedRedemption?.product_name}</p>
                        <div>
                            <Label htmlFor="address">Delivery Address</Label>
                            <Textarea id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
                        </div>
                        <div>
                            <Label htmlFor="notes">Delivery Notes (Optional)</Label>
                            <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g., Leave with concierge" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={handleCloseModal} disabled={isProcessing}>Cancel</Button>
                        <Button onClick={handleSubmit} disabled={isProcessing}>
                            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Truck className="mr-2 h-4 w-4" />}
                            Confirm Delivery Request
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}