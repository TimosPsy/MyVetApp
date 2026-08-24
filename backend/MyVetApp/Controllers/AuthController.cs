using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyVetApp.DTO;
using MyVetApp.Exceptions;
using MyVetApp.Services;

namespace MyVetApp.Controllers
{
    [ApiController]
    [Route("api/v1/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IApplicationService _applicationService;
        private readonly IConfiguration _configuration;

        public AuthController(IApplicationService applicationService, IConfiguration configuration)
        {
            _applicationService = applicationService;
            _configuration = configuration;
        }

        /// <summary>
        /// Registers a new owner account.
        /// </summary>
        [HttpPost("register/owner")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(UserReadOnlyDTO), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<ActionResult<UserReadOnlyDTO>> RegisterOwner(
            [FromBody] OwnerSignupDTO ownerSignupDTO)
        {
            var createdUser = await _applicationService.OwnerService
                .SingUpOwnerUserAsync(ownerSignupDTO);

            return CreatedAtAction(
                actionName: nameof(UsersController.GetUserById),
                controllerName: "Users",
                routeValues: new { id = createdUser.Id },
                value: createdUser);
        }

        /// <summary>
        /// Registers a new staff account (Admin or Employee).
        /// </summary>
        [HttpPost("register/staff")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(UserReadOnlyDTO), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<ActionResult<UserReadOnlyDTO>> RegisterStaff(
            [FromBody] UserSignupDTO userSignupDTO)
        {
            var createdUser = await _applicationService.UserService
                .RegisterStaffUserAsync(userSignupDTO);

            return CreatedAtAction(
                actionName: nameof(UsersController.GetUserById),
                controllerName: "Users",
                routeValues: new { id = createdUser.Id },
                value: createdUser);
        }


        /// <summary>
        /// Authenticates a user and returns a JWT token.
        /// </summary>
        [HttpPost("login")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(JwtTokenDTO), StatusCodes.Status200OK)]
        public async Task<ActionResult<JwtTokenDTO>> Login(
            [FromBody] UserLoginDTO credentials)
        {
            var user = await _applicationService.UserService
                .VerifyAndGetUserAsync(credentials)
                ?? throw new EntityNotAuthorizedException("User", "Bad Credentials");

            var token = _applicationService.UserService.CreateUserToken(user);

            return Ok(new JwtTokenDTO(token));
        }
    }
}
