using System.Net.Http;
using System.Text;
using System.Text.Json;
using eAccountNoteService.Models;
using eAccountNoteService.Utility;
using Microsoft.Extensions.Configuration;

namespace eAccountNoteService.Services;

public class Fast2SmsSender
{
    private readonly HttpClient _httpClient;
    private readonly string _apiUrl;
    private readonly string _apiKey;
    private readonly bool _isActive;

    public Fast2SmsSender(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        // Prefer AppConstants values if present; fall back to configuration section if needed
        _apiUrl = !string.IsNullOrWhiteSpace(AppConstants.FAST2SMS_API_URL)
            ? AppConstants.FAST2SMS_API_URL
            : (configuration["Fast2Sms:ApiUrl"] ?? string.Empty);

        _apiKey = !string.IsNullOrWhiteSpace(AppConstants.FAST2SMS_API_KEY)
            ? AppConstants.FAST2SMS_API_KEY
            : (configuration["Fast2Sms:ApiKey"] ?? string.Empty);

        _isActive = AppConstants.isMessageSenderActive
                    || (bool.TryParse(configuration["Fast2Sms:IsActive"], out var active) && active);
    }

    public async Task<Fast2SmsResponse> SendMsgForMobVerifAsync(string mobileNo, string verificationCode)
    {
        string msg = string.Format(AppConstants.msgTmpltForMobVerif, verificationCode);
        return await SendAsync(mobileNo, msg);
    }

    public Fast2SmsResponse SendMsgForMobVerif(string mobileNo, string verificationCode)
    {
        string msg = string.Format(AppConstants.msgTmpltForMobVerif, verificationCode);
        return SendAsync(mobileNo, msg).Result;
    }

    public async Task<Fast2SmsResponse> SendGeneralSMSAsync(string mobileNo, string accountName, string smsType, string smsPart1, string smsPart2)
    {
        string msg = string.Empty;
        switch (smsType)
        {
            case "m":
                // Meeting: SMSPart1 + SMSPart2 (max 60 chars)
                var meetText = (smsPart1 + " " + smsPart2).Trim();
                if (meetText.Length > 60) meetText = meetText[..60];
                msg = string.Format(AppConstants.msgTmpltForMeeting, accountName, meetText);
                break;
            case "n":
                // Notice: SMSPart1 (max 84 chars)
                var noticeText = smsPart1.Trim();
                if (noticeText.Length > 84) noticeText = noticeText[..84];
                msg = string.Format(AppConstants.msgTmpltForNotice, accountName, noticeText);
                break;
            case "a":
                // Announcement: SMSPart1 (max 78 chars)
                var annText = smsPart1.Trim();
                if (annText.Length > 78) annText = annText[..78];
                msg = string.Format(AppConstants.msgTmpltForAnnouncement, accountName, annText);
                break;
        }

        return await SendAsync(mobileNo, msg);
    }

    public async Task<Fast2SmsResponse> SendMsgForAccountRegAsync(string mobileNo, string userId, string password)
    {
        string msg = string.Format(AppConstants.msgTmpltForAccountReg, userId, password);
        return await SendAsync(mobileNo, msg);
    }

    public async Task<Fast2SmsResponse> SendMsgForAccountCreaAsync(string mobileNo, string refAccountName, string userId, string password)
    {
        if (refAccountName.Length > 23)
            refAccountName = refAccountName[..23];
        string msg = string.Format(AppConstants.msgTmpltForAccountCrea, refAccountName, userId, password);
        return await SendAsync(mobileNo, msg);
    }

    public async Task<Fast2SmsResponse> SendMsgForPasswordOtpAsync(string mobileNo, string otp)
    {
        string msg = string.Format(AppConstants.msgTmpltForPasswordOTP, otp);
        return await SendAsync(mobileNo, msg);
    }

    public async Task<Fast2SmsResponse> SendMsgForMobileConfOtpAsync(string mobileNo, string otp)
    {
        string msg = string.Format(AppConstants.msgTmpltForMobileConfOTP, otp);
        return await SendAsync(mobileNo, msg);
    }

    public async Task<Fast2SmsResponse> SendMsgForLoginOtpAsync(string mobileNo, string otp)
    {
        string msg = string.Format(AppConstants.msgTmpltForLoginOtp, otp);
        return await SendAsync(mobileNo, msg);
    }

    public Fast2SmsResponse SendMsgForLoginOTP(string mobileNo, string otp)
    {
        string msg = string.Format(AppConstants.msgTmpltForLoginOtp, otp);
        return SendAsync(mobileNo, msg).Result;
    }

    // Wrapper to keep compatibility with legacy naming used in UserService
    public Task<Fast2SmsResponse> SendMsgForLoginOTPAsync(string mobileNo, string otp)
    {
        return SendMsgForLoginOtpAsync(mobileNo, otp);
    }

    private async Task<Fast2SmsResponse> SendAsync(string mobileNo, string message)
    {
        if (!_isActive)
            return new Fast2SmsResponse { status_code = 200, message = "Message sender inactive." };
        if (string.IsNullOrWhiteSpace(message))
            return new Fast2SmsResponse { status_code = 200, message = "Empty message." };
        if (string.IsNullOrWhiteSpace(_apiUrl) || string.IsNullOrWhiteSpace(_apiKey))
            return new Fast2SmsResponse { status_code = 500, message = "Fast2Sms configuration missing." };

        if (mobileNo.Length == 10)
            mobileNo = "91" + mobileNo;

        var payload = new
        {
            route = "q",
            message,
            numbers = mobileNo
        };

        var jsonBody = JsonSerializer.Serialize(payload);
        using var request = new HttpRequestMessage(HttpMethod.Post, _apiUrl)
        {
            Content = new StringContent(jsonBody, Encoding.UTF8, "application/json")
        };

        request.Headers.Accept.Clear();
        request.Headers.Accept.ParseAdd("application/json");
        request.Headers.TryAddWithoutValidation("authorization", _apiKey);

        var response = await _httpClient.SendAsync(request);
        var result = await response.Content.ReadAsStringAsync();

        try
        {
            using var doc = JsonDocument.Parse(result);
            var root = doc.RootElement;
            bool isSuccess = root.TryGetProperty("return", out var returnProp) && returnProp.GetBoolean();
            string apiMessage = root.TryGetProperty("message", out var msgProp) ? msgProp.ToString() : string.Empty;
            return new Fast2SmsResponse
            {
                status_code = isSuccess ? 200 : 400,
                message = string.IsNullOrEmpty(apiMessage) ? (isSuccess ? "Success" : "Error") : apiMessage
            };
        }
        catch
        {
            return new Fast2SmsResponse
            {
                status_code = response.IsSuccessStatusCode ? 200 : (int)response.StatusCode,
                message = response.ReasonPhrase ?? "Error"
            };
        }
    }
}
