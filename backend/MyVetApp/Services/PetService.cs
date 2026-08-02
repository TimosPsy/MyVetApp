using AutoMapper;
using MyVetApp.Core;
using MyVetApp.Core.Filters;
using MyVetApp.DTO;
using MyVetApp.Exceptions;
using MyVetApp.Models;
using MyVetApp.Repositories;
using MyVetApp.Security;
using System.Linq.Expressions;
using System.Security.Claims;

namespace MyVetApp.Services
{
    public class PetService : IPetService
    {
        private readonly IEncryptionUtil _encryptionUtil;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ILogger<PetService> _logger;
        private readonly IConfiguration _configuration;

        public PetService(IUnitOfWork unitOfWork, IMapper mapper,
            ILogger<PetService> logger, IEncryptionUtil encryptionUtil, IConfiguration configuration)
        {
            _encryptionUtil = encryptionUtil;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _logger = logger;
            _configuration = configuration;
        }

        public async Task<PetReadOnlyDTO> GetByIdWithSecurityAsync(int petId, ClaimsPrincipal userClaims)
        {
            
            var pet = await _unitOfWork.PetRepository.GetByIdAsync(petId);
            if (pet == null)
            {
                throw new EntityNotFoundException("Pet", $"Pet with Id {petId} not found!");
            }

            var currentUserId = int.Parse(userClaims.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var canViewAll = userClaims.HasClaim("capability", "VIEW_PET") || userClaims.HasClaim("capability", "VIEW_PETS");

            
            var isOwnerOfPet = userClaims.HasClaim("capability", "VIEW_ONLY_OWN_PETS") && pet.Owner.UserId == currentUserId && !pet.IsDeleted;

            if (!canViewAll && !isOwnerOfPet) throw new EntityForbiddenException("Pet", "Forbidden");

            _logger.LogInformation("Pet with Id {id} found", petId);
            return _mapper.Map<PetReadOnlyDTO>(pet);
        }

        public async Task<PaginatedResult<PetReadOnlyDTO>> GetPetsFilteredWithSecurityAsync(int pageNumber, int pageSize, PetFilterDTO filterDTO, ClaimsPrincipal user)
        {

            List<Expression<Func<Pet, bool>>> predicates = [];

            var currentUserRole = user.FindFirst(ClaimTypes.Role)?.Value;

            if(currentUserRole == "OWNER" && user.HasClaim("capability", "VIEW_ONLY_OWN_PETS"))
            {
                var currentUserId = int.Parse(user.FindFirst(ClaimTypes.NameIdentifier)!.Value);

                predicates.Add(p => p.Owner.UserId == currentUserId);
                predicates.Add(p => !p.IsDeleted);
            }
            else
            {
                if(!user.HasClaim("capability", "VIEW_PETS"))
                {
                    throw new EntityForbiddenException("Pet", "Forbidden");
                }
                if (filterDTO.OwnerId.HasValue)
                {
                    predicates.Add(p => p.OwnerId == filterDTO.OwnerId.Value);
                }
                if (!filterDTO.IncludeDeleted)
                {
                    predicates.Add(p => !p.IsDeleted);
                }
            }

            if (!string.IsNullOrEmpty(filterDTO.Name))
            {
                predicates.Add(p => p.Name.Contains(filterDTO.Name));
            }
            if (!string.IsNullOrEmpty(filterDTO.Species))
            {
                predicates.Add(p => p.Species == filterDTO.Species);
            }
            if (!string.IsNullOrEmpty(filterDTO.Gender))
            {
                predicates.Add(p => p.Gender == filterDTO.Gender);
            }
            if (filterDTO.IsNeutered.HasValue)
            {
                predicates.Add(p => p.IsNeutered == filterDTO.IsNeutered.Value);
            }


            var result = await _unitOfWork.PetRepository.GetPaginatedPetsFilteredAsync(pageNumber, pageSize, predicates);

            var dtoResult = new PaginatedResult<PetReadOnlyDTO>()
            {
                Data = _mapper.Map<List<PetReadOnlyDTO>>(result.Data),
                TotalRecords = result.TotalRecords,
                PageNumber = result.PageNumber,
                PageSize = result.PageSize
            };

            _logger.LogInformation("Retrieved {Count} pets", dtoResult.Data.Count);
            return dtoResult;

        }

        public async Task<PetReadOnlyDTO> RegisterPetAsync(PetSignupDTO dto)
        {
            Pet pet = _mapper.Map<Pet>(dto);

            var ownerExists = await _unitOfWork.OwnerRepository.GetByIdAsync(dto.OwnerId!.Value);
            if(ownerExists == null)
            {
                throw new EntityNotFoundException("Owner", $"Cannot register pet. Owner with ID {dto.OwnerId.Value} does not exist.");
            }

            if (!string.IsNullOrEmpty(dto.MicrochipNumber))
            {
                var existingPet = await _unitOfWork.PetRepository.GetByMicrochipNumberAsync(dto.MicrochipNumber);
                if (existingPet != null)
                {
                    throw new EntityAlreadyExistsException("Pet", $"Pet with Chip Number: {dto.MicrochipNumber} already exists");
                }
            }

            await _unitOfWork.PetRepository.AddAsync(pet);
            await _unitOfWork.SaveAsync();

            _logger.LogInformation("Successfully created new pet with ID {PetId}", pet.Id);
            return _mapper.Map<PetReadOnlyDTO>(pet);
        }

        public async Task SoftDeletePetAsync(int id)
        {
            var pet = await _unitOfWork.PetRepository.GetByIdAsync(id);

            if (pet == null)
            {
                throw new EntityNotFoundException("Pet", $"Pet with Id {id} not found!");
            }

            pet.IsDeleted = true;
            pet.DeletedAt = DateTime.UtcNow;

            await _unitOfWork.PetRepository.UpdateAsync(pet);
            await _unitOfWork.SaveAsync();

            _logger.LogInformation("Successfully deleted pet with id: {PetId}", id);
        }

        public async Task<PetReadOnlyDTO> UpdatePetAsync(int id, PetUpdateDTO dto)
        {
            var pet = await _unitOfWork.PetRepository.GetByIdAsync(id);

            if(pet == null || pet.IsDeleted)
            {
                throw new EntityNotFoundException("Pet", $"Pet with Id: {id} not found");
            }

            if (!string.IsNullOrEmpty(dto.MicrochipNumber))
            {
                var existingPet = await _unitOfWork.PetRepository.GetByMicrochipNumberAsync(dto.MicrochipNumber);

                if (existingPet != null && existingPet.Id != id)
                {
                    throw new EntityAlreadyExistsException("Pet", $"Another pet with Chip Number: {dto.MicrochipNumber} already exists.");
                }
            }

            _mapper.Map(dto, pet);

            await _unitOfWork.PetRepository.UpdateAsync(pet);
            await _unitOfWork.SaveAsync();

            _logger.LogInformation("Successfully updated pet with ID {PetId}", id);
            return _mapper.Map<PetReadOnlyDTO>(pet);
        }
    }
}
