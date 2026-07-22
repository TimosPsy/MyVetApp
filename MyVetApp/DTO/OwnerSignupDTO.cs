using System.ComponentModel.DataAnnotations;

namespace MyVetApp.DTO
{
    public record OwnerSignupDTO
    {
        [Required(ErrorMessage = "The {0} field is required.")]
        [StringLength(50, MinimumLength = 2, ErrorMessage = "Username must be between 2 and 50 characters.")]
        public string? Username { get; set; }

        [Required(ErrorMessage = "The {0} field is required.")]
        [StringLength(50, ErrorMessage = "Email must not exceed 100 characters.")]
        [EmailAddress(ErrorMessage = "Invalid email address.")]
        public string? Email { get; set; }

        [Required(ErrorMessage = "The {0} field is required.")]
        [RegularExpression(@"(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\d)(?=.*?\W)^.{8,}$",
            ErrorMessage = "Password must contain at least one uppercase, one lowercase, " +
            "one digit, and one special character")]
        public string? Password { get; set; }

        [Required(ErrorMessage = "The {0} field is required.")]
        [StringLength(50, MinimumLength = 2, ErrorMessage = "Firstname must be between 2 and 50 characters.")]
        public string? Firstname { get; set; }

        [Required(ErrorMessage = "The {0} field is required.")]
        [StringLength(50, MinimumLength = 2, ErrorMessage = "Lastname must be between 2 and 50 characters.")]
        public string? Lastname { get; set; }

        [Required(ErrorMessage = "The {0} field is required.")]
        [StringLength(15, MinimumLength = 10, ErrorMessage = "Phone number must be at least 10 characters and " +
            "not exceed 15 characters.")]
        public string? PhoneNumber { get; set; }

        [Required(ErrorMessage = "The Vat Number field is required.")]
        [StringLength(9, MinimumLength = 9, ErrorMessage = "Vat Number must be exactly 9 digits.")]
        [RegularExpression(@"^\d{9}$", ErrorMessage = "Vat Number must contain only digits.")]
        public string? VatNumber { get; set; }

        [Required(ErrorMessage = "The {0} field is required.")]
        public int? RoleId { get; set; }
    }
}
