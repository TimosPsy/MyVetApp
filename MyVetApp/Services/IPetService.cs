using MyVetApp.Core;
using MyVetApp.Core.Filters;
using MyVetApp.DTO;
using System.Security.Claims;

namespace MyVetApp.Services
{
    public interface IPetService
    {
        Task<PaginatedResult<PetReadOnlyDTO>> GetPetsFilteredWithSecurityAsync(int pageNumber, int pageSize,
            PetFilterDTO petFiltersDTO, ClaimsPrincipal claimsPrincipal);

        Task<PetReadOnlyDTO> GetByIdWithSecurityAsync(int petId, ClaimsPrincipal userClaims);

        Task<PetReadOnlyDTO> RegisterPetAsync(PetSignupDTO dto);

        Task<PetReadOnlyDTO> UpdatePetAsync(int id, PetUpdateDTO dto);

        Task SoftDeletePetAsync(int petId);
    }
}
