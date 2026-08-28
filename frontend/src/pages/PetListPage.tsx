import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { ArrowLeft, Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
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

    const [searchQuery, setSearchQuery] = useState<string>('');
    const [debouncedSearch, setDebouncedSearch] = useState<string>('');
    const [selectedSpecies, setSelectedSpecies] = useState<string>('all');

    const canInsert = hasCapability("INSERT_PET");
    const canEdit = hasCapability("EDIT_PET");
    const canDelete = hasCapability("DELETE_PET");
    const isStaff = hasCapability("VIEW_PETS");

    const savedName = sessionStorage.getItem(`owner_name_${oId}`);
    
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setCurrentPage(1); 
        }, 350);

        return () => clearTimeout(handler);
    }, [searchQuery]);

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
                .then((res) => { 
                    let filtered = res;
                    if (debouncedSearch) {
                        filtered = filtered.filter((p: { name: string; }) => p.name.toLowerCase().includes(debouncedSearch.toLowerCase()));
                    }
                    if (selectedSpecies !== 'all') {
                        filtered = filtered.filter((p: { species: string; }) => p.species === selectedSpecies);
                    }
                    setPets(filtered); 
                    setTotalPages(1); 
                })
                .catch(() => toast.error("Error fetching owner's pets"))
                .finally(() => setLoading(false));
        } else {
            getPets(accessToken, currentPage, pageSize, {
                name: debouncedSearch,   
                species: selectedSpecies !== 'all' ? selectedSpecies : undefined
            })
                .then((res) => {
                    if (res && res.data) { 
                        setPets(res.data); 
                        setTotalPages(res.totalPages || 1); 
                    } else { 
                        setPets([]); 
                        setTotalPages(1); 
                    }
                })
                .catch(() => toast.error("Error fetching pets"))
                .finally(() => setLoading(false));
        }
    }, [ownerId, accessToken, currentPage, user?.ownerId, debouncedSearch, selectedSpecies]);

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

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <Button variant="ghost" className="gap-2 text-slate-600 p-0 hover:bg-transparent" onClick={() => navigate(isStaff ? "/users" : "/profile")}>
                <ArrowLeft className="w-4 h-4"/> {isStaff ? "Back to Users" : "Back to Profile"}
            </Button>

            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-baseline gap-2 flex-wrap">
                    {isFilteredByOwner ? (
                        isStaff ? (
                            <>
                                <span className="text-slate-500 font-medium">Registered pets of owner:</span>
                                <span className="font-bold text-slate-900">
                                    {savedName || `#${oId}`}
                                </span>
                            </>
                        ) : (
                            "My Registered Pets"
                        )
                    ) : (
                        "All Registered Pets"
                    )}
                </h1>
                {isFilteredByOwner && canInsert && (
                    <Button onClick={() => navigate(`/owners/${ownerId}/pets/new`)} className="gap-2 shadow-sm">
                        <Plus className="w-4 h-4"/> New Pet
                    </Button>
                )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 bg-slate-50 p-4 rounded-xl border items-end shadow-sm">
                <div className="flex flex-col gap-1.5 w-full max-w-md relative">
                    <label className="text-sm font-medium text-slate-700">Search Pets</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <Input
                            className="pl-9"
                            placeholder="Search by pet Name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-1.5 w-full sm:w-48">
                    <label className="text-sm font-medium text-slate-700">Species</label>
                    <select
                        value={selectedSpecies}
                        onChange={(e) => {
                            setSelectedSpecies(e.target.value);
                            setCurrentPage(1); 
                        }}
                        className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                    >
                        <option value="all">All Species</option>
                        <option value="Dog">Dog</option>
                        <option value="Cat">Cat</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center min-h-50">
                    <Spinner className="size-8" />
                </div>
            ) : (
                <PetsTable 
                    pets={pets} 
                    isFilteredByOwner={isFilteredByOwner} 
                    ownerId={ownerId} 
                    canEdit={canEdit} 
                    canDelete={canDelete} 
                    onNavigate={navigate} 
                    onDelete={handleDelete} 
                />
            )}

            {totalPages > 1 && (
                <div className="flex justify-end pt-2">
                    <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                </div>
            )}
        </div>
    );
};
