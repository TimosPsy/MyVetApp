import { useNavigate } from "react-router";

export default function HomePage() {
    const navigate = useNavigate();

    return (
        <div className="max-w-2xl mx-auto text-center py-20 space-y-4">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                Welcome to MyVetApp
            </h1>
            <p className="text-gray-500 text-lg">
                The complete clinic management system.
            </p>
            <p className="text-sm text-gray-600 pt-4">
                <span 
                    onClick={() => navigate("/register")} 
                    className="text-blue-600 font-semibold hover:underline cursor-pointer"
                >
                    Register here!
                </span >
            </p>
        </div>
    );
}
