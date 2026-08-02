using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyVetApp.Migrations
{
    /// <inheritdoc />
    public partial class AddBaseEntityAndFilteredIndex : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "VatNumber",
                table: "Owners",
                newName: "ΑΦΜ");

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                table: "Pets",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "InsertedAt",
                table: "Pets",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "Pets",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifiedAt",
                table: "Pets",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
            
            migrationBuilder.DropIndex(
                name: "IX_Pets_MicrochipNumber",
                table: "Pets");

            migrationBuilder.CreateIndex(
                name: "IX_Pets_MicrochipNumber",
                table: "Pets",
                column: "MicrochipNumber",
                unique: true,
                filter: "[MicrochipNumber] IS NOT NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Pets_MicrochipNumber",
                table: "Pets");

            migrationBuilder.CreateIndex(
                name: "IX_Pets_MicrochipNumber",
                table: "Pets",
                column: "MicrochipNumber");
            
            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "Pets");

            migrationBuilder.DropColumn(
                name: "InsertedAt",
                table: "Pets");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Pets");

            migrationBuilder.DropColumn(
                name: "ModifiedAt",
                table: "Pets");

            migrationBuilder.RenameColumn(
                name: "ΑΦΜ",
                table: "Owners",
                newName: "VatNumber");

        }
    }
}
