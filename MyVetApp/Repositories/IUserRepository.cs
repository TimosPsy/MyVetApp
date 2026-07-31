using MyVetApp.Core;
using MyVetApp.Models;
using System.Linq.Expressions;

namespace MyVetApp.Repositories
{
    public interface IUserRepository : IBaseRepository<User>
    {
        Task<User?> GetUserByUsernameAsync(string username);

        Task<User?> GetUserByEmailAsync(string email);
        
        Task<PaginatedResult<User>> GetUsersAsync(int pageNumber, int pageSize,
            List<Expression<Func<User, bool>>> predicates);
    }
}
