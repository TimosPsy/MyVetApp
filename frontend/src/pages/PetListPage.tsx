import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
import { toast } from "sonner";
import { ArrowLeft, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { PaginationControls } from "@/components/PaginationControlls";
import { useAuth } from "@/context/AuthProvider";
import { getPetsByOwnerId } from "@/api/owners";
import { deletePet, getPets } from "@/api/pets";
import type { Pet } from "@/schemas/pets";
import { PetsTable } from "@/components/PetsTable";

export const PetListPage = () => {
    const { ownerId } = useParams<{ ownerId?: string }>();
    const oId = Number(ownerId);
    const isFilteredByOwner = !!ownerId;

    const navigate = useNavigate();
    const { accessToken, user, hasCapability } = useAuth();

    const [pets, setPets] = useState<Pet[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const pageSize = 5;

    const savedName = sessionStorage.getItem(`owner_name_${ownerId}`);
    const ownerFullName = savedName || `Owner #${ownerId}`;
    const canInsert = hasCapability("INSERT_PET");
    const canEdit = hasCapability("EDIT_PET");
    const canDelete = hasCapability("DELETE_PET");
    const isStaff = hasCapability("VIEW_PETS");

    useEffect(() => {
        if (!accessToken) return;

        if (isFilteredByOwner && hasCapability("VIEW_ONLY_OWN_PETS") && !isStaff) {
            if (Number(user?.ownerId) !== oId) {
                navigate("/unauthorized", { replace: true });
                return;
            }
        }

        setLoading(true);
        if (isFilteredByOwner) {
            getPetsByOwnerId(oId, accessToken)
                .then((res) => { setPets(res); setTotalPages(1); })
                .catch(() => toast.error("Error fetching owner's pets"))
                .finally(() => setLoading(false));
        } else {
            getPets(accessToken, currentPage, pageSize, {})
                .then((res) => {
                    if (res && res.data) { setPets(res.data); setTotalPages(res.totalPages || 1); }
                    else { setPets([]); setTotalPages(1); }
                })
                .catch(() => toast.error("Error fetching all pets"))
                .finally(() => setLoading(false));
        }
    }, [ownerId, accessToken, currentPage, user?.ownerId]);

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this pet?")) return;
        if (!accessToken) return;
        try {
            await deletePet(id, accessToken);
            setPets((prev) => prev.filter((p) => p.id !== id));
            toast.success("Pet deleted successfully!");
            if (pets.length === 1 && currentPage > 1) setCurrentPage((prev) => prev - 1);
        } catch { toast.error("Error deleting pet"); }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-75"><Spinner className="size-8"/></div>
    ); 
    
    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <Button variant="ghost" className="gap-2 text-slate-600 p-0 hover:bg-transparent" onClick={() => navigate(isStaff ? "/users" : "/profile")}>
                <ArrowLeft className="w-4 h-4"/> {isStaff ? "Back to Users" : "Back to Profile"}
            </Button>

            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900">
                    {isFilteredByOwner 
                        ? (isStaff ? `Registered pets of owner: ${ownerFullName}` : "My Registered Pets")
                        : "All Registered Pets"}
                </h1>

                {isFilteredByOwner && canInsert && (
                    <Button onClick={() => navigate(`/owners/${ownerId}/pets/new`)} className="gap-2 shadow-sm">
                        <Plus className="w-4 h-4"/> New Pet
                    </Button>
                )}
            </div>

            <PetsTable 
                pets={pets} 
                isFilteredByOwner={isFilteredByOwner} 
                ownerId={ownerId} 
                canEdit={canEdit} 
                canDelete={canDelete} 
                onNavigate={navigate} 
                onDelete={handleDelete} 
            />

            {totalPages > 1 && (
                <div className="flex justify-end pt-2">
                    <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                </div>
            )}
        </div>
    );
};
