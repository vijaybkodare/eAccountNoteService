using System.Net.Mail;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace eAccountNoteService.Services;

public class EmailSenderService
{
    private readonly string _smtpServer;
    private readonly string _fromEmail;
    private readonly int _port;
    private readonly string _emailPassword;
    private readonly string _emailAccount;
    private readonly ILogger<EmailSenderService> _logger;

    public EmailSenderService(IConfiguration configuration, ILogger<EmailSenderService> logger)
    {
        _logger = logger;
        // Use the same keys as legacy Web.config so migration is simple
        var appSettings = configuration.GetSection("AppSettings");
        _smtpServer = appSettings["Email_SMTPServer"] ?? string.Empty;
        _emailAccount = appSettings["Email_Account"] ?? string.Empty;
        _port = int.TryParse(appSettings["Email_Port"], out var p) ? p : 25;
        _emailPassword = appSettings["Email_Password"] ?? string.Empty;
        _fromEmail = appSettings["Email_From"] ?? string.Empty;
    }

    public bool SendEmail(string toEmail, string subject, string body)
    {
        try
        {
            using var message = new MailMessage(_fromEmail, toEmail, subject, body);
            using var client = new SmtpClient(_smtpServer, _port)
            {
                EnableSsl = true,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false,
                Credentials = new System.Net.NetworkCredential(_emailAccount, _emailPassword)
            };

            client.Send(message);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send email to {ToEmail}", toEmail);
            return false;
        }
    }
}
