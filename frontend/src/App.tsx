import { Route, Routes } from "react-router";
import RouterLayout from "./components/RouterLayout.tsx";
import LoginPage from "@/pages/LoginPage.tsx";
import ProtectedRoute from "@/components/ProtectedRoute.tsx";
import HomePage from "./pages/HomePage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import RegisterPetPage from "./pages/RegisterPetPage.tsx";
import { UsersListPage } from "./pages/UserListPage.tsx";
import {PetListPage} from "./pages/PetListPage.tsx";
import UnauthorizedPage from "./pages/UnauthorizedPage.tsx";
import  RegisterStaffPage  from "./pages/RegisterStaffPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";

function App() {
  return (
    <>
      <Routes>
        <Route element={<RouterLayout />}>
          <Route index element={<HomePage />} />
          
          <Route path="Login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="register-staff" element={<RegisterStaffPage />} />

          <Route path="profile" element={<ProtectedRoute />}>
            <Route index element={<ProfilePage />} />
          </Route>

          <Route path="users" element={<ProtectedRoute requiredCapability="VIEW_USERS" />}>
              <Route index element={<UsersListPage />} />
          </Route>
          
          <Route path="owners" element={<ProtectedRoute />}>
            <Route path=":ownerId/pets" element={<PetListPage />} />
            <Route path=":ownerId/pets/new" element={<RegisterPetPage />} />
            <Route path=":ownerId/pets/:petId" element={<RegisterPetPage />} />
          </Route>

          <Route 
            path="pets" 
            element={<ProtectedRoute requiredCapability="VIEW_PETS" />}
          >
            <Route index element={<PetListPage />} />
          </Route>

          <Route path="unauthorized" element={<UnauthorizedPage />} />

        </Route>
      </Routes>
    </>
  )
}

export default App;