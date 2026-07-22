namespace MyVetApp.DTO
{
    public record PetReadOnlyDTO(
        int Id, 
        string Name,
        string Species,
        string? Breed,
        string Gender,
        bool IsNeutered,
        double? Weight,
        string? MicrochipNumber,

        int? OwnerId
    );
}