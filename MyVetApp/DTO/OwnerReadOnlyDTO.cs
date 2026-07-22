namespace MyVetApp.DTO
{
    public record OwnerReadOnlyDTO(
        int Id,                 
        string Firstname,        
        string Lastname,        
        string? Email,           
        string? PhoneNumber      
    );
}
