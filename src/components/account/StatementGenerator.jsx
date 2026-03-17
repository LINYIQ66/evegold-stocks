import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, FileText } from "lucide-react";
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom";

export default function StatementGenerator({ user }) {
    return (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Daily Statements
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <p className="text-slate-600">
                    View your daily transaction statements with detailed breakdowns by business category. 
                    Statements are generated daily using Singapore Time (00:00-24:00) and available from 10:00 SGT the next day.
                </p>
                
                <div className="p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
                    <h4 className="font-semibold text-slate-900 mb-2">Statement Features:</h4>
                    <ul className="space-y-1 text-sm text-slate-600">
                        <li>• Categorized by transaction type (Trading, Lending, Staking, etc.)</li>
                        <li>• Real-time data from your transaction logs</li>
                        <li>• Mobile-responsive design with export options</li>
                        <li>• Singapore Time zone for accurate daily cut-offs</li>
                    </ul>
                </div>
                
                <Link to={createPageUrl("DailyStatement")}>
                    <Button className="w-full gap-2 bg-blue-600 hover:bg-blue-700">
                        <Eye className="w-4 h-4" />
                        View Daily Statements
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
}