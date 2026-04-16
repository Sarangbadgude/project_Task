using System.ComponentModel.DataAnnotations;

namespace TaskBoard.Api.DTOs;

public record TaskDto(
    int Id, int ProjectId, string ProjectName,
    string Title, string? Description,
    string Priority, string Status,
    DateTime? DueDate, DateTime CreatedAt, DateTime UpdatedAt,
    int CommentCount
);

public record CreateTaskDto(
    [Required, MaxLength(150)] string Title,
    [MaxLength(1000)] string? Description,
    string Priority,
    string Status,
    DateTime? DueDate
);

public record UpdateTaskDto(
    [Required, MaxLength(150)] string Title,
    [MaxLength(1000)] string? Description,
    string Priority,
    string Status,
    DateTime? DueDate
);

public record TaskQueryParams(
    string? Status,
    string? Priority,
    string? SortBy,
    string? SortDir,
    int Page = 1,
    int PageSize = 10
);

public record PagedResult<T>(IEnumerable<T> Data, int Page, int PageSize, int TotalCount, int TotalPages);
