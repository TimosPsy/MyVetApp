using AutoMapper;
using MyVetApp.DTO;
using MyVetApp.Models;

namespace MyVetApp.Configuration
{
    public class MapperConfig : Profile
    {

        public MapperConfig()
        {
            CreateMap<User, UserReadOnlyDTO>()
                .ForMember(dest => dest.UserRole, opt => opt.MapFrom(src => src.Role.Name))
                .ForMember(dest => dest.OwnerId, opt => opt.MapFrom(src => src.Owner != null ? src.Owner.Id : (int?)null));

            CreateMap<OwnerSignupDTO, User>()
                .ForMember(dest => dest.RoleId, opt => opt.MapFrom(src => src.RoleId!.Value));
            
            CreateMap<UserSignupDTO, User>()
                .ForMember(dest => dest.RoleId, opt => opt.MapFrom(src => src.RoleId!.Value));

            CreateMap<OwnerSignupDTO, Owner>();

            CreateMap<PetSignupDTO, Pet>();

            CreateMap<Pet, PetReadOnlyDTO>();

            CreateMap<PetUpdateDTO, Pet>();

            CreateMap<Owner, OwnerReadOnlyDTO>();
        }
    }
}