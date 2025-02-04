using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Leoweb.Server.Migrations
{
    /// <inheritdoc />
    public partial class UpdateStudent : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string[]>(
                name: "Branch",
                table: "Poll",
                type: "text[]",
                nullable: false,
                defaultValue: new string[0]);

            migrationBuilder.AddColumn<int[]>(
                name: "Year",
                table: "Poll",
                type: "integer[]",
                nullable: false,
                defaultValue: new int[0]);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Branch",
                table: "Poll");

            migrationBuilder.DropColumn(
                name: "Year",
                table: "Poll");
        }
    }
}
