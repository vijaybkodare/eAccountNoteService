namespace eAccountNoteService.Models;

public class ServerResponse
{
    public bool IsSuccess { get; set; }
    public string Error { get; set; } = string.Empty;
    public object? Data { get; set; }
}
