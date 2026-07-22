using MyVetApp.Core;
using MyVetApp.Core.Filters;
using MyVetApp.DTO;
using MyVetApp.Models;

namespace MyVetApp.Services
{
    public interface IUserService
    {
        Task<User> VerifyAndGetUserAsync(UserLoginDTO credentials);

        Task<UserReadOnlyDTO?> GetUserByUsernameAsync(string username);

        Task<UserReadOnlyDTO> GetUserByIdAsync(int id);

        Task<PaginatedResult<UserReadOnlyDTO>> GetPaginatedUsersFilteredAsync(
            int pageNumber, int pageSize, UserFiltersDTO userFiltersDTO);

        string CreateUserToken(User user);
    }
}