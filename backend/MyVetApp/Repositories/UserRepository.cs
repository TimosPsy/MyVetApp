using MyVetApp.Core;
using MyVetApp.Data;
using MyVetApp.Models;
using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;

namespace MyVetApp.Repositories
{
    public class UserRepository : BaseRepository<User>, IUserRepository
    {
        public UserRepository(VetMvc9Context context) : base(context)
        {
        }

        public async Task<User?> GetUserByEmailAsync(string email) =>
            await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        
        public async Task<User?> GetUserByUsernameAsync(string username) =>
            await _context.Users
            .AsNoTracking()
            .Include(u => u.Owner)
            .Include(u => u.Role)
            .ThenInclude(r => r.Capabilities)
            .FirstOrDefaultAsync(u => u.Username == username);

        public async Task<PaginatedResult<User>> GetUsersAsync(int pageNumber, int pageSize, 
            List<Expression<Func<User, bool>>> predicates)
        {
            int totalRecords;
            IQueryable<User> query = _context.Users
            .AsNoTracking()
            .Include(u => u.Role)
            .Include(u => u.Owner);

            if (predicates != null && predicates.Count > 0)
            {
                foreach (var predicate in predicates)
                {
                    query = query.Where(predicate); 
                }
            }
            totalRecords = await query.CountAsync();
            int skip = (pageNumber - 1) * pageSize;

            var data = await query
                .OrderBy(u => u.Id) 
                .Skip(skip)
                .Take(pageSize)
                .ToListAsync();

            return new PaginatedResult<User>()
            {
                Data = data,
                TotalRecords = totalRecords,
                PageNumber = pageNumber,
                PageSize = pageSize
            };

        }
    }
}
