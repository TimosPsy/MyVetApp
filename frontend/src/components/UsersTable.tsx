import { PawPrint } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import type { UserReadOnly } from '@/schemas/users';

type UsersTableProps = {
  users: UserReadOnly[];
  canViewPets: boolean;
  onNavigate: (url: string, options?: { state: any }) => void;
};

export const UsersTable = ({ users, canViewPets, onNavigate }: UsersTableProps) => {

  const getRoleBadgeStyle = (role: string) => {
    switch (role?.toUpperCase()) {
      case 'ADMIN':
        return 'bg-red-50 text-red-700 border border-red-200';
      case 'EMPLOYEE':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'OWNER':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      default:
        return 'bg-slate-50 text-slate-700 border border-slate-200';
    }
  };

  return (
    <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="font-semibold text-slate-700">Lastname</TableHead>
            <TableHead className="font-semibold text-slate-700">Firstname</TableHead>
            <TableHead className="font-semibold text-slate-700">Username</TableHead>
            <TableHead className="font-semibold text-slate-700">Email</TableHead>
            <TableHead className="font-semibold text-slate-700">Role</TableHead>
            <TableHead className="text-right font-semibold text-slate-700">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center h-32 text-slate-400 font-medium">
                No users found matching the selected filters.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id} className="hover:bg-slate-50/40 transition-colors">
                <TableCell className="font-medium text-slate-900">{user.lastname}</TableCell>
                <TableCell className="font-medium text-slate-900">{user.firstname}</TableCell>
                <TableCell className="text-slate-600">{user.username}</TableCell>
                <TableCell className="text-slate-600">{user.email}</TableCell>
                <TableCell>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${getRoleBadgeStyle(user.userRole)}`}>
                    {user.userRole}
                  </span>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  {user.userRole?.toUpperCase() === 'OWNER' && user.ownerId && canViewPets && (
                    <Button
                    size="sm"
                    variant="outline"
                    className="gap-2 bg-amber-50 text-amber-800 hover:bg-amber-100 border-amber-200 hover:border-amber-300 transition-all shadow-sm"
                    onClick={() => {
                        sessionStorage.setItem(`owner_name_${user.ownerId}`, `${user.firstname} ${user.lastname}`);
                        onNavigate(`/owners/${user.ownerId}/pets`);
                    }}
                    >
                      <PawPrint className="w-4 h-4 text-amber-600"/>
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
  );
};
