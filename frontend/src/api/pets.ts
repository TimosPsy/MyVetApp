import type { Pet, PetData } from "@/schemas/pets";


export interface PetFilters {
    name?: string;
    species?: string;
    gender?: string;
    isNeutered?: boolean;
}

const API_URL = import.meta.env.VITE_API_URL;

export async function getPets(
    token: string, 
    pageNumber: number, 
    pageSize: number, 
    filters: PetFilters
) {
    const queryParams = new URLSearchParams({
        pageNumber: pageNumber.toString(),
        pageSize: pageSize.toString(),
        IncludeDeleted: "false",
    });

    if (filters.name) queryParams.append("Name", filters.name);
    if (filters.species) queryParams.append("Species", filters.species);
    if (filters.gender) queryParams.append("Gender", filters.gender);
    
    if (filters.isNeutered !== undefined && filters.isNeutered !== null) {
        queryParams.append("IsNeutered", filters.isNeutered.toString());
    }

    const res = await fetch(`${API_URL}/pets?${queryParams}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });

    if (!res.ok) throw new Error("Failed to get pets");
    return await res.json();
}

export async function getPet(id: number, token: string): Promise<Pet> {
   
    const res = await fetch(`${API_URL}/pets/${id}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
    if (!res.ok) throw new Error("Failed to get pet")
    return await res.json()
}

export async function updatePet(
    id: number,
    data: PetData, token: string) {

    const res = await fetch(`${API_URL}/pets/${id}`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type":"application/json"},
        body: JSON.stringify(data)
    })
    if (!res.ok) throw new Error("Failed to update pet")
    return await res.json()
}

export async function createPet(data: PetData, token: string): Promise<Pet> {
    const res = await fetch(`${API_URL}/pets`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (!res.ok) throw new Error("Failed to create pet")
    
    return await res.json();
}

export async function deletePet(id: number, token: string): Promise<void> {
    const res = await fetch(`${API_URL}/pets/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    if (!res.ok) throw new Error("Failed to delete pet")
}
