using DotNetEnv;
using Leoweb.Server.Database.Models;
using Microsoft.EntityFrameworkCore;

public class ApplicationDbContext : DbContext
{
	private string? _connectionString;

	public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
		: base(options)
	{
		// in Leoweb.Server eine .env Datei erstellen und den DB String einfügen
		// DB_CONNECTION_STRING=string ohne ""
		Env.Load();
		_connectionString = Environment.GetEnvironmentVariable("DB_CONNECTION_STRING");
	}

	protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
	{
		optionsBuilder.UseNpgsql(_connectionString);
	}

	public DbSet<Student> Students { get; set; } = null!;
	public DbSet<Leoweb.Server.Database.Models.File> Files { get; set; } = null!;
	public DbSet<BinaryFile> BinaryFiles { get; set; } = null!;
	public DbSet<Poll> Polls { get; set; } = null!;
	public DbSet<Vote> Votes { get; set; } = null!;
}