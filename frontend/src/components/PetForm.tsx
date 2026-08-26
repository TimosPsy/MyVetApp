import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type z from "zod";
import { petFormSchema } from "@/schemas/pets.ts";
import { Input } from "@/components/ui/input.tsx";
import { Field, FieldLabel } from "@/components/ui/field.tsx";
import { Switch } from "@/components/ui/switch.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Button } from "@/components/ui/button.tsx";

type PetFormProps = {
    isEdit: boolean;
    petId?: string;
    ownerId: string;
    initialValues?: any;
    onSubmit: SubmitHandler<z.input<typeof petFormSchema>>; 
    onCancel: () => void;
};

export const PetForm = ({ isEdit, petId, ownerId, initialValues, onSubmit, onCancel }: PetFormProps) => {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<z.input<typeof petFormSchema>>({
        resolver: zodResolver(petFormSchema),
        defaultValues: initialValues || {
            name: "",
            species: "Dog" as const,
            breed: "",
            gender: "Male" as const,
            isNeutered: false,
            weight: 0,
            microchipNumber: "",
            ownerId: Number(ownerId)
        }
    });

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-xl mx-auto p-8 border rounded-md space-y-4 bg-white shadow-sm"
            autoComplete="off"
        >
            <h1 className="text-xl font-bold mb-2 text-center">
                {isEdit ? "Edit Pet Profile" : "New Pet"}
            </h1>
            <p className="text-sm text-gray-500 mb-4 text-center">
                {isEdit ? `Updating info for pet with ID: #${petId}` : `Registering pet for owner with ID: ${ownerId}`}
            </p>
            
            {errors.root && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded text-center font-medium">
                    {errors.root.message}
                </div>
            )}              

            <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input id="name" {...register("name")} />
                {errors.name && <div className="text-destructive text-sm mt-1">{errors.name.message}</div>}
            </Field>

            <Field>
                <FieldLabel htmlFor="species">Species</FieldLabel>
                <select id="species" {...register("species")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none">
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                </select>
                {errors.species && <div className="text-destructive text-sm mt-1">{errors.species.message}</div>}
            </Field>

            <Field>
                <FieldLabel htmlFor="breed">Breed (Optional)</FieldLabel>
                <Input id="breed" {...register("breed")} />
                {errors.breed && <div className="text-destructive text-sm mt-1">{errors.breed.message}</div>}
            </Field>

            <Field>
                <FieldLabel htmlFor="gender">Gender</FieldLabel>
                <select id="gender" {...register("gender")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
                {errors.gender && <div className="text-destructive text-sm mt-1">{errors.gender.message}</div>}
            </Field>

            <div className="flex items-center space-x-2 py-2">
                <Switch id="isNeutered" checked={watch("isNeutered") || false} onCheckedChange={(v) => setValue("isNeutered", v)} />
                <Label htmlFor="isNeutered" className="cursor-pointer">Neutered</Label>
            </div>

            <Field>
                <FieldLabel htmlFor="weight">Weight (kg)</FieldLabel>
                <Input id="weight" type="number" step="0.1" {...register("weight", { valueAsNumber: true })} />
                {errors.weight && <div className="text-destructive text-sm mt-1">{errors.weight.message}</div>}
            </Field>

            <Field>
                <FieldLabel htmlFor="microchipNumber">Microchip Number (15 digits)</FieldLabel>
                <Input id="microchipNumber" {...register("microchipNumber")} maxLength={15} />
                {errors.microchipNumber && <div className="text-destructive text-sm mt-1">{errors.microchipNumber.message}</div>}
            </Field>

            <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={isSubmitting} className="w-3/4">
                    {isSubmitting ? "Submitting..." : isEdit ? "Save Changes" : "Create"}
                </Button>
                <Button type="button" variant="outline" className="w-1/4" onClick={onCancel}>
                    Cancel
                </Button>
            </div>
        </form>
    );
};
