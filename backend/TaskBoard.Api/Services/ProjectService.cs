using Microsoft.EntityFrameworkCore;
using TaskBoard.Api.Data;
using TaskBoard.Api.DTOs;
using TaskBoard.Api.Models;

namespace TaskBoard.Api.Services;

public interface IProjectService
{
    Task<IEnumerable<ProjectDto>> GetAllAsync();
    Task<ProjectDto?> GetByIdAsync(int id);
    Task<ProjectDto> CreateAsync(CreateProjectDto dto);
    Task<ProjectDto?> UpdateAsync(int id, UpdateProjectDto dto);
    Task<bool> DeleteAsync(int id);
    Task<bool> ExistsByNameAsync(string name, int? excludeId = null);
}

public class ProjectService(AppDbContext db) : IProjectService
{
    public async Task<IEnumerable<ProjectDto>> GetAllAsync()
    {
        var projects = await db.Projects.Include(p => p.Tasks).ToListAsync();
        return projects.Select(ToDto);
    }

    public async Task<ProjectDto?> GetByIdAsync(int id)
    {
        var p = await db.Projects.Include(p => p.Tasks).FirstOrDefaultAsync(p => p.Id == id);
        return p == null ? null : ToDto(p);
    }

    private static ProjectDto ToDto(Project p)
    {
        var tasks = p.Tasks.ToList();
        var byStatus = tasks
            .GroupBy(t => t.Status.ToString())
            .ToDictionary(g => g.Key, g => g.Count());
        return new(p.Id, p.Name, p.Description, p.CreatedAt, tasks.Count, byStatus);
    }

    public async Task<ProjectDto> CreateAsync(CreateProjectDto dto)
    {
        var project = new Project { Name = dto.Name, Description = dto.Description };
        db.Projects.Add(project);
        await db.SaveChangesAsync();
        return new ProjectDto(project.Id, project.Name, project.Description, project.CreatedAt, 0, new());
    }

    public async Task<ProjectDto?> UpdateAsync(int id, UpdateProjectDto dto)
    {
        var project = await db.Projects.FindAsync(id);
        if (project == null) return null;
        project.Name = dto.Name;
        project.Description = dto.Description;
        await db.SaveChangesAsync();
        return await GetByIdAsync(id);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var project = await db.Projects.FindAsync(id);
        if (project == null) return false;
        db.Projects.Remove(project);
        await db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ExistsByNameAsync(string name, int? excludeId = null)
    {
        return await db.Projects.AnyAsync(p => p.Name == name && (excludeId == null || p.Id != excludeId));
    }
}
