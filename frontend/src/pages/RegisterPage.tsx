import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { registerOwnerUser } from "@/api/auth.ts";
import { type UserRegisterData, userRegisterSchema } from "@/schemas/users.ts";
import { Field, FieldLabel } from "@/components/ui/field.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useAuth } from "@/context/AuthProvider";
import { useEffect } from "react";

export default function RegisterPage() {

    const { logoutUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        logoutUser();
    }, [logoutUser]);

    const { 
        register, 
        handleSubmit,
        setError,
        formState: { errors, isSubmitting } 
    } = useForm({
        resolver: zodResolver(userRegisterSchema),
});

    const onSubmit = async (data: UserRegisterData) => { 
        try {
            await registerOwnerUser(data);
            toast.success("Registration successfull!");
            navigate("/Login");
        } catch (error: any) {
            setError("root", {message: error.message});
            toast.error("Registration failed", { position: "top-right" });
        }
};

    return (
        <div className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-8 space-y-4 border rounded bg-white shadow">
                <h1 className="text-2xl font-bold text-center mb-6">Register Account</h1>
                {errors.root && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded text-center font-medium">
                        {errors.root.message}
                    </div>
                )}
                <Field>
                    <FieldLabel htmlFor="username">Username</FieldLabel>
                    <Input id="username" {...register("username")} />
                    {errors.username && <div className="text-red-500 text-sm">{errors.username.message}</div>}
                </Field>
                <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input id="email" type="email" {...register("email")} />
                    {errors.email && <div className="text-red-500 text-sm">{errors.email.message}</div>}
                </Field>
                <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input id="password" type="password" {...register("password")} />
                    {errors.password && <div className="text-red-500 text-sm">{errors.password.message}</div>}
                </Field>
                <Field>
                    <FieldLabel htmlFor="firstname">Firstname</FieldLabel>
                    <Input id="firstname" {...register("firstname")} />
                    {errors.firstname && <div className="text-red-500 text-sm">{errors.firstname.message}</div>}
                </Field>
                <Field>
                    <FieldLabel htmlFor="lastname">Lastname</FieldLabel>
                    <Input id="lastname" {...register("lastname")} />
                    {errors.lastname && <div className="text-red-500 text-sm">{errors.lastname.message}</div>}
                </Field>
                <Field>
                    <FieldLabel htmlFor="phoneNumber">Phone Number</FieldLabel>
                    <Input id="phoneNumber" {...register("phoneNumber")} />
                    {errors.phoneNumber && <div className="text-red-500 text-sm">{errors.phoneNumber.message}</div>}
                </Field>
                <Field>
                    <FieldLabel htmlFor="vatNumber">VAT Number (ΑΦΜ)</FieldLabel>
                    <Input id="vatNumber" {...register("vatNumber")} />
                    {errors.vatNumber && <div className="text-red-500 text-sm">{errors.vatNumber.message}</div>}
                </Field>
                <Field>
                    <FieldLabel htmlFor="roleId">Account Type</FieldLabel>
                    <select id="roleId" {...register("roleId")} className="w-full p-2 border rounded bg-white text-sm focus:outline-none">
                        <option value="">Select your role...</option>
                        <option value={1}>Admin</option>
                        <option value={2}>Employee</option>
                        <option value={3}>Owner</option>
                    </select>
                    {errors.roleId && <div className="text-red-500 text-sm">{errors.roleId.message}</div>}
                </Field>
                <Button type="submit" className="w-full text-center" disabled={isSubmitting}>
                    {isSubmitting ? "Registering..." : "Register Account"}
                </Button>
            </form>
        </div>
    );
}
