using Microsoft.AspNetCore.Mvc;
using TaskBoard.Api.DTOs;
using TaskBoard.Api.Services;

namespace TaskBoard.Api.Controllers;

[ApiController]
public class TasksController(ITaskService taskSvc, IProjectService projectSvc) : ControllerBase
{
    [HttpGet("api/projects/{projectId}/tasks")]
    public async Task<IActionResult> GetByProject(int projectId, [FromQuery] TaskQueryParams q)
    {
        if (await projectSvc.GetByIdAsync(projectId) == null) return NotFound();
        return Ok(await taskSvc.GetByProjectAsync(projectId, q));
    }

    [HttpPost("api/projects/{projectId}/tasks")]
    public async Task<IActionResult> Create(int projectId, CreateTaskDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        if (await projectSvc.GetByIdAsync(projectId) == null) return NotFound();
        var created = await taskSvc.CreateAsync(projectId, dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpGet("api/tasks/{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var task = await taskSvc.GetByIdAsync(id);
        return task == null ? NotFound() : Ok(task);
    }

    [HttpPut("api/tasks/{id}")]
    public async Task<IActionResult> Update(int id, UpdateTaskDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var updated = await taskSvc.UpdateAsync(id, dto);
        return updated == null ? NotFound() : Ok(updated);
    }

    [HttpDelete("api/tasks/{id}")]
    public async Task<IActionResult> Delete(int id) =>
        await taskSvc.DeleteAsync(id) ? NoContent() : NotFound();
}
