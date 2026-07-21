using MyVetApp.Core;
using MyVetApp.Models;
using System.Linq.Expressions;

namespace MyVetApp.Repositories
{
    public interface IPetRepository : IBaseRepository<Pet>
    {
        Task<Pet?> GetByMicrochipNumberAsync(string? chipNumber);

        Task<Owner?> GetPetOwnerAsync(int petId);

        Task<PaginatedResult<Pet>> GetPaginatedPetsFilteredAsync(int pageNumber,
                int pageSize, List<Expression<Func<Pet, bool>>> predicates);
    }
}
