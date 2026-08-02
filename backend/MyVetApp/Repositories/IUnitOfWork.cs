namespace MyVetApp.Repositories
{
    public interface IUnitOfWork
    {
        IUserRepository UserRepository { get; }
        IOwnerRepository OwnerRepository { get; }
        IPetRepository PetRepository { get; }

        Task<bool> SaveAsync();
    }
}
