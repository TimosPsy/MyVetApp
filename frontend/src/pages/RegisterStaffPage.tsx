import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { registerStaffUser } from "@/api/auth.ts";
import { staffRegisterSchema } from "@/schemas/users.ts";
import { Field, FieldLabel } from "@/components/ui/field.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useAuth } from "@/context/AuthProvider";
import { useEffect } from "react";
import { z } from "zod";

export default function RegisterStaffPage() {
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
    } = useForm<z.input<typeof staffRegisterSchema>>({
        resolver: zodResolver(staffRegisterSchema),
    });

    const onSubmit = async (data: any) => { 
        try {
            await registerStaffUser(data);
            toast.success("Staff account created successfully!");
            navigate("/users");
        } catch (error: any) {
            setError("root", { message: error.message || "Registration failed" });
            toast.error("Registration failed", { position: "top-right" });
        }
    };

    return (
        <div className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-8 space-y-4 border rounded bg-white shadow">
                <h1 className="text-2xl font-bold text-center mb-6">Create Staff Account</h1>
                
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
                    <FieldLabel htmlFor="roleId">Staff Role</FieldLabel>
                    <select id="roleId" {...register("roleId")} className="w-full p-2 border rounded bg-white text-sm focus:outline-none">
                        <option value="">Select staff role...</option>
                        <option value={1}>Admin</option>
                        <option value={2}>Employee</option>
                    </select>
                    {errors.roleId && <div className="text-red-500 text-sm">{errors.roleId.message}</div>}
                </Field>

                <Button type="submit" className="w-full text-center" disabled={isSubmitting}>
                    {isSubmitting ? "Creating account..." : "Create Staff Member"}
                </Button>
            </form>
        </div>
    );
}
