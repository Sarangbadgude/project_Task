using Microsoft.AspNetCore.Mvc;
using TaskBoard.Api.DTOs;
using TaskBoard.Api.Services;

namespace TaskBoard.Api.Controllers;

[ApiController]
public class CommentsController(ICommentService svc) : ControllerBase
{
    [HttpGet("api/tasks/{taskId}/comments")]
    public async Task<IActionResult> GetByTask(int taskId) =>
        Ok(await svc.GetByTaskAsync(taskId));

    [HttpPost("api/tasks/{taskId}/comments")]
    public async Task<IActionResult> Create(int taskId, CreateCommentDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var created = await svc.CreateAsync(taskId, dto);
        return StatusCode(201, created);
    }

    [HttpDelete("api/comments/{id}")]
    public async Task<IActionResult> Delete(int id) =>
        await svc.DeleteAsync(id) ? NoContent() : NotFound();
}
