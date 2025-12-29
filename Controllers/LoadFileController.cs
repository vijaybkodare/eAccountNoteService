using eAccountNoteService.Models;
using eAccountNoteService.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace eAccountNoteService.Controllers;

[ApiController]
[Route("[controller]")]
public class LoadFileController : ControllerBase
{
    private readonly ImageTextExtractorService _imageService;

    public LoadFileController(ImageTextExtractorService imageService)
    {
        _imageService = imageService;
    }

    // GET: api/loadfile/hello
    [HttpGet("hello")]
    public IActionResult Hello()
    {
        return Ok("Hi hello");
    }

    // POST: api/loadfile/loadimage
    // Accepts an uploaded image file and extracts transaction details from it.
    // NOTE: We omit explicit [FromForm] on IFormFile to keep Swagger generation happy.
    [HttpPost("loadimage")]
    public async Task<ActionResult<ServerResponse>> LoadImage(IFormFile? file)
    {
        if (file == null)
        {
            return Ok(new ServerResponse { IsSuccess = false, Error = "No file uploaded." });
        }

        if (string.IsNullOrEmpty(file.ContentType) || !file.ContentType.Contains("image"))
        {
            return Ok(new ServerResponse { IsSuccess = false, Error = "Uploaded file is not an image." });
        }

        try
        {
            var transDetail = await _imageService.ExtractTransDetailFromImageAsync(file);
            return Ok(new ServerResponse
            {
                IsSuccess = true,
                Data = transDetail
            });
        }
        catch (Exception ex)
        {
            return Ok(new ServerResponse
            {
                IsSuccess = false,
                Error = ex.Message
            });
        }
    }
}
