namespace TaskBoard.Api.Models;

public enum Priority { Low, Medium, High, Critical }
public enum TaskStatus { Todo, InProgress, Review, Done }

public class TaskItem
{
    public int Id { get; set; }
    public int ProjectId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public Priority Priority { get; set; } = Priority.Medium;
    public TaskStatus Status { get; set; } = TaskStatus.Todo;
    public DateTime? DueDate { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public Project Project { get; set; } = null!;
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
}
