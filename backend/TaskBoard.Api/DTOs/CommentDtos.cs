using System.ComponentModel.DataAnnotations;

namespace TaskBoard.Api.DTOs;

public record CommentDto(int Id, int TaskId, string Author, string Body, DateTime CreatedAt);

public record CreateCommentDto(
    [Required, MaxLength(50)] string Author,
    [Required, MaxLength(500)] string Body
);

public record DashboardDto(
    int TotalProjects,
    int TotalTasks,
    Dictionary<string, int> TasksByStatus,
    int OverdueTasks,
    int DueWithin7Days
);
