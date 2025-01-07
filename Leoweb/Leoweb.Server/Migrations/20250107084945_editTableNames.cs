using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Leoweb.Server.Migrations
{
    /// <inheritdoc />
    public partial class editTableNames : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Files_BinaryFile_DataId",
                table: "Files");

            migrationBuilder.DropForeignKey(
                name: "FK_Files_Students_StudentId",
                table: "Files");

            migrationBuilder.DropForeignKey(
                name: "FK_Polls_Votes_VotesChoice",
                table: "Polls");

            migrationBuilder.DropForeignKey(
                name: "FK_Votes_Students_StudentId",
                table: "Votes");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Votes",
                table: "Votes");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Students",
                table: "Students");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Polls",
                table: "Polls");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Files",
                table: "Files");

            migrationBuilder.DropColumn(
                name: "Branch",
                table: "Files");

            migrationBuilder.RenameTable(
                name: "Votes",
                newName: "Vote");

            migrationBuilder.RenameTable(
                name: "Students",
                newName: "Student");

            migrationBuilder.RenameTable(
                name: "Polls",
                newName: "Poll");

            migrationBuilder.RenameTable(
                name: "Files",
                newName: "File");

            migrationBuilder.RenameIndex(
                name: "IX_Votes_StudentId",
                table: "Vote",
                newName: "IX_Vote_StudentId");

            migrationBuilder.RenameIndex(
                name: "IX_Polls_VotesChoice",
                table: "Poll",
                newName: "IX_Poll_VotesChoice");

            migrationBuilder.RenameIndex(
                name: "IX_Files_StudentId",
                table: "File",
                newName: "IX_File_StudentId");

            migrationBuilder.RenameIndex(
                name: "IX_Files_DataId",
                table: "File",
                newName: "IX_File_DataId");

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Student",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PasswordHash",
                table: "Student",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Vote",
                table: "Vote",
                column: "Choice");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Student",
                table: "Student",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Poll",
                table: "Poll",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_File",
                table: "File",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_File_BinaryFile_DataId",
                table: "File",
                column: "DataId",
                principalTable: "BinaryFile",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_File_Student_StudentId",
                table: "File",
                column: "StudentId",
                principalTable: "Student",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Poll_Vote_VotesChoice",
                table: "Poll",
                column: "VotesChoice",
                principalTable: "Vote",
                principalColumn: "Choice",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Vote_Student_StudentId",
                table: "Vote",
                column: "StudentId",
                principalTable: "Student",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_File_BinaryFile_DataId",
                table: "File");

            migrationBuilder.DropForeignKey(
                name: "FK_File_Student_StudentId",
                table: "File");

            migrationBuilder.DropForeignKey(
                name: "FK_Poll_Vote_VotesChoice",
                table: "Poll");

            migrationBuilder.DropForeignKey(
                name: "FK_Vote_Student_StudentId",
                table: "Vote");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Vote",
                table: "Vote");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Student",
                table: "Student");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Poll",
                table: "Poll");

            migrationBuilder.DropPrimaryKey(
                name: "PK_File",
                table: "File");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "Student");

            migrationBuilder.DropColumn(
                name: "PasswordHash",
                table: "Student");

            migrationBuilder.RenameTable(
                name: "Vote",
                newName: "Votes");

            migrationBuilder.RenameTable(
                name: "Student",
                newName: "Students");

            migrationBuilder.RenameTable(
                name: "Poll",
                newName: "Polls");

            migrationBuilder.RenameTable(
                name: "File",
                newName: "Files");

            migrationBuilder.RenameIndex(
                name: "IX_Vote_StudentId",
                table: "Votes",
                newName: "IX_Votes_StudentId");

            migrationBuilder.RenameIndex(
                name: "IX_Poll_VotesChoice",
                table: "Polls",
                newName: "IX_Polls_VotesChoice");

            migrationBuilder.RenameIndex(
                name: "IX_File_StudentId",
                table: "Files",
                newName: "IX_Files_StudentId");

            migrationBuilder.RenameIndex(
                name: "IX_File_DataId",
                table: "Files",
                newName: "IX_Files_DataId");

            migrationBuilder.AddColumn<int>(
                name: "Branch",
                table: "Files",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Votes",
                table: "Votes",
                column: "Choice");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Students",
                table: "Students",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Polls",
                table: "Polls",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Files",
                table: "Files",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Files_BinaryFile_DataId",
                table: "Files",
                column: "DataId",
                principalTable: "BinaryFile",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Files_Students_StudentId",
                table: "Files",
                column: "StudentId",
                principalTable: "Students",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Polls_Votes_VotesChoice",
                table: "Polls",
                column: "VotesChoice",
                principalTable: "Votes",
                principalColumn: "Choice",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Votes_Students_StudentId",
                table: "Votes",
                column: "StudentId",
                principalTable: "Students",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
