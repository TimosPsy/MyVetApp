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
                .ForMember(dest => dest.UserRole, opt => opt.MapFrom(src => src.Role.Name));

            CreateMap<OwnerSignupDTO, User>()
                .ForMember(dest => dest.RoleId, opt => opt.MapFrom(src => src.RoleId!.Value));

            CreateMap<OwnerSignupDTO, Owner>();

            CreateMap<PetSignupDTO, Pet>();

            CreateMap<Pet, PetReadOnlyDTO>();
        }
    }
}