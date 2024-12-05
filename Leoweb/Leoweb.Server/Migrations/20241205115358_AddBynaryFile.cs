using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Leoweb.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddBynaryFile : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Content",
                table: "Files");

            migrationBuilder.AddColumn<int>(
                name: "DataId",
                table: "Files",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Files_DataId",
                table: "Files",
                column: "DataId");

            migrationBuilder.AddForeignKey(
                name: "FK_Files_Files_DataId",
                table: "Files",
                column: "DataId",
                principalTable: "Files",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Files_Files_DataId",
                table: "Files");

            migrationBuilder.DropIndex(
                name: "IX_Files_DataId",
                table: "Files");

            migrationBuilder.DropColumn(
                name: "DataId",
                table: "Files");

            migrationBuilder.AddColumn<string>(
                name: "Content",
                table: "Files",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
