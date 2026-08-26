import { Field, FieldLabel } from "@/components/ui/field.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "../components/ui/button.tsx";
import { useForm } from "react-hook-form";
import { type LoginFields, loginSchema } from "../schemas/auth.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth, readUserFromToken} from "../context/AuthProvider.tsx";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { getCookie } from "@/utils/cookies.ts";

export default function LoginPage() { 
    const { loginUser } = useAuth();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<LoginFields>({
        resolver: zodResolver(loginSchema)
    });

    const onSubmit = async (data: LoginFields) => {
        try {
            await loginUser(data);
            toast.success("Welcome back!");
            navigate("/profile");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Login failed");
        }
    };

    return (
        <div className="p-8">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="max-w-sm mx-auto p-8 space-y-6 border rounded bg-white shadow-sm"
                autoComplete="off"
            >
                <h1 className="text-2xl font-bold text-center mb-4 text-slate-900">Login</h1>
                
                <Field>
                    <FieldLabel htmlFor="username">Username</FieldLabel>
                    <Input id="username" {...register("username")}/>
                    {errors.username && (
                        <div className="text-destructive text-sm mt-1">{errors.username.message}</div>
                    )}
                </Field>
                
                <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input id="password" type="password" {...register("password")}/>
                    {errors.password && (
                        <div className="text-destructive text-sm mt-1">{errors.password.message}</div>
                    )}
                </Field>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Logging in..." : "Login"}
                </Button>
            </form>
        </div>
    );
}
