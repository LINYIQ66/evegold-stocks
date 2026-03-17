import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon, Eye, Users } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { createPageUrl } from "@/utils";

export default function StatementGenerator({ users }) {
    const [selectedUserEmail, setSelectedUserEmail] = useState("");
    const [date, setDate] = useState({ from: addDays(new Date(), -30), to: new Date() });

    const handleViewStatement = () => {
        if (!selectedUserEmail || !date?.from || !date?.to) return;
        
        const url = createPageUrl(
            `Statement?user_email=${selectedUserEmail}&start_date=${format(date.from, 'yyyy-MM-dd')}&end_date=${format(date.to, 'yyyy-MM-dd')}`
        );
        window.open(url, '_blank');
    };

    return (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5 text-blue-600"/>View User Statements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4 p-4 border rounded-lg">
                    <Select value={selectedUserEmail} onValueChange={setSelectedUserEmail}>
                        <SelectTrigger><SelectValue placeholder="Select a user..." /></SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Users</SelectLabel>
                                {users.map(user => (
                                    <SelectItem key={user.id} value={user.email}>{user.full_name} ({user.email})</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant={"outline"} className="w-full justify-start text-left font-normal">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date?.from ? (date.to ? `${format(date.from, "LLL dd, y")} - ${format(date.to, "LLL dd, y")}` : format(date.from, "LLL dd, y")) : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar initialFocus mode="range" defaultMonth={date?.from} selected={date} onSelect={setDate} numberOfMonths={2} />
                        </PopoverContent>
                    </Popover>
                    
                    <Button onClick={handleViewStatement} disabled={!selectedUserEmail || !date?.from || !date?.to}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Statement
                    </Button>
                </div>
                <div className="text-center text-slate-500 pt-4">
                    <p>Select a user and a date range to view their statement in a new browser tab.</p>
                    <p className="text-sm">The web statement can be printed or saved as a PDF using the browser's print function.</p>
                </div>
            </CardContent>
        </Card>
    );
}