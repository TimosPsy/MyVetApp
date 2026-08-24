BEGIN TRY
    BEGIN TRANSACTION;

    -- ============================================
    -- Migration: Assign Pet capabilities to EMPLOYEE and OWNER roles
    -- ============================================

    -- ============================================
    -- Assign to EMPLOYEE (idempotent)
    -- ============================================
    INSERT INTO [dbo].[RolesCapabilities] ([RolesId], [CapabilitiesId])
    SELECT r.[Id], c.[Id]
    FROM [dbo].[Roles] r
    CROSS JOIN [dbo].[Capabilities] c
    WHERE r.[Name] = 'EMPLOYEE'
      AND c.[Name] IN ('INSERT_PET', 'VIEW_PETS', 'VIEW_PET', 'EDIT_PET', 'DELETE_PET')
      AND NOT EXISTS (
          SELECT 1
          FROM [dbo].[RolesCapabilities] rc
          WHERE rc.[RolesId] = r.[Id] AND rc.[CapabilitiesId] = c.[Id]
      );


    -- ============================================
    -- Assign to OWNER (idempotent)
    -- ============================================
    INSERT INTO [dbo].[RolesCapabilities] ([RolesId], [CapabilitiesId])
    SELECT r.[Id], c.[Id]
    FROM [dbo].[Roles] r
    CROSS JOIN [dbo].[Capabilities] c
    WHERE r.[Name] = 'OWNER'
      AND c.[Name] IN ('INSERT_PET')
      AND NOT EXISTS (
          SELECT 1
          FROM [dbo].[RolesCapabilities] rc
          WHERE rc.[RolesId] = r.[Id] AND rc.[CapabilitiesId] = c.[Id]
      );


    COMMIT TRANSACTION;
END TRY
BEGIN CATCH
    ROLLBACK TRANSACTION;
    THROW;
END CATCH;
