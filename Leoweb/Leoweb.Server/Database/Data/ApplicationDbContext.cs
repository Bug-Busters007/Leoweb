using Leoweb.Server.Database.Models;
using Microsoft.EntityFrameworkCore;

public class ApplicationDbContext : DbContext
{
	public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
		: base(options)
	{
	}

	public DbSet<Student> Student { get; set; } = null!;
	public DbSet<Leoweb.Server.Database.Models.File> File { get; set; } = null!;
	public DbSet<BinaryFile> BinaryFile { get; set; } = null!;
	public DbSet<Poll> Poll { get; set; } = null!;
	public DbSet<Vote> Vote { get; set; } = null!;
	public DbSet<Choice> Choice { get; set; }
	public DbSet<PollYear> PollYear { get; set; }
	public DbSet<PollBranch> PollBranch { get; set; }
	public DbSet<UserFileLike> UserFileLike { get; set; }
	public DbSet<StudentBan> StudentBan { get; set; }
}