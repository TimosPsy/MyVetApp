namespace MyVetApp.Models
{
    public class Pet
    {
        public int Id { get; set; }
        public string Species { get; set; } = null!;
        public string? Breed { get; set; }
        public string Gender { get; set; } = null!;
        public bool IsNeutered { get; set; } = false;
        public double? Weight { get; set; }
        public string? MicrochipNumber { get; set; }

        public int? OwnerId { get; set; }

        public Owner? Owner { get; set; }


    }
}
