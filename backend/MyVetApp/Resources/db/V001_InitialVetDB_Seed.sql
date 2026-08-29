BEGIN TRY
    BEGIN TRANSACTION;
        -- ============================================
    -- MyVetDB - Seed Data (Idempotent Version)
    -- Roles, Capabilities, Role-Capability mappings
    -- ============================================
    
    -- ============================================
    -- Insert Roles
    -- ============================================
    IF NOT EXISTS (SELECT 1 FROM [dbo].[Roles] WHERE [Name] = 'ADMIN')
        INSERT INTO [dbo].[Roles] ([Name]) VALUES ('ADMIN');

    IF NOT EXISTS (SELECT 1 FROM [dbo].[Roles] WHERE [Name] = 'EMPLOYEE')
        INSERT INTO [dbo].[Roles] ([Name]) VALUES ('EMPLOYEE');

    IF NOT EXISTS (SELECT 1 FROM [dbo].[Roles] WHERE [Name] = 'OWNER')
        INSERT INTO [dbo].[Roles] ([Name]) VALUES ('OWNER');
        
    
    -- ============================================
    -- Insert Capabilities
    -- ============================================
    IF NOT EXISTS (SELECT 1 FROM [dbo].[Capabilities] WHERE [Name] = 'INSERT_OWNER')
        INSERT INTO [dbo].[Capabilities] ([Name], [Description]) VALUES ('INSERT_OWNER', 'Create a new owner');

    IF NOT EXISTS (SELECT 1 FROM [dbo].[Capabilities] WHERE [Name] = 'VIEW_OWNERS')
        INSERT INTO [dbo].[Capabilities] ([Name], [Description]) VALUES ('VIEW_OWNERS', 'View owner list and details');

    IF NOT EXISTS (SELECT 1 FROM [dbo].[Capabilities] WHERE [Name] = 'VIEW_OWNER')
        INSERT INTO [dbo].[Capabilities] ([Name], [Description]) VALUES ('VIEW_OWNER', 'View owner');

    IF NOT EXISTS (SELECT 1 FROM [dbo].[Capabilities] WHERE [Name] = 'EDIT_OWNER')
        INSERT INTO [dbo].[Capabilities] ([Name], [Description]) VALUES ('EDIT_OWNER', 'Modify existing owner');

    IF NOT EXISTS (SELECT 1 FROM [dbo].[Capabilities] WHERE [Name] = 'DELETE_OWNER')
        INSERT INTO [dbo].[Capabilities] ([Name], [Description]) VALUES ('DELETE_OWNER', 'Remove a owner');

    IF NOT EXISTS (SELECT 1 FROM [dbo].[Capabilities] WHERE [Name] = 'VIEW_ONLY_OWNER')
        INSERT INTO [dbo].[Capabilities] ([Name], [Description]) VALUES ('VIEW_ONLY_OWNER', 'View only owner details');

    IF NOT EXISTS (SELECT 1 FROM [dbo].[Capabilities] WHERE [Name] = 'VIEW_ONLY_OWN_PETS')
        INSERT INTO [dbo].[Capabilities] ([Name], [Description]) VALUES ('VIEW_ONLY_OWN_PETS', 'View only own pet details');

    IF NOT EXISTS (SELECT 1 FROM [dbo].[Capabilities] WHERE [Name] = 'INSERT_PET')
        INSERT INTO [dbo].[Capabilities] ([Name], [Description]) VALUES ('INSERT_PET', 'Create a new pet');

    IF NOT EXISTS (SELECT 1 FROM [dbo].[Capabilities] WHERE [Name] = 'VIEW_PETS')
        INSERT INTO [dbo].[Capabilities] ([Name], [Description]) VALUES ('VIEW_PETS', 'View pets list and details');

    IF NOT EXISTS (SELECT 1 FROM [dbo].[Capabilities] WHERE [Name] = 'VIEW_PET')
        INSERT INTO [dbo].[Capabilities] ([Name], [Description]) VALUES ('VIEW_PET', 'View pet');

    IF NOT EXISTS (SELECT 1 FROM [dbo].[Capabilities] WHERE [Name] = 'EDIT_PET')
        INSERT INTO [dbo].[Capabilities] ([Name], [Description]) VALUES ('EDIT_PET', 'Modify existing pet');

    IF NOT EXISTS (SELECT 1 FROM [dbo].[Capabilities] WHERE [Name] = 'DELETE_PET')
        INSERT INTO [dbo].[Capabilities] ([Name], [Description]) VALUES ('DELETE_PET', 'Remove a pet');


    -- ============================================
    -- ADMIN: all capabilities
    -- ============================================
    INSERT INTO [dbo].[RolesCapabilities] ([RolesId], [CapabilitiesId])
    SELECT r.[Id], c.[Id]
    FROM [dbo].[Roles] r
    CROSS JOIN [dbo].[Capabilities] c
    WHERE r.[Name] = 'ADMIN'
      AND NOT EXISTS (
          SELECT 1 FROM [dbo].[RolesCapabilities] rc 
          WHERE rc.[RolesId] = r.[Id] AND rc.[CapabilitiesId] = c.[Id]
      );
    
    
    -- ============================================
    -- EMPLOYEE: VIEW_OWNERS, VIEW_OWNER,
    --           VIEW_PETS, VIEW_PET
    -- ============================================
    INSERT INTO [dbo].[RolesCapabilities] ([RolesId], [CapabilitiesId])
    SELECT r.[Id], c.[Id]
    FROM [dbo].[Roles] r
    CROSS JOIN [dbo].[Capabilities] c
    WHERE r.[Name] = 'EMPLOYEE'
      AND c.[Name] IN ('VIEW_OWNERS', 'VIEW_OWNER', 'VIEW_PETS', 'VIEW_PET')
      AND NOT EXISTS (
          SELECT 1 FROM [dbo].[RolesCapabilities] rc 
          WHERE rc.[RolesId] = r.[Id] AND rc.[CapabilitiesId] = c.[Id]
      );
    
    
    -- ============================================
    -- OWNER: VIEW_ONLY_OWNER, VIEW_ONLY_OWN_PETS
    -- ============================================
    INSERT INTO [dbo].[RolesCapabilities] ([RolesId], [CapabilitiesId])
    SELECT r.[Id], c.[Id]
    FROM [dbo].[Roles] r
    CROSS JOIN [dbo].[Capabilities] c
    WHERE r.[Name] = 'OWNER'
      AND c.[Name] IN ('VIEW_ONLY_OWNER', 'VIEW_ONLY_OWN_PETS')
      AND NOT EXISTS (
          SELECT 1 FROM [dbo].[RolesCapabilities] rc 
          WHERE rc.[RolesId] = r.[Id] AND rc.[CapabilitiesId] = c.[Id]
      );

        
    COMMIT TRANSACTION;
END TRY
BEGIN CATCH
    ROLLBACK TRANSACTION;
    THROW;
END CATCH;

-- Reseed identity values only if tables contain records to avoid issues
IF (SELECT COUNT(*) FROM [dbo].[Roles]) > 0 
    DBCC CHECKIDENT ('dbo.Roles', RESEED, 3);

IF (SELECT COUNT(*) FROM [dbo].[Capabilities]) > 0 
    DBCC CHECKIDENT ('dbo.Capabilities', RESEED, 12);
