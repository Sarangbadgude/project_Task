using Microsoft.EntityFrameworkCore;
using TaskBoard.Api.Data;
using TaskBoard.Api.DTOs;
using TaskBoard.Api.Models;
using TaskStatus = TaskBoard.Api.Models.TaskStatus;

namespace TaskBoard.Api.Services;

public interface IDashboardService
{
    Task<DashboardDto> GetAsync();
}

public class DashboardService(AppDbContext db) : IDashboardService
{
    public async Task<DashboardDto> GetAsync()
    {
        var now = DateTime.UtcNow;
        var tasks = await db.Tasks.ToListAsync();
        var byStatus = Enum.GetNames<TaskStatus>()
            .ToDictionary(s => s, s => tasks.Count(t => t.Status.ToString() == s));

        return new DashboardDto(
            await db.Projects.CountAsync(),
            tasks.Count,
            byStatus,
            tasks.Count(t => t.DueDate < now && t.Status != TaskStatus.Done),
            tasks.Count(t => t.DueDate >= now && t.DueDate <= now.AddDays(7) && t.Status != TaskStatus.Done)
        );
    }
}
