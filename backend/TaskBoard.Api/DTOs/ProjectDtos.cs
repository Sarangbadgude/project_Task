using System.ComponentModel.DataAnnotations;

namespace TaskBoard.Api.DTOs;

public record ProjectDto(int Id, string Name, string? Description, DateTime CreatedAt, int TaskCount, Dictionary<string, int> TasksByStatus);

public record CreateProjectDto(
    [Required, MaxLength(100)] string Name,
    [MaxLength(300)] string? Description
);

public record UpdateProjectDto(
    [Required, MaxLength(100)] string Name,
    [MaxLength(300)] string? Description
);
