using MyVetApp.Core;
using MyVetApp.Models;
using System.Linq.Expressions;

namespace MyVetApp.Repositories
{
    public interface IOwnerRepository : IBaseRepository<Owner>
    {
        Task<Owner?> GetByVatAsync(string? vat);

        Task<List<Pet>> GetOwnerPetsAsync(int ownerId);

        Task<User?> GetUserOwnerByUsernameAsync(string username);

        Task<PaginatedResult<User>> GetPaginatedUsersOwnersFilteredAsync(int pageNumber,
            int pageSize, List<Expression<Func<User, bool>>> predicates);
    }
}
