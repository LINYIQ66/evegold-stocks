import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { CheckCircle, Wallet, ArrowLeftRight, LogOut } from "lucide-react"; // Added LogOut icon
import { motion } from "framer-motion";

export default function Account() { // Renamed from KYCApproved
  // This function would handle the actual logout logic, e.g., clearing tokens,
  // making an API call to invalidate session, and then redirecting the user
  // to a login page or home page. For this example, it's a placeholder.
  const handleLogout = () => {
    console.log("Logout initiated. In a real application, this would clear user session and redirect.");
    // Example: Assuming you have a way to navigate
    // import { useNavigate } from "react-router-dom";
    // const navigate = useNavigate();
    // navigate(createPageUrl("Login")); // Redirect to login page
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg text-center">
        <CardContent className="p-12">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-slate-900 mb-4">You're Verified!</h2>
          <p className="text-xl text-slate-600 mb-8 max-w-lg mx-auto">
            Your account is fully approved. You can now access all features of the EVE FINANCE platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl("Trading")}>
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-8 py-4">
                <ArrowLeftRight className="w-5 h-5 mr-2" />
                Start Trading
              </Button>
            </Link>
            <Link to={createPageUrl("Wallet")}>
              <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                <Wallet className="w-5 h-5 mr-2" />
                Go to Wallet
              </Button>
            </Link>
          </div>
          {/* Logout Button */}
          <div className="mt-8"> {/* Added margin top for separation */}
            <Button
              size="lg"
              variant="destructive" // A 'destructive' variant often suits logout actions
              onClick={handleLogout}
              className="text-lg px-8 py-4"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Log Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}