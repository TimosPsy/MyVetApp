using MyVetApp.Models;

namespace MyVetApp.DTO
{
    public record OwnerReadOnlyDTO
    {
        public int Id { get; set; }
        public string PhoneNumber { get; set; } = null!;
        public string VatNumber { get; set; } = null!;
        public int UserId { get; set; }
    }
}
