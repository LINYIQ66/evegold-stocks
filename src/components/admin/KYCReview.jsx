import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle, FileText, Eye } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function KYCReview({ users, onUpdateKYC, isLoading }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [riskTag, setRiskTag] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpdate = async (userId, status) => {
    setIsProcessing(true);
    const riskTags = selectedUser.risk_tags || [];
    if (riskTag && !riskTags.includes(riskTag)) {
        riskTags.push(riskTag);
    }
    
    await onUpdateKYC(userId, status, reviewNotes, riskTags);
    
    setSelectedUser(null);
    setReviewNotes("");
    setRiskTag("");
    setIsProcessing(false);
  };
  
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setReviewNotes("");
    setRiskTag("");
  };

  if (isLoading) {
    return (
      <div className="grid gap-6">
        {Array(3).fill(0).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardContent className="p-6"><div className="h-24 bg-slate-200 rounded"></div></CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-12 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">All KYC Reviews Complete</h3>
          <p className="text-slate-600">No pending KYC applications to review.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* KYC Applications List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Pending Applications ({users.length})</h2>
        {users.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card 
              className={`bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer ${selectedUser?.id === user.id ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => handleSelectUser(user)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-slate-900">{user.full_name}</h3>
                    <p className="text-sm text-slate-600">{user.email}</p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">Pending Review</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-600">Submitted</p>
                    <p className="font-medium">{format(new Date(user.updated_date), 'MMM d, yyyy')}</p>
                  </div>
                  <div>
                    <p className="text-slate-600">Documents</p>
                    <p className="font-medium">{Object.keys(user.kyc_documents || {}).length} uploaded</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Document Review Panel */}
      <div className="sticky top-6">
        {selectedUser ? (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" /> Review: {selectedUser.full_name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 max-h-[80vh] overflow-y-auto">
              <div className="p-4 bg-slate-50 rounded-lg grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <h4 className="font-semibold text-slate-900 col-span-2 mb-2">User Information</h4>
                  <div><span className="text-slate-600">DOB:</span> <span className="font-medium">{selectedUser.date_of_birth}</span></div>
                  <div><span className="text-slate-600">Nationality:</span> <span className="font-medium">{selectedUser.nationality}</span></div>
                  <div><span className="text-slate-600">Contact:</span> <span className="font-medium">{selectedUser.contact_number}</span></div>
                  <div><span className="text-slate-600">Occupation:</span> <span className="font-medium">{selectedUser.occupation}</span></div>
                  <div className="col-span-2"><span className="text-slate-600">Address:</span> <span className="font-medium">{selectedUser.residential_address}</span></div>
                  <div className="col-span-2"><span className="text-slate-600">Source of Funds:</span> <span className="font-medium">{selectedUser.source_of_funds}</span></div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-slate-900">Uploaded Documents</h4>
                {selectedUser.kyc_documents && Object.keys(selectedUser.kyc_documents).length > 0 ? (
                  Object.entries(selectedUser.kyc_documents).map(([docType, url]) => (
                    <div key={docType} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <span className="font-medium capitalize">{docType.replace(/_/g, ' ')}</span>
                      <Button variant="outline" size="sm" onClick={() => window.open(url, '_blank')} className="gap-2"><Eye className="w-4 h-4" />View</Button>
                    </div>
                  ))
                ) : <p className="text-slate-600 text-sm">No documents uploaded</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Risk Tags</label>
                <div className="flex gap-2 items-center">
                    <Input value={riskTag} onChange={e => setRiskTag(e.target.value)} placeholder="e.g., High Risk, PEP" />
                </div>
                <div className="flex flex-wrap gap-2">
                    {selectedUser.risk_tags?.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Review Notes (visible to user if rejected)</label>
                <Textarea placeholder="Add notes..." value={reviewNotes} onChange={(e) => setReviewNotes(e.target.value)} className="h-24" />
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <Button onClick={() => handleUpdate(selectedUser.id, 'rejected')} disabled={isProcessing} variant="outline" className="flex-1 border-red-300 text-red-600 hover:bg-red-50">
                  {isProcessing ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600" /> : <><XCircle className="w-4 h-4 mr-2" />Reject</>}
                </Button>
                <Button onClick={() => handleUpdate(selectedUser.id, 'approved')} disabled={isProcessing} className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                  {isProcessing ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> : <><CheckCircle className="w-4 h-4 mr-2" />Approve</>}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Select Application</h3>
              <p className="text-slate-600">Choose a pending KYC application to review documents and make a decision.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}