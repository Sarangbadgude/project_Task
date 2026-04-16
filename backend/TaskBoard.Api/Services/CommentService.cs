using Microsoft.EntityFrameworkCore;
using TaskBoard.Api.Data;
using TaskBoard.Api.DTOs;
using TaskBoard.Api.Models;

namespace TaskBoard.Api.Services;

public interface ICommentService
{
    Task<IEnumerable<CommentDto>> GetByTaskAsync(int taskId);
    Task<CommentDto> CreateAsync(int taskId, CreateCommentDto dto);
    Task<bool> DeleteAsync(int id);
}

public class CommentService(AppDbContext db) : ICommentService
{
    public async Task<IEnumerable<CommentDto>> GetByTaskAsync(int taskId) =>
        await db.Comments.Where(c => c.TaskId == taskId).OrderBy(c => c.CreatedAt)
            .Select(c => new CommentDto(c.Id, c.TaskId, c.Author, c.Body, c.CreatedAt)).ToListAsync();

    public async Task<CommentDto> CreateAsync(int taskId, CreateCommentDto dto)
    {
        var comment = new Comment { TaskId = taskId, Author = dto.Author, Body = dto.Body };
        db.Comments.Add(comment);
        await db.SaveChangesAsync();
        return new CommentDto(comment.Id, comment.TaskId, comment.Author, comment.Body, comment.CreatedAt);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var comment = await db.Comments.FindAsync(id);
        if (comment == null) return false;
        db.Comments.Remove(comment);
        await db.SaveChangesAsync();
        return true;
    }
}
