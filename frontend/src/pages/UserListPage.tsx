import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthProvider';
import { getAllUsers } from '../api/users';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Search } from 'lucide-react';
import type { UserReadOnly } from '@/schemas/users';
import { PaginationControls } from '@/components/PaginationControlls';
import { Spinner } from '@/components/ui/spinner';
import { UsersTable } from '@/components/UsersTable';

export const UsersListPage = () => {
  const { accessToken, hasCapability } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState<UserReadOnly[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('all'); 

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const pageSize = 5;

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); 
    }, 350);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    if (!accessToken) return;

    setLoading(true);
    getAllUsers(accessToken, currentPage, pageSize, { 
      userRole: selectedRole, 
      username: debouncedSearch 
    })
      .then((res) => {
        if (res && res.data) {
          setUsers(res.data);
          setTotalPages(res.totalPages || 1);
        } else {
          setUsers([]);
          setTotalPages(1);
        }
      })
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : 'Failed to load users.');
      })
      .finally(() => setLoading(false));
  }, [accessToken, currentPage, debouncedSearch, selectedRole]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      <div className="flex flex-col sm:flex-row gap-4 bg-slate-50 p-4 rounded-xl border items-end shadow-sm">

        <div className="flex flex-col gap-1.5 w-full max-w-md relative">
          <label className="text-sm font-medium text-slate-700">Search Users</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              className="pl-9"
              placeholder="Search by Username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5 w-full sm:w-48">
          <label className="text-sm font-medium text-slate-700">Filter by Role</label>
          <select
            value={selectedRole}
            onChange={(e) => {
              setSelectedRole(e.target.value);
              setCurrentPage(1); 
            }}
            className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            <option value="all">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="EMPLOYEE">Employee</option>
            <option value="OWNER">Owner</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-50">
          <Spinner className="size-8" />
        </div>
      ) : (
        <UsersTable 
          users={users} 
          selectedRole={selectedRole}
          canViewPets={hasCapability('VIEW_PETS')} 
          onNavigate={navigate} 
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end pt-2">
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page: number) => setCurrentPage(page)}
          />
        </div>
      )}
    </div>
  );
};
