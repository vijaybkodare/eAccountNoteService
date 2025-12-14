using eAccountNoteService.Services;
using eAccountNoteService.Utility;
using eAccountNoteService.Filters;

var builder = WebApplication.CreateBuilder(args);
var appEnv = builder.Configuration["AppSettings:env"];
if (appEnv == "PROD")
{
    builder.WebHost.UseUrls("http://0.0.0.0:5040");
}

// Add services to the container.
builder.Services.AddControllers(options =>
    {
        // Global auth filter, equivalent to [AuthActionFilter] on all controllers
        options.Filters.Add<AuthActionFilter>();
    })
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = null;
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Dependency Injection registrations
builder.Services.AddScoped<DapperService>();
builder.Services.AddScoped<AuthActionFilter>();
builder.Services.AddScoped<OrgMasterService>();
builder.Services.AddScoped<AccountMasterService>();
builder.Services.AddScoped<AppSettingService>();
builder.Services.AddScoped<ItemMasterService>();
builder.Services.AddScoped<AdvChargeService>();
builder.Services.AddScoped<BillOrderService>();
builder.Services.AddScoped<BillPayTransService>();
builder.Services.AddScoped<BankStatementService>();
builder.Services.AddScoped<BankStatementHeaderService>();
builder.Services.AddScoped<ChargeOrderService>();
builder.Services.AddScoped<JVOrderService>();
builder.Services.AddScoped<ImageTextExtractorService>();
builder.Services.AddScoped<ChargePayTransService>();
builder.Services.AddScoped<CummulativeChargePayTransService>();
builder.Services.AddScoped<ChargePayeeDetailService>();
builder.Services.AddScoped<MLAutoTransService>();
builder.Services.AddScoped<MLAutoTrans2Service>();
builder.Services.AddScoped<AccountTransTokenService>();
builder.Services.AddHttpClient<Fast2SmsSender>();
builder.Services.AddScoped<EmailSenderService>();
builder.Services.AddScoped<UserProfileService>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<UserAuthService>();
builder.Services.AddScoped<TransNoEvaluator>();
builder.Services.AddScoped<TransactionService>();

AppConstants.Initialize(builder.Configuration);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Serve default and static files so that wwwroot/index.html is shown at root
app.UseDefaultFiles();
app.UseStaticFiles();

app.MapControllers();

app.Run();
