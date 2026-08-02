namespace MyVetApp.Services
{
    public interface IApplicationService
    {
        IUserService UserService { get; }
        IOwnerService OwnerService { get; }
        IPetService PetService { get; } 
    }
}