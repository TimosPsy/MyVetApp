using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyVetApp.DTO;
using MyVetApp.Exceptions;
using MyVetApp.Services;
using System.Security.Claims;

namespace MyVetApp.Controllers
{
    [ApiController]
    [Route("api/v1/owners")]
    public class OwnersController : ControllerBase
    {
        private readonly IApplicationService _applicationService;

        public OwnersController(IApplicationService applicationService)
        {
            _applicationService = applicationService;
        }


        /// <summary>
        /// Retrieves an owner by their VAT number.
        /// </summary>
        /// <param name="vat">The 9-digit VAT number of the owner.</param>
        /// <returns>The profile details of the requested owner.</returns>
        /// <response code="200">Returns the requested owner profile successfully.</response>
        /// <response code="401">Unauthorized access (Missing or invalid JWT token).</response>
        /// <response code="403">Forbidden access (User lacks the VIEW_OWNER capability).</response>
        /// <response code="404">Owner with the specified VAT number was not found.</response>
        [HttpGet("{vat}")]
        [Authorize(Policy = "VIEW_OWNER")]
        [ProducesResponseType(typeof(OwnerReadOnlyDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<OwnerReadOnlyDTO>> GetOwnerByVat(string vat)
        {
            var owner = await _applicationService.OwnerService.GetByVatAsync(vat);
            
            return Ok(owner);
        }

        /// <summary>
        /// Retrieves all active pets belonging to a specific owner.
        /// </summary>
        /// <param name="ownerId">The unique ID of the owner.</param>
        /// <returns>A list of active (non-deleted) pets owned by the specified owner.</returns>
        /// <response code="200">Returns the list of pets successfully.</response>
        /// <response code="401">Unauthorized access (Missing or invalid JWT token).</response>
        /// <response code="403">Forbidden access (User lacks the VIEW_PETS capability).</response>
        /// <response code="404">Owner with the specified ID was not found.</response>
        [HttpGet("{ownerId}/pets")]
        [Authorize]
        [ProducesResponseType(typeof(List<PetReadOnlyDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<List<PetReadOnlyDTO>>> GetOwnerPets(int ownerId)
        {
            EnsureCanViewPets(ownerId);

            var pets = await _applicationService.OwnerService.GetOwnerPetsAsync(ownerId);
            return Ok(pets);
        }

        private void EnsureCanViewPets(int targetOwnerId)
        {
            var currentUserRole = User.FindFirst(ClaimTypes.Role)?.Value;

            if (currentUserRole is "ADMIN" or "EMPLOYEE" || User.HasClaim("capability", "VIEW_PETS"))
            {
                return;
            }

            var currentOwnerId = User.FindFirst("ownerId")?.Value;

            if (currentOwnerId == targetOwnerId.ToString() && currentUserRole == "OWNER")
            {
                return;
            }

            throw new EntityForbiddenException("Pet", "You do not have permission to view these pets.");
        }
    }
}
