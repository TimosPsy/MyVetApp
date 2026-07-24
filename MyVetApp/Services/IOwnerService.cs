using MyVetApp.Core;
using MyVetApp.DTO;
using MyVetApp.Models;

namespace MyVetApp.Services
{
    public interface IOwnerService
    {
        Task<UserReadOnlyDTO> SingUpOwnerUserAsync(OwnerSignupDTO dto);

        Task<List<PetReadOnlyDTO>> GetOwnerPetsAsync(int ownerId);

        Task<OwnerReadOnlyDTO?> GetByVatAsync(string vat);
    }
}
