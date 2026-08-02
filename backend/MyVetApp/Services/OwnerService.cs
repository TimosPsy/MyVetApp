using AutoMapper;
using MyVetApp.DTO;
using MyVetApp.Exceptions;
using MyVetApp.Models;
using MyVetApp.Repositories;
using MyVetApp.Security;

namespace MyVetApp.Services
{
    public class OwnerService : IOwnerService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IEncryptionUtil _encryptionUtil;
        private readonly ILogger<OwnerService> _logger;

        public OwnerService(IUnitOfWork unitOfWork, IMapper mapper,
            ILogger<OwnerService> logger, IEncryptionUtil encryptionUtil)
        {
            _encryptionUtil = encryptionUtil;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<OwnerReadOnlyDTO?> GetByVatAsync(string vat)
        {
            Owner? owner = await _unitOfWork.OwnerRepository.GetByVatAsync(vat);

            if (owner == null)
            {
                throw new EntityNotFoundException("Owner", $"Owner with Vat number {vat} not found!");
            }

            _logger.LogInformation("Owner found with vat number: {Vat}", vat);

            return _mapper.Map<OwnerReadOnlyDTO>(owner);
        }

        public async Task<List<PetReadOnlyDTO>> GetOwnerPetsAsync(int ownerId)
        {
            Owner? owner = await _unitOfWork.OwnerRepository.GetByIdAsync(ownerId);

            if (owner == null)
            {
                throw new EntityNotFoundException("Owner", $"Owner with Id {ownerId} not found");
            }
            
            var registeredPets = await _unitOfWork.OwnerRepository.GetOwnerPetsAsync(ownerId);

            var pets = _mapper.Map<List<PetReadOnlyDTO>>(registeredPets);

            return pets;
        }

        public async Task<UserReadOnlyDTO> SingUpOwnerUserAsync(OwnerSignupDTO dto)
        {
            var owner = _mapper.Map<Owner>(dto);
            var user = _mapper.Map<User>(dto);

            var existingUser = await _unitOfWork.UserRepository.GetUserByUsernameAsync(user.Username);

            if(existingUser != null)
            {
                throw new EntityAlreadyExistsException("User", $"User with username {existingUser.Username} already exists");
            }

            var existingEmail = await _unitOfWork.UserRepository.GetUserByEmailAsync(user.Email);
            if(existingEmail != null)
            {
                throw new EntityAlreadyExistsException("User", $"User with email {user.Email} already exists.");
            }
            
            var existingVat = await _unitOfWork.OwnerRepository.GetByVatAsync(owner.VatNumber);
            if (existingVat != null)
            {
                throw new EntityAlreadyExistsException("Owner", $"Owner with vat number {owner.VatNumber} already exists.");
            }

            user.Owner = owner;
            user.Password = _encryptionUtil.Encrypt(user.Password);
            
            await _unitOfWork.UserRepository.AddAsync(user);
            await _unitOfWork.SaveAsync();
            _logger.LogInformation("Owner {Username} signed up successfully.", user.Username);

            return _mapper.Map<UserReadOnlyDTO>(user);
        }
    }
}
