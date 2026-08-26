import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

const UnauthorizedPage = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-12.5 p-8 text-center space-y-6 max-w-md mx-auto mt-20 bg-white border rounded-lg shadow-sm">
            <div className="p-4 bg-red-50 rounded-full border border-red-100 text-destructive">
                <ShieldAlert className="w-12 h-12" />
            </div>
            
            <div className="space-y-2">
                <h1 className="text-2xl font-bold text-slate-900">Access Denied</h1>
                <p className="text-sm text-slate-500">
                    Your account does not have permission to view this page.
                </p>
            </div>

            <Button 
                onClick={() => navigate("/profile")} 
                className="w-full"
                variant="default"
            >
                Back to Profile
            </Button>
        </div>
    );
};

export default UnauthorizedPage;
