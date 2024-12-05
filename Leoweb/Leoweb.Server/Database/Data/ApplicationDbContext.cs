using DotNetEnv;
using Leoweb.Server.Database.Models;
using Microsoft.EntityFrameworkCore;

public class ApplicationDbContext : DbContext
{
	public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
	}

	protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
	{
	}

	public DbSet<Student> Students { get; set; } = null!;
	public DbSet<Leoweb.Server.Database.Models.File> Files { get; set; } = null!;
	public DbSet<BinaryFile> BinaryFiles { get; set; } = null!;
	public DbSet<Poll> Polls { get; set; } = null!;
	public DbSet<Vote> Votes { get; set; } = null!;
}