using System.ComponentModel.DataAnnotations;

namespace MyVetApp.DTO
{
    public record PetSignupDTO
    {
        [Required(ErrorMessage = "The {0} field is required.")]
        [StringLength(20, MinimumLength = 2, ErrorMessage = "Name must be between 2 and 20 characters.")]
        public string? Name { get; set; }

        [Required(ErrorMessage = "The {0} field is required.")]
        [StringLength(15, ErrorMessage = "Species cannot exceed 15 characters.")]
        public string? Species { get; set; }

        [StringLength(15, ErrorMessage = "Breed cannot exceed 15 characters.")]
        public string? Breed { get; set; }

        [Required(ErrorMessage = "The {0} field is required.")]
        [StringLength(10, ErrorMessage = "Gender cannot exceed 10 characters.")]
        public string? Gender { get; set; }

        [Required(ErrorMessage = "The {0} field is required.")]
        public bool IsNeutered { get; set; }

        [Range(0.1, 100.0, ErrorMessage = "Weight must be between 0.1 and 100 kg.")]
        public double? Weight { get; set; }

        [StringLength(50, ErrorMessage = "Microchip Number cannot exceed 50 characters.")]
        [RegularExpression(@"^\d*$", ErrorMessage = "Microchip Number must contain only digits.")]
        public string? MicrochipNumber { get; set; }


        public int? OwnerId { get; set; }
    }
}
