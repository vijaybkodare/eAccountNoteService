using eAccountNoteService.Models;
using eAccountNoteService.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace eAccountNoteService.Controllers;

[ApiController]
[Route("[controller]")]
public class LoadFileController : ControllerBase
{
    private readonly ImageTextExtractorService _imageService;
    private readonly ILogger<LoadFileController> _logger;

    public LoadFileController(ImageTextExtractorService imageService, ILogger<LoadFileController> logger)
    {
        _imageService = imageService;
        _logger = logger;
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
            _logger.LogWarning("LoadImage called with no file uploaded.");
            return Ok(new ServerResponse { IsSuccess = false, Error = "No file uploaded." });
        }

        if (string.IsNullOrEmpty(file.ContentType) || !file.ContentType.Contains("image"))
        {
            _logger.LogWarning("LoadImage received non-image file. ContentType={ContentType}, FileName={FileName}", file.ContentType, file.FileName);
            return Ok(new ServerResponse { IsSuccess = false, Error = "Uploaded file is not an image." });
        }

        var transDetail = await _imageService.ExtractTransDetailFromImageViaPythonAsync(file);

        _logger.LogInformation("Successfully extracted transaction details from image. FileName={FileName}, TransactionId={TransactionId}",
            file.FileName,
            transDetail.TransactionId);

        return Ok(new ServerResponse
        {
            IsSuccess = true,
            Data = transDetail
        });
    }
}
