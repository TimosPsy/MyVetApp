import {Link} from "react-router/internal/react-server-client";
import {AuthButton} from "@/components/AuthButton.tsx";

const Header = () => {
    return (
        <>
            <header className="bg-cf-dark-red fixed w-full z-50">
                <div className="container mx-auto px-4 flex items-center justify-between">
                    <Link to="/">
                        <img src="https://codingfactory.aueb.gr/sites/all/themes/cf_theme/logo.png" alt="CF-logo" className="py-4 h-16"/>
                    </Link>

                    <nav className="flex items-center gap-4 text-white font-medium">
                        <Link to="/">Home</Link>
                        <Link to="/profile">Profile</Link>
                        <AuthButton/>
                    </nav>
                </div>
            </header>
        </>
    )
}
export default Header;