CREATE PROCEDURE [dbo].[Proc_Update_DonationHeader]
(
    @DonationHeaderId NUMERIC(18, 0),
    @ItemId NUMERIC(18, 0),
    @AccountId NUMERIC(18, 0),
    @Remark VARCHAR(500)
)
AS
BEGIN
    UPDATE DonationHeader
    SET ItemId = @ItemId,
        AccountId = @AccountId,
        Remark = @Remark
    WHERE DonationHeaderId = @DonationHeaderId;
END;
