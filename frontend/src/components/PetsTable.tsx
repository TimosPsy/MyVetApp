import { Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Pet } from "@/schemas/pets";

type PetTableProps = {
  pets: Pet[];
  isFilteredByOwner: boolean;
  ownerId?: string;
  canEdit: boolean;
  canDelete: boolean;
  onNavigate: (url: string) => void;
  onDelete: (id: number) => void;
};

export const PetsTable = ({ pets, isFilteredByOwner, ownerId, canEdit, canDelete, onNavigate, onDelete }: PetTableProps) => {
  return (
    <div className="rounded-md border bg-white shadow-sm overflow-hidden">
      <Table>
        <TableCaption className="mb-2">
          {isFilteredByOwner ? `A list of pets for owner with ID: ${ownerId}` : "A list of all registered pets."}
        </TableCaption>
        <TableHeader className="bg-slate-50 font-bold">
          <TableRow>
            <TableHead className="font-semibold text-slate-700">Name</TableHead>
            <TableHead className="font-semibold text-slate-700">Species</TableHead>
            <TableHead className="font-semibold text-slate-700">Breed</TableHead>
            <TableHead className="font-semibold text-slate-700">Gender</TableHead>
            <TableHead className="font-semibold text-slate-700">Neutered</TableHead>
            <TableHead className="font-semibold text-slate-700">Weight</TableHead>
            <TableHead className="font-semibold text-slate-700">Microchip N.</TableHead>
            {(canEdit || canDelete) && <TableHead className="text-right font-semibold text-slate-700">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {pets.length === 0 ? (
            <TableRow>
              <TableCell colSpan={canEdit || canDelete ? 8 : 7} className="text-center py-8 text-slate-500">
                No pets found.
              </TableCell>
            </TableRow>
          ) : (
            pets.map((pet) => (
              <TableRow key={pet.id} className="hover:bg-slate-50/50 transition-colors">
                <TableCell className="font-medium text-slate-900">{pet.name}</TableCell>
                <TableCell className="text-slate-600">{pet.species}</TableCell>
                <TableCell className="text-slate-600">{pet.breed || "-"}</TableCell>
                <TableCell className="text-slate-600">{pet.gender}</TableCell>
                <TableCell>
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                    pet.isNeutered ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-slate-100 text-slate-700"
                  }`}>
                    {pet.isNeutered ? "Yes" : "No"}
                  </span>
                </TableCell>
                <TableCell className="text-slate-600">{pet.weight ? `${pet.weight} kg` : "-"}</TableCell>
                <TableCell className="font-mono text-xs text-slate-600"> 
                    {pet.microchipNumber || "-"}
                </TableCell>

                {(canEdit || canDelete) && (
                  <TableCell className="text-right space-x-2">
                    {canEdit && (
                      <Button variant="outline" size="icon" onClick={() => onNavigate(`/owners/${ownerId || pet.ownerId}/pets/${pet.id}`)} className="h-8 w-8">
                        <Pencil className="w-4 h-4 text-slate-600"/>
                      </Button>
                    )}
                    {canDelete && (
                      <Button variant="outline" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => onDelete(pet.id)}>
                        <Trash className="w-4 h-4"/>
                      </Button>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
