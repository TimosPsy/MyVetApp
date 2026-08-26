import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { useEffect, useState } from "react";

import { useAuth } from "@/context/AuthProvider.tsx";
import { createPet, getPet, updatePet } from "@/api/pets.ts";
import { type PetData } from "@/schemas/pets.ts";
import { Spinner } from "@/components/ui/spinner.tsx";
import { PetForm } from "@/components/PetForm";

export const RegisterPet = () => {
    const navigate = useNavigate();
    const { accessToken, user, hasCapability } = useAuth();
    
    const { ownerId, petId } = useParams<{ ownerId: string; petId?: string }>();
    const oId = Number(ownerId);
    const pId = Number(petId);
    const isEdit = !!petId;

    const [pageLoading, setPageLoading] = useState<boolean>(isEdit);
    const [initialValues, setInitialValues] = useState<any>(null);

    useEffect(() => {
        if (!accessToken) return;
        
        const isStaff = hasCapability("VIEW_PETS");
        if (hasCapability("VIEW_ONLY_OWN_PETS") && !isStaff && Number(user?.ownerId) !== oId) {
            navigate("/unauthorized", { replace: true });
            return;
        }

        if (!isEdit) return;

        setPageLoading(true);
        getPet(pId, accessToken)
            .then((petData) => {
                if (petData) {
                    setInitialValues({
                        name: petData.name,
                        species: petData.species,
                        breed: petData.breed || "",
                        gender: petData.gender,
                        isNeutered: petData.isNeutered,
                        weight: petData.weight ?? 0,
                        microchipNumber: petData.microchipNumber || "",
                        ownerId: petData.ownerId
                    });
                }
            })
            .catch(() => toast.error("Failed to load pet data"))
            .finally(() => setPageLoading(false));
    }, [petId, accessToken, oId, user?.ownerId, navigate, isEdit]);

    const handleFormSubmit = async (data: any) => {
        if (!accessToken) return;
        try {  
            const payload: PetData = {
                ...data,
                breed: data.breed?.trim() || null,
                microchipNumber: data.microchipNumber?.trim() || null,
                ownerId: oId
            };

            if (isEdit) {
                await updatePet(pId, payload, accessToken);
                toast.success("Pet updated successfully");
            } else {
                await createPet(payload, accessToken);
                toast.success("Pet created successfully");
            }
            navigate(`/owners/${oId}/pets`);
        } catch {
            toast.error(isEdit ? "Update failed" : "Registration failed");
        }
    };

    if (pageLoading) {
        return (
            <div className="flex items-center justify-center min-h-75">
                <Spinner className="size-8" />
            </div>
        );
    }

    return (
        <PetForm 
            isEdit={isEdit} 
            petId={petId} 
            ownerId={ownerId!} 
            initialValues={initialValues} 
            onSubmit={handleFormSubmit} 
            onCancel={() => navigate(`/owners/${oId}/pets`)} 
        />
    );
};

export default RegisterPet;
