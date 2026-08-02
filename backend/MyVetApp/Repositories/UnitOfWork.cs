using MyVetApp.Data;

namespace MyVetApp.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly VetMvc9Context _context;
        public IUserRepository UserRepository { get; }
        public IOwnerRepository OwnerRepository { get; }
        public IPetRepository PetRepository { get; }

        public UnitOfWork(VetMvc9Context context)
        {
            _context = context;
            UserRepository = new UserRepository(context);
            OwnerRepository = new OwnerRepository(context);
            PetRepository = new PetRepository(context);
        }

        public async Task<bool> SaveAsync()
        {
            return await _context.SaveChangesAsync() > 0;   // commit & rollback
        }
    }
}
