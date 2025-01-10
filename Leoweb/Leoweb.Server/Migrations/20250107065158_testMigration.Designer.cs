﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Leoweb.Server.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20250107065158_testMigration")]
    partial class testMigration
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "9.0.0")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("Leoweb.Server.Database.Models.BinaryFile", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<byte[]>("Data")
                        .IsRequired()
                        .HasColumnType("bytea");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("BinaryFile");
                });

            modelBuilder.Entity("Leoweb.Server.Database.Models.File", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int>("DataId")
                        .HasColumnType("integer");

                    b.Property<DateOnly>("Date")
                        .HasColumnType("date");

                    b.Property<string>("StudentId")
                        .HasColumnType("text");

                    b.Property<int>("Subject")
                        .HasColumnType("integer");

                    b.Property<int>("Year")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("DataId");

                    b.HasIndex("StudentId");

                    b.ToTable("Files");
                });

            modelBuilder.Entity("Leoweb.Server.Database.Models.Poll", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("VotesChoice")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("VotesChoice");

                    b.ToTable("Polls");
                });

            modelBuilder.Entity("Leoweb.Server.Database.Models.Student", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("text");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("PasswordHash")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("Students");
                });

            modelBuilder.Entity("Leoweb.Server.Database.Models.Vote", b =>
                {
                    b.Property<string>("Choice")
                        .HasColumnType("text")
                        .HasColumnOrder(2);

                    b.Property<string>("StudentId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Choice");

                    b.HasIndex("StudentId");

                    b.ToTable("Votes");
                });

            modelBuilder.Entity("Leoweb.Server.Database.Models.File", b =>
                {
                    b.HasOne("Leoweb.Server.Database.Models.BinaryFile", "Data")
                        .WithMany()
                        .HasForeignKey("DataId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Leoweb.Server.Database.Models.Student", "Student")
                        .WithMany()
                        .HasForeignKey("StudentId");

                    b.Navigation("Data");

                    b.Navigation("Student");
                });

            modelBuilder.Entity("Leoweb.Server.Database.Models.Poll", b =>
                {
                    b.HasOne("Leoweb.Server.Database.Models.Vote", "Votes")
                        .WithMany()
                        .HasForeignKey("VotesChoice")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Votes");
                });

            modelBuilder.Entity("Leoweb.Server.Database.Models.Vote", b =>
                {
                    b.HasOne("Leoweb.Server.Database.Models.Student", "Student")
                        .WithMany()
                        .HasForeignKey("StudentId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Student");
                });
#pragma warning restore 612, 618
        }
    }
}
