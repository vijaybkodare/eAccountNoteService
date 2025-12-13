using Microsoft.Extensions.Configuration;

namespace eAccountNoteService.Utility;

public static class AppConstants
{
    public static string msgTmpltForAccountCrea { get; private set; } = string.Empty;
    public static string msgTmpltForAccountReg { get; private set; } = string.Empty;
    public static string msgTmpltForPasswordOTP { get; private set; } = string.Empty;
    public static string msgTmpltForMobileConfOTP { get; private set; } = string.Empty;
    public static string msgTmpltForAccountTrans { get; private set; } = string.Empty;
    public static string msgTmpltForMobileConf { get; private set; } = string.Empty;
    public static string msgTmpltForAccountBal { get; private set; } = string.Empty;
    public static string msgTmpltForAddAccount { get; private set; } = string.Empty;
    public static string msgTmpltForMeeting { get; private set; } = string.Empty;
    public static string msgTmpltForNotice { get; private set; } = string.Empty;
    public static string msgTmpltForAnnouncement { get; private set; } = string.Empty;
    public static string msgTmpltForLoginOtp { get; private set; } = string.Empty;
    public static string msgTmpltForMobVerif { get; private set; } = string.Empty;

    public static string TEXTLOCALAPIKEY { get; private set; } = string.Empty;
    public static string TEXTLOCALAPIURL { get; private set; } = string.Empty;
    public static string MOBILEMESSAGESENDER { get; private set; } = string.Empty;
    public static int MINOTP { get; private set; } = 1000;
    public static int MAXOTP { get; private set; } = 9999;
    public static int MINPSW { get; private set; } = 1000;
    public static int MAXPSW { get; private set; } = 9999;
    public static int ACCESSKEYLEN { get; private set; } = 10;
    public static bool isMessageSenderActive { get; private set; } = false;
    public static string FILEPATH { get; private set; } = string.Empty;
    public static string FAST2SMS_API_URL { get; private set; } = string.Empty;
    public static string FAST2SMS_API_KEY { get; private set; } = string.Empty;

    public static void Initialize(IConfiguration configuration)
    {
        var s = configuration.GetSection("AppSettings");

        isMessageSenderActive = string.Equals(s["isMessageSenderActive"], "Yes", StringComparison.OrdinalIgnoreCase)
                                || string.Equals(s["isMessageSenderActive"], "true", StringComparison.OrdinalIgnoreCase);

        msgTmpltForAccountCrea = s["msgTmpltForAccountCrea"] ?? string.Empty;
        msgTmpltForAccountReg = s["msgTmpltForAccountReg"] ?? string.Empty;
        msgTmpltForPasswordOTP = s["msgTmpltForPasswordOTP"] ?? string.Empty;
        msgTmpltForAccountTrans = s["msgTmpltForAccountTrans"] ?? string.Empty;
        msgTmpltForMobileConf = s["msgTmpltForMobileConf"] ?? string.Empty;
        msgTmpltForMobileConfOTP = s["msgTmpltForMobileConfOTP"] ?? string.Empty;
        msgTmpltForAccountBal = s["msgTmpltForAccountBal"] ?? string.Empty;
        msgTmpltForAddAccount = s["msgTmpltForAddAccount"] ?? string.Empty;
        msgTmpltForMeeting = s["msgTmpltForMeeting"] ?? string.Empty;
        msgTmpltForNotice = s["msgTmpltForNotice"] ?? string.Empty;
        msgTmpltForAnnouncement = s["msgTmpltForAnnouncement"] ?? string.Empty;
        msgTmpltForLoginOtp = s["msgTmpltForLoginOtp"] ?? string.Empty;
        msgTmpltForMobVerif = s["msgTmpltForMobVerif"] ?? string.Empty;

        FILEPATH = s["filePath"] ?? string.Empty;
        TEXTLOCALAPIKEY = s["textlocalAPIKey"] ?? string.Empty;
        TEXTLOCALAPIURL = s["textlocalAPIUrl"] ?? string.Empty;
        FAST2SMS_API_KEY = s["fast2smsAPIKey"] ?? string.Empty;
        FAST2SMS_API_URL = s["fast2smsAPIUrl"] ?? string.Empty;
        MOBILEMESSAGESENDER = s["mobileMessageSender"] ?? string.Empty;

        int otpLength = ParseInt(s["otpLength"], 5);
        int pswLength = ParseInt(s["pswLength"], 4);
        ACCESSKEYLEN = ParseInt(s["accessKeyLength"], 10);

        if (otpLength < 4) otpLength = 4;
        MINOTP = 1000;
        MAXOTP = 9999;
        while (otpLength > 4)
        {
            MINOTP = int.Parse(MINOTP + "0");
            MAXOTP = int.Parse(MAXOTP + "9");
            otpLength--;
        }

        if (pswLength < 4) pswLength = 4;
        MINPSW = 1000;
        MAXPSW = 9999;
        while (pswLength > 4)
        {
            MINPSW = int.Parse(MINPSW + "0");
            MAXPSW = int.Parse(MAXPSW + "9");
            pswLength--;
        }
    }

    private static int ParseInt(string? value, int fallback)
    {
        return int.TryParse(value, out var v) ? v : fallback;
    }
}
