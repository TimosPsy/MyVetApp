using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using MyVetApp.Configuration;
using MyVetApp.Helpers;
using MyVetApp.Repositories;
using MyVetApp.Security;
using MyVetApp.Services;
using Serilog;
using System.IdentityModel.Tokens.Jwt;
using System.Reflection;
using System.Text;
using System.Text.Json.Serialization;

namespace MyVetApp
{
    public class Program
    {
        public static void Main(string[] args)
        {
            JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();

            var builder = WebApplication.CreateBuilder(args);

            builder.Host.UseSerilog((hostingContext, configuration) =>
            {
                configuration.ReadFrom.Configuration(hostingContext.Configuration);
            });

            var connString = builder.Configuration.GetConnectionString("DevConnection");

            //Scoped - per request
            builder.Services.AddDbContext<Data.VetMvc9Context>(options =>
                options.UseSqlServer(connString));

            builder.Services.AddScoped<IUserService, UserService>();
            builder.Services.AddScoped<IOwnerService, OwnerService>();
            builder.Services.AddScoped<IPetService, PetService>();
            builder.Services.AddScoped<IApplicationService, ApplicationService>();

            builder.Services.AddSingleton<IEncryptionUtil, EncryptionUtil>();

            builder.Services.AddRepositories();

            builder.Services.AddAutoMapper(cfg => cfg.AddProfile<MapperConfig>());

            var jwtSettings = builder.Configuration.GetSection("Jwt");
            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = jwtSettings["Issuer"],

                    ValidateAudience = true,
                    ValidAudience = jwtSettings["Audience"],

                    ValidateLifetime = true,

                    ValidateIssuerSigningKey = true,

                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Secret"]!))
                };
            });

            builder.Services.AddEndpointsApiExplorer();

            builder.Services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo { Title = "Vet App", Version = "v1" });
                var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                options.IncludeXmlComments(xmlPath);

                options.AddSecurityDefinition(JwtBearerDefaults.AuthenticationScheme,
                    new OpenApiSecurityScheme
                    {
                        Description = "JWT Authorization header using the Bearer scheme.",
                        Name = "Authorization",
                        In = ParameterLocation.Header,
                        Type = SecuritySchemeType.Http,
                        Scheme = JwtBearerDefaults.AuthenticationScheme,
                        BearerFormat = "JWT"
                    });
                options.OperationFilter<AuthorizeOperationFilter>();
            });

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowClient", policy =>
                    policy.WithOrigins(builder.Configuration["Cors:Origin"]!)
                    .AllowAnyMethod()
                    .AllowAnyHeader());
            });

            builder.Services.AddControllers().AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
                options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
                options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
            });

            builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
            builder.Services.AddProblemDetails();

            builder.Services.AddAuthorization(options =>
            {
                options.AddPolicy("VIEW_USER", p => p.RequireClaim("capability", "VIEW_USER"));
                options.AddPolicy("VIEW_USERS", p => p.RequireClaim("capability", "VIEW_USERS"));
                options.AddPolicy("INSERT_PET", p => p.RequireClaim("capability", "INSERT_PET"));
                options.AddPolicy("DELETE_PET", p => p.RequireClaim("capability", "DELETE_PET"));
                options.AddPolicy("UPDATE_PET", p => p.RequireClaim("capability", "EDIT_PET"));
                options.AddPolicy("VIEW_OWNER", p => p.RequireClaim("capability", "VIEW_OWNER"));
                options.AddPolicy("VIEW_PETS", p => p.RequireClaim("capability", "VIEW_PETS"));
                options.AddPolicy("VIEW_ONLY_OWN_PETS", p => p.RequireClaim("capability", "VIEW_ONLY_OWN_PETS"));
            });

            var app = builder.Build();

            app.UseExceptionHandler();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseCors("AllowClient");
            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();

            // --- AUTOMATIC MIGRATIONS AND SQL SEEDING ON STARTUP ---
            using (var scope = app.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                try
                {
                    var context = services.GetRequiredService<Data.VetMvc9Context>();

                    context.Database.Migrate();

                    var seedFiles = new string[]
                    {
                        "V001_InitialVetDB_Seed.sql",
                        "V002__AddViewUserCapabilities.sql",
                        "V003__AddPetCapabilitiesToEmployeeAndOwner.sql"
                    };

                    var baseDir = AppContext.BaseDirectory;
                    var scriptsPath = Path.Combine(baseDir, "Resources", "db");

                    foreach (var fileName in seedFiles)
                    {
                        var filePath = Path.Combine(scriptsPath, fileName);

                        if (File.Exists(filePath))
                        {
                            var sql = File.ReadAllText(filePath);

                            context.Database.ExecuteSqlRaw(sql);
                        }
                        else
                        {
                            var logger = services.GetRequiredService<ILogger<Program>>();
                            logger.LogWarning($"Seed file '{fileName}' was not found at path: {filePath}");
                        }
                    }
                }
                catch (Exception ex)
                {
                    var logger = services.GetRequiredService<ILogger<Program>>();
                    logger.LogError(ex, "An error occurred during database migration or database seeding.");
                }
            }
            // -----------------------------------------------------------------------

            app.Run();
        }
    }
}
