using Microsoft.EntityFrameworkCore;
using TaskBoard.Api.Models;
using TaskStatus = TaskBoard.Api.Models.TaskStatus;

namespace TaskBoard.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Project> Projects => Set<Project>();
    public DbSet<TaskItem> Tasks => Set<TaskItem>();
    public DbSet<Comment> Comments => Set<Comment>();

    protected override void OnModelCreating(ModelBuilder mb)
    {
        mb.Entity<Project>(e =>
        {
            e.HasIndex(p => p.Name).IsUnique();
            e.Property(p => p.Name).HasMaxLength(100).IsRequired();
            e.Property(p => p.Description).HasMaxLength(300);
        });

        mb.Entity<TaskItem>(e =>
        {
            e.Property(t => t.Title).HasMaxLength(150).IsRequired();
            e.Property(t => t.Description).HasMaxLength(1000);
            e.Property(t => t.Priority).HasConversion<string>();
            e.Property(t => t.Status).HasConversion<string>();
            e.HasOne(t => t.Project).WithMany(p => p.Tasks)
                .HasForeignKey(t => t.ProjectId).OnDelete(DeleteBehavior.Cascade);
            e.HasIndex(t => t.ProjectId);
            e.HasIndex(t => t.Status);
            e.HasIndex(t => t.Priority);
        });

        mb.Entity<Comment>(e =>
        {
            e.Property(c => c.Author).HasMaxLength(50).IsRequired();
            e.Property(c => c.Body).HasMaxLength(500).IsRequired();
            e.HasOne(c => c.Task).WithMany(t => t.Comments)
                .HasForeignKey(c => c.TaskId).OnDelete(DeleteBehavior.Cascade);
        });

        SeedData.Seed(mb);
    }
}
