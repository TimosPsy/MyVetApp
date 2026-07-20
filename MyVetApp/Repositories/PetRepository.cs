using Microsoft.EntityFrameworkCore;
using MyVetApp.Core;
using MyVetApp.Data;
using MyVetApp.Models;
using System.Linq.Expressions;

namespace MyVetApp.Repositories
{
    public class PetRepository : BaseRepository<Pet>, IPetRepository
    {
        public PetRepository(VetMvc9Context context) : base(context)
        {
        }

        public async Task<PaginatedResult<Pet>> GetPaginatedPetsAsync(int pageNumber, int pageSize, List<Expression<Func<Pet, bool>>> predicates)
        {
            IQueryable<Pet> query = _context.Pets;

            if (predicates != null && predicates.Count > 0)
            {
                foreach (var predicate in predicates)
                {
                    query = query.Where(predicate);
                }
            }
            
            int totalRecords = await query.CountAsync();
            int skip = (pageNumber - 1) * pageSize;

            var data = await query.OrderBy(p => p.Id)
                .Skip(skip)
                .Take(pageSize)
                .ToListAsync();
            
            return new PaginatedResult<Pet>()
            {
                Data = data,
                TotalRecords = totalRecords,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }


        public async Task<Owner?> GetPetOwnerAsync(int petId)
        {
            var pet = await _context.Pets
                .Include(p => p.Owner)
                .ThenInclude(o => o!.User)
                .FirstOrDefaultAsync(c => c.Id == petId);

            return pet?.Owner;
        }
    }
}
