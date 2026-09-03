IF DB_ID('MyVetMVCDB') IS NULL
BEGIN
    CREATE DATABASE [MyVetMVCDB];
END
GO

USE [MyVetMVCDB];
GO

IF NOT EXISTS (SELECT * FROM sys.server_principals WHERE name = 'vet_app_user')
BEGIN
    CREATE LOGIN [vet_app_user]
    WITH PASSWORD = '$(AppUserPassword)',
    CHECK_POLICY = ON;
END
GO

IF NOT EXISTS (SELECT * FROM sys.database_principals WHERE name = 'vet_app_user')
BEGIN
    CREATE USER [vet_app_user] FOR LOGIN [vet_app_user];
    ALTER ROLE [db_owner] ADD MEMBER [vet_app_user];
END
GO
