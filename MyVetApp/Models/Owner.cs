namespace MyVetApp.Models

{
    public class Owner : BaseEntity
    {
        public int Id { get; set; }
        public string PhoneNumber { get; set; } = null!;
        public string VatNumber { get; set; } = null!;
        public int UserId { get; set; }
        public User User { get; set; } = null!;
        public ICollection<Pet> Pets { get; set; } = new HashSet<Pet>();
    }
}
