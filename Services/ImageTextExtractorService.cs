using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Tesseract;
using eAccountNoteService.Models;
using eAccountNoteService.Utility;

namespace eAccountNoteService.Services;

public class ImageTextExtractorService
{
    private readonly string _solPath;
    private readonly TransNoEvaluator _transNoEvaluator;

    public ImageTextExtractorService(IConfiguration configuration, TransNoEvaluator transNoEvaluator)
    {
        var s = configuration.GetSection("AppSettings");
        _solPath = s["Tesseract_SolPath"] ?? string.Empty;
        _transNoEvaluator = transNoEvaluator;
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
            return ExtractTransDetailFromText(text);
        }
    }

    private TransDetail ExtractTransDetailFromText(string text)
    {
        TransDetail transDetail = new TransDetail();
        string[] words = text.Split(new[] { ' ', '\t', '\n' }, StringSplitOptions.RemoveEmptyEntries);

        transDetail.TransactionId = _transNoEvaluator.ExtractTransNoFromText(words);
        transDetail.Remark = "Transaction # is evaluated from screenshot";
        return transDetail;
    }
}
