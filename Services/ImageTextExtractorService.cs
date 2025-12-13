using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Tesseract;
using eAccountNoteService.Models;

namespace eAccountNoteService.Services;

public class ImageTextExtractorService
{
    private readonly string _solPath;

    public ImageTextExtractorService(IConfiguration configuration)
    {
        // In appsettings.json, configure: "Tesseract_SolPath": "relative/or/absolute/path/to/tessdata"
        _solPath = configuration["Tesseract_SolPath"] ?? string.Empty;
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

        // NOTE: TransNoEvaluator.ExtractTransNoFromText is not ported; implement simple placeholder.
        // You can replace this with your own transaction-id extraction logic.
        transDetail.TransactionId = ExtractTransactionId(words);
        transDetail.Remark = "Transaction # is evaluated from screenshot";
        return transDetail;
    }

    private string ExtractTransactionId(string[] words)
    {
        // Simple heuristic placeholder: return the first token that looks like an alphanumeric ID.
        // In legacy code this was TransNoEvaluator.ExtractTransNoFromText(words).
        foreach (var w in words)
        {
            if (w.Length >= 6 && Regex.IsMatch(w, "^[A-Za-z0-9]+$"))
            {
                return w;
            }
        }
        return string.Empty;
    }
}
