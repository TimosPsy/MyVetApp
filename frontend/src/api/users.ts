import type { PaginatedResponse } from "@/types/pagination";
import type { UserFilters, UserReadOnly } from "@/schemas/users";

const API_URL = import.meta.env.VITE_API_URL;

export async function getAllUsers(
  token: string, 
  pageNumber: number, 
  pageSize: number,
  filters: UserFilters
): Promise<PaginatedResponse<UserReadOnly>> {

  const queryParams = new URLSearchParams({
    pageNumber: pageNumber.toString(),
    pageSize: pageSize.toString(),
  });

  if (filters.username) {
    queryParams.append("Username", filters.username);
  }
  if (filters.email) {
    queryParams.append("Email", filters.email);
  }
  if (filters.userRole && filters.userRole !== 'all') {
    queryParams.append("UserRole", filters.userRole);
  }

  const res = await fetch(`${API_URL}/users?${queryParams}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  if (!res.ok) throw new Error("Failed to get users");
  return await res.json();
}
