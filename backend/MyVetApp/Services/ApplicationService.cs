namespace MyVetApp.Services
{
    public class ApplicationService : IApplicationService
    {
        public IUserService UserService { get; }
        public IOwnerService OwnerService { get; }
        public IPetService PetService { get; }

        
        public ApplicationService(IUserService userService, IOwnerService ownerService, IPetService petService)
        { 
            UserService = userService;
            OwnerService = ownerService;
            PetService = petService; 
        }
    }
}
