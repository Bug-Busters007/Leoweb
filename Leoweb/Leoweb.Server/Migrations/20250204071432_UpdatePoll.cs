using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Leoweb.Server.Migrations
{
    /// <inheritdoc />
    public partial class UpdatePoll : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Poll_Vote_VotesChoice",
                table: "Poll");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Vote",
                table: "Vote");

            migrationBuilder.DropIndex(
                name: "IX_Poll_VotesChoice",
                table: "Poll");

            migrationBuilder.RenameColumn(
                name: "VotesChoice",
                table: "Poll",
                newName: "Headline");

            migrationBuilder.AlterColumn<string>(
                name: "Choice",
                table: "Vote",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text")
                .OldAnnotation("Relational:ColumnOrder", 2);

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "Vote",
                type: "integer",
                nullable: false,
                defaultValue: 0)
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddColumn<int>(
                name: "PollId",
                table: "Vote",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "Close",
                table: "Poll",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "Created",
                table: "Poll",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "Release",
                table: "Poll",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddPrimaryKey(
                name: "PK_Vote",
                table: "Vote",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "Choice",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PollId = table.Column<int>(type: "integer", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Choice", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Choice_Poll_PollId",
                        column: x => x.PollId,
                        principalTable: "Poll",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Vote_PollId",
                table: "Vote",
                column: "PollId");

            migrationBuilder.CreateIndex(
                name: "IX_Choice_PollId",
                table: "Choice",
                column: "PollId");

            migrationBuilder.AddForeignKey(
                name: "FK_Vote_Poll_PollId",
                table: "Vote",
                column: "PollId",
                principalTable: "Poll",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Vote_Poll_PollId",
                table: "Vote");

            migrationBuilder.DropTable(
                name: "Choice");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Vote",
                table: "Vote");

            migrationBuilder.DropIndex(
                name: "IX_Vote_PollId",
                table: "Vote");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "Vote");

            migrationBuilder.DropColumn(
                name: "PollId",
                table: "Vote");

            migrationBuilder.DropColumn(
                name: "Close",
                table: "Poll");

            migrationBuilder.DropColumn(
                name: "Created",
                table: "Poll");

            migrationBuilder.DropColumn(
                name: "Release",
                table: "Poll");

            migrationBuilder.RenameColumn(
                name: "Headline",
                table: "Poll",
                newName: "VotesChoice");

            migrationBuilder.AlterColumn<string>(
                name: "Choice",
                table: "Vote",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text")
                .Annotation("Relational:ColumnOrder", 2);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Vote",
                table: "Vote",
                column: "Choice");

            migrationBuilder.CreateIndex(
                name: "IX_Poll_VotesChoice",
                table: "Poll",
                column: "VotesChoice");

            migrationBuilder.AddForeignKey(
                name: "FK_Poll_Vote_VotesChoice",
                table: "Poll",
                column: "VotesChoice",
                principalTable: "Vote",
                principalColumn: "Choice",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
