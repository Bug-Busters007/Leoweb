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
		Console.WriteLine(_connectionString);
	}

	protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
	{
		if (_connectionString == null)
		{
			throw new Exception("Connection string is null");
		}
		optionsBuilder.UseNpgsql(_connectionString);
	}

	public DbSet<Student> Student { get; set; } = null!;
	public DbSet<Leoweb.Server.Database.Models.File> File { get; set; } = null!;
	public DbSet<BinaryFile> BinaryFile { get; set; } = null!;
	public DbSet<Poll> Poll { get; set; } = null!;
	public DbSet<Vote> Vote { get; set; } = null!;
}