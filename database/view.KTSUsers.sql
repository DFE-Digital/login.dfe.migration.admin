CREATE VIEW KTSUsers
  AS
    SELECT
      X2.ID,
      p.FirstName,
      p.Surname,
      p.Email,
      u.LogonName,
      X2.X2AUserID KTSID,
      d.SerialNumber
    FROM X2
      JOIN UserAccounts u ON X2.OwnerID = u.ID
      JOIN People p ON u.PersonID = p.ID
      LEFT JOIN Devices d ON u.ID = d.UserAccountID
go

