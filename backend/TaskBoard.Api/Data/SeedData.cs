using Microsoft.EntityFrameworkCore;
using TaskBoard.Api.Models;
using TaskStatus = TaskBoard.Api.Models.TaskStatus;

namespace TaskBoard.Api.Data;

public static class SeedData
{
    public static void Seed(ModelBuilder mb)
    {
        mb.Entity<Project>().HasData(
            new Project { Id = 1, Name = "Website Redesign", Description = "Redesign the company website", CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            new Project { Id = 2, Name = "Mobile App", Description = "Build iOS and Android app", CreatedAt = new DateTime(2024, 1, 5, 0, 0, 0, DateTimeKind.Utc) }
        );

        mb.Entity<TaskItem>().HasData(
            new TaskItem { Id = 1, ProjectId = 1, Title = "Design mockups", Priority = Priority.High, Status = TaskStatus.Done, CreatedAt = new DateTime(2024, 1, 2, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2024, 1, 2, 0, 0, 0, DateTimeKind.Utc), DueDate = new DateTime(2024, 2, 1, 0, 0, 0, DateTimeKind.Utc) },
            new TaskItem { Id = 2, ProjectId = 1, Title = "Implement homepage", Priority = Priority.High, Status = TaskStatus.InProgress, CreatedAt = new DateTime(2024, 1, 3, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2024, 1, 3, 0, 0, 0, DateTimeKind.Utc), DueDate = DateTime.UtcNow.AddDays(3) },
            new TaskItem { Id = 3, ProjectId = 1, Title = "SEO optimization", Priority = Priority.Medium, Status = TaskStatus.Todo, CreatedAt = new DateTime(2024, 1, 4, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2024, 1, 4, 0, 0, 0, DateTimeKind.Utc), DueDate = DateTime.UtcNow.AddDays(-2) },
            new TaskItem { Id = 4, ProjectId = 2, Title = "Setup React Native", Priority = Priority.Critical, Status = TaskStatus.Done, CreatedAt = new DateTime(2024, 1, 6, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2024, 1, 6, 0, 0, 0, DateTimeKind.Utc) },
            new TaskItem { Id = 5, ProjectId = 2, Title = "Auth screens", Priority = Priority.High, Status = TaskStatus.InProgress, CreatedAt = new DateTime(2024, 1, 7, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2024, 1, 7, 0, 0, 0, DateTimeKind.Utc), DueDate = DateTime.UtcNow.AddDays(5) },
            new TaskItem { Id = 6, ProjectId = 2, Title = "Push notifications", Priority = Priority.Low, Status = TaskStatus.Todo, CreatedAt = new DateTime(2024, 1, 8, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2024, 1, 8, 0, 0, 0, DateTimeKind.Utc) }
        );

        mb.Entity<Comment>().HasData(
            new Comment { Id = 1, TaskId = 1, Author = "Alice", Body = "Mockups approved by stakeholders.", CreatedAt = new DateTime(2024, 1, 10, 0, 0, 0, DateTimeKind.Utc) },
            new Comment { Id = 2, TaskId = 2, Author = "Bob", Body = "Working on the hero section.", CreatedAt = new DateTime(2024, 1, 11, 0, 0, 0, DateTimeKind.Utc) },
            new Comment { Id = 3, TaskId = 5, Author = "Carol", Body = "Login screen done, working on signup.", CreatedAt = new DateTime(2024, 1, 12, 0, 0, 0, DateTimeKind.Utc) }
        );
    }
}
