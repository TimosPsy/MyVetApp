const API_URL = import.meta.env.VITE_API_URL;

export async function getOwnerByVat(vat: string, token: string) {
    const res = await fetch(`${API_URL}/owners/${vat}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });

    if (!res.ok) throw new Error("Owner not found");
    return await res.json(); 
}

export async function getPetsByOwnerId(ownerId: number, token: string) {
    const res = await fetch(`${API_URL}/owners/${ownerId}/pets`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });

    if (!res.ok) throw new Error("Failed to get owner's pets");
    return await res.json();
}