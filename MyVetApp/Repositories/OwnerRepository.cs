using Microsoft.EntityFrameworkCore;
using MyVetApp.Core;
using MyVetApp.Data;
using MyVetApp.Models;
using System.Linq.Expressions;

namespace MyVetApp.Repositories
{
    public class OwnerRepository : BaseRepository<Owner>, IOwnerRepository
    {
        public OwnerRepository(VetMvc9Context context) : base(context)
        {
        }

        public async Task<Owner?> GetByVatAsync(string? vat)
        {
            return await _context.Owners
                .Where(o => o.VatNumber == vat)
                .SingleOrDefaultAsync();
        }

        public async Task<List<Pet>> GetOwnerPetsAsync(int ownerId)
        {
            List<Pet> pets;

             pets = await _context.Pets
                .Where(c => c.OwnerId == ownerId)
                .ToListAsync();

            return pets;
        }

        public async Task<PaginatedResult<User>> GetPaginatedUsersOwnersFilteredAsync(int pageNumber, int pageSize, List<Expression<Func<User, bool>>> predicates)
        {
            int totalRecords;

            IQueryable<User> query = _context.Users
                .Include(t => t.Owner)
                .Where(t => t.Owner != null && !t.IsDeleted);

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
                .OrderBy(t => t.Id)
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

        public async Task<User?> GetUserOwnerByUsernameAsync(string username)
        {
            var userOwner = await _context.Users
                .Include(u => u.Owner)
                .Where(u => u.Username == username && u.Owner != null)
                .SingleOrDefaultAsync();

            return userOwner;
        }
    }
}
