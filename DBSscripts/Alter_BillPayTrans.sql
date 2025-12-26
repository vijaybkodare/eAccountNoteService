ALTER TABLE [dbo].[BillPayTrans] ADD [TransMode] SMALLINT NULL;
ALTER TABLE [dbo].[BillPayTrans] ADD [ReconcRemark] VARCHAR(500) NULL;
ALTER TABLE [dbo].[BillPayTrans] ADD [ReconcStatus] SMALLINT NULL;
UPDATE BillPayTrans SET ReconcStatus = 0 WHERE ReconcStatus IS NULL