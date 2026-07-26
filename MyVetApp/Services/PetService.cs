using AutoMapper;
using MyVetApp.Core;
using MyVetApp.Core.Filters;
using MyVetApp.DTO;
using MyVetApp.Exceptions;
using MyVetApp.Models;
using MyVetApp.Repositories;
using MyVetApp.Security;
using System.Linq.Expressions;

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

        public async Task<PetReadOnlyDTO> GetByIdAsync(int petId)
        {
           var pet = await _unitOfWork.PetRepository.GetByIdAsync(petId);
            if( pet == null)
            {
                throw new EntityNotFoundException("Pet", $"Pet with Id {petId} not found.");
            }

            _logger.LogInformation("Pet with Id {id} found", petId);
            return _mapper.Map<PetReadOnlyDTO>(pet);
        }

        public async Task<OwnerReadOnlyDTO?> GetPetOwnerAsync(int petId)
        {
            var existingOwner = await _unitOfWork.PetRepository.GetPetOwnerAsync(petId);

            if (existingOwner == null)
            {
                _logger.LogWarning("No owner found for pet with ID {PetId} (Stray pet or invalid ID)", petId);
                return null;
            }

            _logger.LogInformation("Successfully retrieved owner details for pet with ID {PetId}", petId);           
            return _mapper.Map<OwnerReadOnlyDTO>(existingOwner);
        }

        public async Task<PaginatedResult<PetReadOnlyDTO>> GetPetsFilteredAsync(int pageNumber, int pageSize, PetFilterDTO filterDTO)
        {
            List<Expression<Func<Pet, bool>>> predicates = [];

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
            if (filterDTO.OwnerId.HasValue)
            {
                predicates.Add(p => p.OwnerId == filterDTO.OwnerId);
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

            var existingPet = await _unitOfWork.PetRepository.GetByIdAsync(pet.Id);
            if( existingPet != null)
            {
                throw new EntityAlreadyExistsException("Pet", $"Pet with ID: {pet.Id} already exists");
            }

            await _unitOfWork.PetRepository.AddAsync(pet);
            await _unitOfWork.SaveAsync();

            _logger.LogInformation("Successfully created new pet with ID {PetId}", pet.Id);
            return _mapper.Map<PetReadOnlyDTO>(pet);
        }

        public async Task<PetReadOnlyDTO> SoftDeletePetAsync(int id)
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

            return _mapper.Map<PetReadOnlyDTO>(pet);
        }


    }
}
