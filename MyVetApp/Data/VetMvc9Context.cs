using Microsoft.EntityFrameworkCore;
using MyVetApp.Models;

namespace MyVetApp.Data;

public class VetMvc9Context : DbContext
{

    public VetMvc9Context(DbContextOptions<VetMvc9Context> options)
        : base(options)
    {
    }

    public DbSet<Capability> Capabilities { get; set; }

    public DbSet<Role> Roles { get; set; }

    public DbSet<Pet> Pets { get; set; }

    public DbSet<Owner> Owners { get; set; }

    public DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Capability>(entity =>
        {
            entity.Property(e => e.Description).HasMaxLength(255);
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.HasIndex(e => e.Name, "IX_Capabilities_Name");
            entity.HasIndex(e => e.Name, "UQ_Capabilities_Name").IsUnique();
        });

        modelBuilder.Entity<Pet>(entity =>
        {
            entity.Property(e => e.Species).HasMaxLength(15);
            entity.Property(e => e.Breed).HasMaxLength(15);
            entity.Property(e => e.Gender).HasMaxLength(10);
            entity.Property(e => e.IsNeutered).HasDefaultValue(false);
            entity.Property(e => e.Weight);
            entity.Property(e => e.MicrochipNumber).HasMaxLength(50);

            entity.HasOne(e => e.Owner)
                .WithMany(p => p.Pets)
                .HasForeignKey(e => e.OwnerId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("FK_Pets_OwnerId");

            entity.HasIndex(e => e.MicrochipNumber, "IX_Pets_MicrochipNumber").IsUnique();
            entity.HasIndex(e => e.OwnerId, "IX_Pets_OwnerId");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.Property(e => e.Name).HasMaxLength(50);

            entity.HasMany(d => d.Capabilities).WithMany(p => p.Roles)
                .UsingEntity("RolesCapabilities", j =>
                {
                    j.HasIndex("CapabilitiesId")
                    .HasDatabaseName("IX_RolesCapabilities_CapabilityId");
                });
            entity.HasIndex(e => e.Name, "IX_Roles_Name");
            entity.HasIndex(e => e.Name, "UQ_Roles_Name").IsUnique();
        });

        modelBuilder.Entity<Owner>(entity =>
        {
            entity.Property(e => e.PhoneNumber).HasMaxLength(50);
            entity.Property(e => e.VatNumber).HasMaxLength(9);

            entity.HasOne(d => d.User).WithOne(p => p.Owner)
                .HasForeignKey<Owner>(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade)   
                .HasConstraintName("FK_Owners_UserId");

            entity.HasIndex(e => e.VatNumber, "IX_Owners_VatNumber").IsUnique();
            entity.HasIndex(e => e.UserId, "IX_Owners_UserId").IsUnique();
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.Property(e => e.Email).HasMaxLength(50);
            entity.Property(e => e.Firstname).HasMaxLength(50);
            entity.Property(e => e.Lastname).HasMaxLength(50);
            entity.Property(e => e.Password).HasMaxLength(60);
            entity.Property(e => e.Username).HasMaxLength(50);

            entity.HasOne(d => d.Role).WithMany(p => p.Users)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK_Users_RoleId");

            entity.HasIndex(e => e.Email, "IX_Users_Email").IsUnique();
            entity.HasIndex(e => e.RoleId, "IX_Users_RoleId");
            entity.HasIndex(e => e.Username, "IX_Users_Username").IsUnique();
        });
    }
}
