import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthProvider';
import { getAllUsers} from '../api/users';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { PawPrint } from 'lucide-react';
import type { UserReadOnly } from '@/schemas/users';
import { PaginationControls } from '@/components/PaginationControlls';
import { Button } from '@/components/ui/button';

export const UsersListPage = () => {
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState<UserReadOnly[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const pageSize = 5;

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 350);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  useEffect(() => {
    if (!accessToken) return;

    getAllUsers(accessToken, currentPage, pageSize, { 
      userRole: 'all',
      username: debouncedSearch 
    })
      .then((res) => {
        if (res && res.data) {
          setUsers(res.data);
          setTotalPages(res.totalPages || 1);
        }
      })
      .catch(() => {
        toast.error('Failed to load users.');
      });
  }, [accessToken, currentPage, debouncedSearch]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex bg-slate-50 p-4 rounded-lg border items-end">
        <div className="flex flex-col gap-1.5 w-full max-w-md">
          <label className="text-sm font-medium text-slate-700">Search Users</label>
          <Input
            placeholder="Search by Username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Lastname</TableHead>
              <TableHead>Firstname</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24 text-slate-500">
                  No users found matching the criteria.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.lastname}</TableCell>
                  <TableCell className="font-medium">{user.firstname}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      user.userRole.toLowerCase() === 'owner'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.userRole}
                    </span>
                  </TableCell>
                  <TableCell className='text-right space-x-2'>
                    {user.userRole.toLowerCase() === 'owner' && user.ownerId && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-2 bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-300"
                        onClick={() => navigate(`/owners/${user.ownerId}/pets`)}
                      >
                        <PawPrint className="w-4 h-4"/>
                        View Pets
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page: number) => setCurrentPage(page)}
      />
    </div>
  );
};
