namespace MyVetApp.Core.Filters
{
    public class PetFilterDTO
    {
        public string? Name { get; set; } 
        public string? Species { get; set; }
        public string? Gender { get; set; }
        public bool? IsNeutered { get; set; }

        public int? OwnerId { get; set; }
    }
}
