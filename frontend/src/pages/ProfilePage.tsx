import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router";
import { useAuth } from "../context/AuthProvider";
import { Loader2, User as UserIcon, ShieldCheck, UserCheck, HeartPulse, PlusCircle, Users, FolderHeart } from "lucide-react";

export default function ProfilePage() {
    const navigate = useNavigate();
    
    const { user, accessToken, hasCapability } = useAuth(); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!accessToken || !user) {
            navigate("/login");
            return;
        }
        setLoading(false);
    }, [accessToken, user, navigate]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <Loader2 className="h-8 w-8 text-[#528281] animate-spin" />
            </div>
        );
    }

    const canViewUsersDirectory = hasCapability("VIEW_USERS");
    const canViewAllPetsCatalog = hasCapability("VIEW_PETS");
    const isOwner = user?.role?.toUpperCase() === "OWNER";

    return (
        <div className="min-h-screen bg-slate-50 pt-28 pb-12 px-6">
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center h-fit">
                    <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-500 mb-4 border border-slate-100">
                        {user?.role?.toUpperCase() === "ADMIN" ? (
                            <ShieldCheck className="h-10 w-10 text-red-600" />
                        ) : user?.role?.toUpperCase() === "EMPLOYEE" ? (
                            <UserCheck className="h-10 w-10 text-blue-600" />
                        ) : (
                            <UserIcon className="h-10 w-10 text-[#528281]" />
                        )}
                    </div>
                    
                    <h2 className="text-xl font-bold text-slate-800 mb-1">{user?.username}</h2>
                    
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider ${
                        user?.role?.toUpperCase() === "ADMIN" ? "bg-red-50 text-red-700 border border-red-200" :
                        user?.role?.toUpperCase() === "EMPLOYEE" ? "bg-blue-50 text-blue-700 border border-blue-200" :
                        "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    }`}>
                        {user?.role}
                    </span>
                </div>
                <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-1">Quick Actions</h3>
                        <p className="text-slate-400 text-sm">Access your shortcuts based on your account permissions.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {isOwner && user?.ownerId && (
                            <>
                                <Link to={`/owners/${user.ownerId}/pets`} className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-[#528281]/40 hover:bg-slate-50/50 transition-all group">
                                    <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
                                        <HeartPulse className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-800 text-sm group-hover:text-[#528281] transition-colors">My Pets</h4>
                                        <p className="text-xs text-slate-400">View your registered pets</p>
                                    </div>
                                </Link>
                                <Link to={`/owners/${user.ownerId}/pets/new`} className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-[#528281]/40 hover:bg-slate-50/50 transition-all group">
                                    <div className="p-3 bg-teal-50 rounded-xl text-[#528281]">
                                        <PlusCircle className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-800 text-sm group-hover:text-[#528281] transition-colors">Register Pet</h4>
                                        <p className="text-xs text-slate-400">Add a new pet to your account</p>
                                    </div>
                                </Link>
                            </>
                        )}

                        {canViewUsersDirectory && (
                            <Link to="/users" className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-[#528281]/40 hover:bg-slate-50/50 transition-all group">
                                <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                                    <Users className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-800 text-sm group-hover:text-[#528281] transition-colors">Users Directory</h4>
                                    <p className="text-xs text-slate-400">Quick search by filtering</p>
                                </div>
                            </Link>
                        )}

                        {canViewAllPetsCatalog && (
                            <Link to="/pets" className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-[#528281]/40 hover:bg-slate-50/50 transition-all group">
                                <div className="p-3 bg-rose-50 rounded-xl text-rose-600">
                                    <FolderHeart className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-800 text-sm group-hover:text-[#528281] transition-colors">All Pets</h4>
                                    <p className="text-xs text-slate-400">Global pet catalog</p>
                                </div>
                            </Link>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
