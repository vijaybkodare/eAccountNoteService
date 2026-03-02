namespace eAccountNoteService.Models
{
    public class ChargeTransMap
    {
        public decimal BankStatementId { get; set; }
        public decimal ChargePayTransId { get; set; }
        public string Source { get; set; } = string.Empty;
    }
}
