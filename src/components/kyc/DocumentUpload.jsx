import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function DocumentUpload({ user, onUpload, isLoading }) {
  const [uploadingDoc, setUploadingDoc] = useState(null);
  const [dragActive, setDragActive] = useState({});

  const documents = [
    { key: "passport", title: "Passport", description: "Clear photo of your passport's main page" },
    { key: "ic", title: "Identity Card", description: "Front and back of your national ID card" },
    { key: "drivers_license", title: "Driver's License", description: "Front and back (optional)" },
    { key: "proof_of_address", title: "Proof of Address", description: "Utility bill or bank statement (last 3 months)" }
  ];

  const handleFileUpload = async (documentType, file) => {
    setUploadingDoc(documentType);
    await onUpload(documentType, file);
    setUploadingDoc(null);
  };

  const handleDrop = (e, docType) => {
    e.preventDefault();
    setDragActive(prev => ({ ...prev, [docType]: false }));
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(docType, e.dataTransfer.files[0]);
    }
  };

  const createInputClickHandler = (doc) => () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = ".jpg,.jpeg,.png,.pdf";
    input.onchange = (e) => {
      if (e.target.files.length > 0) {
        handleFileUpload(doc.key, e.target.files[0]);
      }
    };
    input.click();
  };

  const isDocumentUploaded = (docType) => !!user?.kyc_documents?.[docType];

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-900">
          <Upload className="w-6 h-6 text-blue-600" />
          Document Upload
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {documents.map((doc, index) => (
            <motion.div
              key={doc.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card 
                className={`border-2 border-dashed transition-all duration-300 ${
                  dragActive[doc.key] ? "border-blue-400 bg-blue-50" :
                  isDocumentUploaded(doc.key) ? "border-green-400 bg-green-50" : "border-gray-300 hover:border-gray-400"
                }`}
                onDragOver={(e) => {e.preventDefault(); setDragActive(prev => ({ ...prev, [doc.key]: true }))}}
                onDragLeave={() => setDragActive(prev => ({ ...prev, [doc.key]: false }))}
                onDrop={(e) => handleDrop(e, doc.key)}
              >
                <CardContent 
                  className="p-6 text-center cursor-pointer"
                  onClick={createInputClickHandler(doc)}
                >
                  <div className="space-y-4">
                    {isDocumentUploaded(doc.key) ? (
                      <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto">
                        <FileText className="w-8 h-8 text-gray-600" />
                      </div>
                    )}
                    
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-2">{doc.title}</h3>
                      <p className="text-sm text-slate-600 mb-4">{doc.description}</p>
                      
                      {uploadingDoc === doc.key ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
                          <span className="text-sm text-blue-600">Uploading...</span>
                        </div>
                      ) : isDocumentUploaded(doc.key) ? (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Uploaded
                        </Badge>
                      ) : (
                        <Button variant="outline" size="sm" className="pointer-events-none">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload File
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="bg-blue-50 p-6 rounded-xl">
          <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            Upload Guidelines
          </h4>
          <ul className="space-y-2 text-sm text-slate-700">
            <li>• Ensure all text is clearly visible and legible</li>
            <li>• Documents should be in color, not black and white</li>
            <li>• Maximum file size: 10MB per document</li>
            <li>• Accepted formats: JPG, PNG, PDF</li>
            <li>• Documents must be valid and not expired</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}