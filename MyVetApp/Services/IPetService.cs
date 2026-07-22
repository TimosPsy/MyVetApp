using MyVetApp.Core;
using MyVetApp.Core.Filters;
using MyVetApp.DTO;

namespace MyVetApp.Services
{
    public interface IPetService
    {
        Task<PaginatedResult<PetReadOnlyDTO>> GetPetsFilteredAsync(int pageNumber, int pageSize,
            PetFilterDTO petFiltersDTO);

        Task<PetReadOnlyDTO> RegisterPetAsync(PetSignupDTO dto);

        Task<PetReadOnlyDTO> SoftDeletePetAsync(int id);

        Task<OwnerReadOnlyDTO?> GetPetOwnerAsync(int petId);
    }
}
