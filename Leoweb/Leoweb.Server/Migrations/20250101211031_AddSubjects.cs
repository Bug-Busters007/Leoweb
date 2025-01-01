using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Leoweb.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddSubjects : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Files_Files_DataId",
                table: "Files");

            migrationBuilder.DropPrimaryKey(
                name: "PK_BinaryFiles",
                table: "BinaryFiles");

            migrationBuilder.RenameTable(
                name: "BinaryFiles",
                newName: "BinaryFile");

            migrationBuilder.AddColumn<int>(
                name: "Branch",
                table: "Files",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_BinaryFile",
                table: "BinaryFile",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Files_BinaryFile_DataId",
                table: "Files",
                column: "DataId",
                principalTable: "BinaryFile",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Files_BinaryFile_DataId",
                table: "Files");

            migrationBuilder.DropPrimaryKey(
                name: "PK_BinaryFile",
                table: "BinaryFile");

            migrationBuilder.DropColumn(
                name: "Branch",
                table: "Files");

            migrationBuilder.RenameTable(
                name: "BinaryFile",
                newName: "BinaryFiles");

            migrationBuilder.AddPrimaryKey(
                name: "PK_BinaryFiles",
                table: "BinaryFiles",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Files_Files_DataId",
                table: "Files",
                column: "DataId",
                principalTable: "Files",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
