using System.ComponentModel.DataAnnotations;

namespace MyVetApp.DTO
{
    public class PetUpdateDTO
    {
        [Required(ErrorMessage = "The {0} field is required.")]
        public string? Name { get; set; }

        [Required(ErrorMessage = "The {0} field is required.")]
        public string? Species { get; set; }
        
        [Required(ErrorMessage = "The {0} field is required.")]
        public string? Gender { get; set; }
        
        public bool IsNeutered { get; set; }
        public double? Weight { get; set; }
        public string? MicrochipNumber { get; set; }
    }
}
