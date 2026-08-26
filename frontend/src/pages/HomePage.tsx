import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button.tsx";
import { ShieldCheck, HeartPulse } from "lucide-react";

export default function HomePage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-[85vh] flex flex-col justify-center items-center p-6 bg-slate-50/50">
            <div className="text-center mb-16 max-w-2xl">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight sm:text-5xl mb-4 bg-linear-to-r from-slate-900 via-slate-800 to-indigo-950 bg-clip-text">
                    Welcome to MyVet App
                </h1>
                <p className="text-base text-slate-500 max-w-lg mx-auto leading-relaxed">
                    Please select your dedicated portal below.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full px-4">
                
                <div className="group bg-white p-8 border border-slate-200/80 rounded-2xl shadow-sm flex flex-col justify-between hover:border-indigo-200 hover:shadow-md transition-all duration-300 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-colors" />
                    
                    <div className="space-y-4 mb-8 relative z-10">
                        <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 shadow-sm group-hover:scale-105 transition-transform duration-300">
                            <HeartPulse className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Pet Owners</h2>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            Access your personal dashboard to monitor your pets profiles, or register your new pet!.
                        </p>
                    </div>
                    <div className="space-y-3 relative z-10">
                        <Button 
                            onClick={() => navigate("/register")} 
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 font-medium rounded-xl shadow-sm shadow-indigo-200 transition-all"
                        >
                            Register as pet owner.
                        </Button>
                    </div>
                </div>

                <div className="group bg-white p-8 border border-slate-200/80 rounded-2xl shadow-sm flex flex-col justify-between hover:border-slate-400 hover:shadow-md transition-all duration-300 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-slate-900/5 rounded-full blur-2xl group-hover:bg-slate-900/10 transition-colors" />
                    
                    <div className="space-y-4 mb-8 relative z-10">
                        <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-slate-800 shadow-sm group-hover:scale-105 transition-transform duration-300">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Clinic Staff</h2>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            Access for administrators and employees. Oversee client directories, and monitor clinic workflow.
                        </p>
                    </div>
                    <div className="space-y-3 relative z-10">
                        <Button 
                            onClick={() => navigate("/register-staff")} 
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 font-medium rounded-xl shadow-sm transition-all"
                        >
                            Register as staff member.
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    );
}
