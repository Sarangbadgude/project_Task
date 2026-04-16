using Microsoft.EntityFrameworkCore;
using TaskBoard.Api.Data;
using TaskBoard.Api.DTOs;
using TaskBoard.Api.Models;
using TaskStatus = TaskBoard.Api.Models.TaskStatus;

namespace TaskBoard.Api.Services;

public interface ITaskService
{
    Task<PagedResult<TaskDto>> GetByProjectAsync(int projectId, TaskQueryParams q);
    Task<TaskDto?> GetByIdAsync(int id);
    Task<TaskDto> CreateAsync(int projectId, CreateTaskDto dto);
    Task<TaskDto?> UpdateAsync(int id, UpdateTaskDto dto);
    Task<bool> DeleteAsync(int id);
}

public class TaskService(AppDbContext db) : ITaskService
{
    public async Task<PagedResult<TaskDto>> GetByProjectAsync(int projectId, TaskQueryParams q)
    {
        var query = db.Tasks.Include(t => t.Project).Include(t => t.Comments)
            .Where(t => t.ProjectId == projectId);

        if (!string.IsNullOrEmpty(q.Status) && Enum.TryParse<TaskStatus>(q.Status, out var status))
            query = query.Where(t => t.Status == status);

        if (!string.IsNullOrEmpty(q.Priority) && Enum.TryParse<Priority>(q.Priority, out var priority))
            query = query.Where(t => t.Priority == priority);

        query = (q.SortBy?.ToLower(), q.SortDir?.ToLower()) switch
        {
            ("duedate", "desc") => query.OrderByDescending(t => t.DueDate),
            ("duedate", _) => query.OrderBy(t => t.DueDate),
            ("priority", "desc") => query.OrderByDescending(t => t.Priority),
            ("priority", _) => query.OrderBy(t => t.Priority),
            ("createdat", "desc") => query.OrderByDescending(t => t.CreatedAt),
            _ => query.OrderBy(t => t.CreatedAt)
        };

        var total = await query.CountAsync();
        var page = Math.Max(1, q.Page);
        var pageSize = Math.Clamp(q.PageSize, 1, 100);
        var items = await query.Skip((page - 1) * pageSize).Take(pageSize)
            .Select(t => ToDto(t)).ToListAsync();

        return new PagedResult<TaskDto>(items, page, pageSize, total, (int)Math.Ceiling(total / (double)pageSize));
    }

    public async Task<TaskDto?> GetByIdAsync(int id)
    {
        var t = await db.Tasks.Include(t => t.Project).Include(t => t.Comments).FirstOrDefaultAsync(t => t.Id == id);
        return t == null ? null : ToDto(t);
    }

    public async Task<TaskDto> CreateAsync(int projectId, CreateTaskDto dto)
    {
        var task = new TaskItem
        {
            ProjectId = projectId,
            Title = dto.Title,
            Description = dto.Description,
            Priority = Enum.Parse<Priority>(dto.Priority),
            Status = Enum.Parse<TaskStatus>(dto.Status),
            DueDate = dto.DueDate
        };
        db.Tasks.Add(task);
        await db.SaveChangesAsync();
        return (await GetByIdAsync(task.Id))!;
    }

    public async Task<TaskDto?> UpdateAsync(int id, UpdateTaskDto dto)
    {
        var task = await db.Tasks.FindAsync(id);
        if (task == null) return null;
        task.Title = dto.Title;
        task.Description = dto.Description;
        task.Priority = Enum.Parse<Priority>(dto.Priority);
        task.Status = Enum.Parse<TaskStatus>(dto.Status);
        task.DueDate = dto.DueDate;
        task.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
        return await GetByIdAsync(id);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var task = await db.Tasks.FindAsync(id);
        if (task == null) return false;
        db.Tasks.Remove(task);
        await db.SaveChangesAsync();
        return true;
    }

    private static TaskDto ToDto(TaskItem t) => new(
        t.Id, t.ProjectId, t.Project?.Name ?? "",
        t.Title, t.Description,
        t.Priority.ToString(), t.Status.ToString(),
        t.DueDate, t.CreatedAt, t.UpdatedAt,
        t.Comments?.Count ?? 0
    );
}
