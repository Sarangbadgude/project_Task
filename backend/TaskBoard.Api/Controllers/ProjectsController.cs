using Microsoft.AspNetCore.Mvc;
using TaskBoard.Api.DTOs;
using TaskBoard.Api.Services;

namespace TaskBoard.Api.Controllers;

[ApiController]
[Route("api/projects")]
public class ProjectsController(IProjectService svc) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await svc.GetAllAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var project = await svc.GetByIdAsync(id);
        return project == null ? NotFound() : Ok(project);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateProjectDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        if (await svc.ExistsByNameAsync(dto.Name))
            return Conflict(new { errors = new { name = new[] { "A project with this name already exists." } } });
        var created = await svc.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateProjectDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        if (await svc.ExistsByNameAsync(dto.Name, id))
            return Conflict(new { errors = new { name = new[] { "A project with this name already exists." } } });
        var updated = await svc.UpdateAsync(id, dto);
        return updated == null ? NotFound() : Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id) =>
        await svc.DeleteAsync(id) ? NoContent() : NotFound();
}
