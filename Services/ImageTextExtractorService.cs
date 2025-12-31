using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using Tesseract;
using eAccountNoteService.Models;
using eAccountNoteService.Utility;

namespace eAccountNoteService.Services;

public class ImageTextExtractorService
{
    private readonly string _solPath;
    private readonly TransNoEvaluator _transNoEvaluator;
    private readonly ILogger<ImageTextExtractorService> _logger;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly string _pythonServiceUrl;

    public ImageTextExtractorService(IConfiguration configuration, TransNoEvaluator transNoEvaluator, ILogger<ImageTextExtractorService> logger, IHttpClientFactory httpClientFactory)
    {
        var s = configuration.GetSection("AppSettings");
        _solPath = s["Tesseract_SolPath"] ?? string.Empty;
        _transNoEvaluator = transNoEvaluator;
        _logger = logger;
        _httpClientFactory = httpClientFactory;
        _pythonServiceUrl = s["ImageTextExtractorUrl"] ?? string.Empty;
    }

    public async Task<TransDetail> ExtractTransDetailFromImageAsync(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            throw new ArgumentException("File is empty.");
        }

        if (string.IsNullOrWhiteSpace(_solPath))
        {
            throw new InvalidOperationException("Tesseract_SolPath is not configured.");
        }

        _logger.LogInformation("Starting OCR extraction for image file {FileName}, Length={Length} bytes", file.FileName, file.Length);

        byte[] data;
        using (var memoryStream = new MemoryStream())
        {
            await file.CopyToAsync(memoryStream);
            data = memoryStream.ToArray();
        }

        using (var engine = new TesseractEngine(_solPath, "eng", EngineMode.Default))
        using (var img = Pix.LoadFromMemory(data))
        using (var page = engine.Process(img))
        {
            string text = page.GetText();
            _logger.LogInformation("OCR extraction completed. TextLength={TextLength}", text?.Length ?? 0);
            return ExtractTransDetailFromText(text);
        }
    }

    public async Task<TransDetail> ExtractTransDetailFromImageViaPythonAsync(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            throw new ArgumentException("File is empty.");
        }

        if (string.IsNullOrWhiteSpace(_pythonServiceUrl))
        {
            throw new InvalidOperationException("Python ImageTextExtractor service URL is not configured.");
        }

        _logger.LogInformation("Starting remote OCR extraction via Python service for image file {FileName}, Length={Length} bytes", file.FileName, file.Length);

        byte[] data;
        using (var memoryStream = new MemoryStream())
        {
            await file.CopyToAsync(memoryStream);
            data = memoryStream.ToArray();
        }

        var client = _httpClientFactory.CreateClient();

        using var content = new MultipartFormDataContent();
        var fileContent = new ByteArrayContent(data);
        fileContent.Headers.ContentType = new MediaTypeHeaderValue(file.ContentType ?? "application/octet-stream");
        content.Add(fileContent, "file", file.FileName);

        using var response = await client.PostAsync(_pythonServiceUrl, content);

        if (!response.IsSuccessStatusCode)
        {
            var errorBody = await response.Content.ReadAsStringAsync();
            _logger.LogError(
                "Python ImageTextExtractor service returned non-success status. StatusCode={StatusCode}, Body={Body}",
                (int)response.StatusCode,
                errorBody);
            throw new InvalidOperationException($"Python ImageTextExtractor service error: {(int)response.StatusCode}");
        }

        var json = await response.Content.ReadAsStringAsync();

        string? text;
        try
        {
            using var doc = JsonDocument.Parse(json);
            var root = doc.RootElement;
            text = root.TryGetProperty("text", out var textElement) ? textElement.GetString() : null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to parse response from Python ImageTextExtractor service. Body={Body}", json);
            throw new InvalidOperationException("Invalid response from Python ImageTextExtractor service.", ex);
        }

        if (string.IsNullOrWhiteSpace(text))
        {
            _logger.LogWarning("Python ImageTextExtractor service returned empty text.");
            text = string.Empty;
        }

        _logger.LogInformation("Remote OCR extraction via Python service completed. TextLength={TextLength}", text.Length);

        return ExtractTransDetailFromText(text);
    }

    private TransDetail ExtractTransDetailFromText(string text)
    {
        TransDetail transDetail = new TransDetail();
        string[] words = text.Split(new[] { ' ', '\t', '\n' }, StringSplitOptions.RemoveEmptyEntries);

        transDetail.TransactionId = _transNoEvaluator.ExtractTransNoFromText(words);
        _logger.LogInformation("TransactionId extracted from text: {TransactionId}", transDetail.TransactionId);
        transDetail.Remark = "Transaction # is evaluated from screenshot";
        return transDetail;
    }
}
