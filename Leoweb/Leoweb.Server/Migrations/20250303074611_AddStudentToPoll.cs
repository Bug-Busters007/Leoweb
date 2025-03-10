using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Leoweb.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddStudentToPoll : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            /*
            migrationBuilder.AddColumn<string>(
                name: "StudentId",
                table: "Poll",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Poll_StudentId",
                table: "Poll",
                column: "StudentId");

            migrationBuilder.AddForeignKey(
                name: "FK_Poll_Student_StudentId",
                table: "Poll",
                column: "StudentId",
                principalTable: "Student",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
                
                */
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            /*
            migrationBuilder.DropForeignKey(
                name: "FK_Poll_Student_StudentId",
                table: "Poll");

            migrationBuilder.DropIndex(
                name: "IX_Poll_StudentId",
                table: "Poll");

            migrationBuilder.DropColumn(
                name: "StudentId",
                table: "Poll");
                */
        }
    }
}
