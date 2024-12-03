using Leoweb.Server.Database.Models;
using Microsoft.EntityFrameworkCore;

public class ApplicationDbContext : DbContext
{
	//private const string connectionString = "Server=tcp:sqlservervonmanuel.database.windows.net,1433;Initial Catalog=LeowebDB;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;Authentication=\"Active Directory Default\"";
	private const string connectionString = "Host=ionas999.at;Port=9234;Database=leoweb;Username=leoweb;Password=123";

	public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    { }

	protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
	{
		optionsBuilder.UseNpgsql(connectionString);
	}

	public DbSet<Student> Students { get; set; } = null!;
	public DbSet<Leoweb.Server.Database.Models.File> Files { get; set; } = null!;
	public DbSet<Poll> Polls { get; set; } = null!;
	public DbSet<Vote> Votes { get; set; } = null!;
}