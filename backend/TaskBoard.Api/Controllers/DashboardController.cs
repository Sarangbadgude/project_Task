using Microsoft.AspNetCore.Mvc;
using TaskBoard.Api.Services;

namespace TaskBoard.Api.Controllers;

[ApiController]
[Route("api/dashboard")]
public class DashboardController(IDashboardService svc) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get() => Ok(await svc.GetAsync());
}
