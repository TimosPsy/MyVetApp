import {Field, FieldLabel} from "@/components/ui/field.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "../components/ui/button.tsx";
import {useForm} from "react-hook-form";
import {type LoginFields, loginSchema} from "../schemas/auth.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {useAuth} from "../context/AuthProvider.tsx";
import {useNavigate} from "react-router";
import {toast} from "sonner";

export default function LoginPage() {
    const { loginUser } = useAuth();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting}
    } = useForm<LoginFields>({
        resolver: zodResolver(loginSchema)
    })

    const onSubmit = async (data: LoginFields) => {
        try {
            await loginUser(data);
            toast.success("Logged in successfully");
            navigate("/pets")
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Login failed")
        }
    }

    return (
        <>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="max-w-sm mx-auto p-8 space-y-6 border rounded bg-white shadow"
            >
                <h1 className="text-2xl font-bold text-center mb-4">Login</h1>
                <Field>
                    <FieldLabel htmlFor="username">Username</FieldLabel>
                    <Input id="username" {...register("username")}/>
                    {errors.username && (
                        <div className="text-cf-dark-red text-sm">{errors.username.message}</div>
                    )}
                </Field>
                <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input id="password" type="password" {...register("password")}/>
                    {errors.password && (
                        <div className="text-cf-dark-red text-sm">{errors.password.message}</div>
                    )}
                </Field>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Logging in..." : "Login"}
                </Button>
            </form>
        </>
    )
}