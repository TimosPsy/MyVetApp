using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyVetApp.Core;
using MyVetApp.Core.Filters;
using MyVetApp.DTO;
using MyVetApp.Services;


namespace MyVetApp.Controllers
{
    [ApiController]
    [Route("api/v1/pets")]
    public class PetsController : ControllerBase
    {
        private readonly IApplicationService _applicationService;

        public PetsController(IApplicationService applicationService)
        {
            _applicationService = applicationService;
        }

        /// <summary>
        /// Registers a new pet in the system.
        /// </summary>
        /// <param name="signupDTO">The registration details of the pet.</param>
        /// <returns>The details of the newly created pet.</returns>
        /// <response code="201">The pet was registered successfully.</response>
        /// <response code="400">The request payload is invalid or verification failed.</response>
        /// <response code="403">Forbidden access (User lacks the INSERT_PET capability).</response>
        /// <response code="409">Conflict (A pet with the same microchip number already exists).</response>
        [HttpPost]
        [Authorize(Policy ="INSERT_PET")]
        [ProducesResponseType(typeof(PetReadOnlyDTO), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<ActionResult<PetReadOnlyDTO>> RegisterPet(
            [FromBody] PetSignupDTO signupDTO)
        {
            var createdPet = await _applicationService.PetService.RegisterPetAsync(signupDTO);

            return CreatedAtAction(
                actionName: nameof(GetPetById),
                routeValues: new { id = createdPet.Id },
                value: createdPet);
        }

        /// <summary>
        /// Retrieves a specific pet by its unique ID.
        /// </summary>
        /// <param name="id">The unique ID of the pet.</param>
        /// <returns>The details of the requested pet if found and authorized.</returns>
        /// <response code="200">The pet details were retrieved successfully.</response>
        /// <response code="401">Unauthorized access (Missing or invalid JWT token).</response>
        /// <response code="403">Forbidden access (User is neither staff nor the owner of this pet).</response>
        /// <response code="404">The pet with the specified ID was not found.</response>
        [HttpGet("{id:int}")]
        [Authorize]
        [ProducesResponseType(typeof(PetReadOnlyDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<PetReadOnlyDTO>> GetPetById(int id)
        {
            var pet = await _applicationService.PetService.GetByIdWithSecurityAsync(id, User);
            return Ok(pet);
        }
        /// <summary>
        /// Updates the details of an existing pet.
        /// </summary>
        /// <param name="id">The unique ID of the pet to update.</param>
        /// <param name="updateDTO">The updated information for the pet.</param>
        /// <returns>The updated details of the pet.</returns>
        /// <response code="200">The pet was updated successfully.</response>
        /// <response code="400">The request payload is invalid.</response>
        /// <response code="401">Unauthorized access (Missing or invalid JWT token).</response>
        /// <response code="403">Forbidden access (User lacks the UPDATE_PET capability).</response>
        /// <response code="404">The pet was not found or has been soft-deleted.</response>
        [HttpPut("{id:int}")]
        [Authorize(Policy ="UPDATE_PET")]
        [ProducesResponseType(typeof(PetReadOnlyDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<PetReadOnlyDTO>> UpdatePet(int id, [FromBody] PetUpdateDTO updateDTO)
        {
            var updatedPet = await _applicationService.PetService.UpdatePetAsync(id, updateDTO);
            return Ok(updatedPet);
        }

        /// <summary>
        /// Performs a soft-delete on a specific pet by flagging it as deleted.
        /// </summary>
        /// <param name="id">The unique ID of the pet to soft-delete.</param>
        /// <returns>A confirmation message of the successful deletion.</returns>
        /// <response code="200">The pet was soft-deleted successfully.</response>
        /// <response code="401">Unauthorized access (Missing or invalid JWT token).</response>
        /// <response code="403">Forbidden access (User lacks the DELETE_PET capability).</response>
        /// <response code="404">The pet with the specified ID was not found.</response> 
        [HttpDelete("{id:int}")]
        [Authorize(Policy = "DELETE_PET")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> SoftDeletePet(int id)
        {
            await _applicationService.PetService.SoftDeletePetAsync(id);
            return Ok(new {id, message = "Pet successfully deleted" });
        }

        /// <summary>
        /// Retrieves a paginated list of pets with optional filtering.
        /// </summary>
        /// <param name="pageNumber">The page number to retrieve.</param>
        /// <param name="pageSize">The number of records per page.</param>
        /// <param name="filterDTO">Optional filters such as name, species, gender, or sterilization status.</param>
        /// <returns>A paginated list of pets matching the specified criteria.</returns>
        /// <response code="200">The paginated list of pets was retrieved successfully.</response>
        /// <response code="401">Unauthorized access (Missing or invalid JWT token).</response>
        /// <response code="403">Forbidden access (User lacks required viewing capabilities).</response>
        [HttpGet]
        [Authorize]
        [ProducesResponseType(typeof(PaginatedResult<PetReadOnlyDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<ActionResult<PaginatedResult<PetReadOnlyDTO>>> GetPetsFiltered(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] PetFilterDTO? filterDTO = null) 
        {
            filterDTO ??= new PetFilterDTO();

            var result = await _applicationService.PetService.GetPetsFilteredWithSecurityAsync(pageNumber, pageSize, filterDTO, User);
            return Ok(result);
        }
    }
}

