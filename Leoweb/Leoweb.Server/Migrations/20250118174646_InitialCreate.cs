using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Leoweb.Server.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_File_Student_StudentId",
                table: "File");

            migrationBuilder.DropIndex(
                name: "IX_File_StudentId",
                table: "File");

            migrationBuilder.DropColumn(
                name: "StudentId",
                table: "File");

            migrationBuilder.AddColumn<string>(
                name: "Student",
                table: "File",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Student",
                table: "File");

            migrationBuilder.AddColumn<string>(
                name: "StudentId",
                table: "File",
                type: "text",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_File_StudentId",
                table: "File",
                column: "StudentId");

            migrationBuilder.AddForeignKey(
                name: "FK_File_Student_StudentId",
                table: "File",
                column: "StudentId",
                principalTable: "Student",
                principalColumn: "Id");
        }
    }
}
