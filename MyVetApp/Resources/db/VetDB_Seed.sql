BEGIN TRY
	BEGIN TRANSACTION;
	    -- ============================================
	-- MyVetDB - Seed Data
	-- Roles, Capabilities, Role-Capability mappings
	-- ============================================
	
	-- ============================================
	-- Insert Roles
	-- ============================================
	INSERT INTO [dbo].[Roles] ([Name])
	VALUES
	    ('ADMIN'),
	    ('EMPLOYEE'),
	    ('OWNER')
	    
	
	-- ============================================
	-- Insert Capabilities
	-- ============================================
	INSERT INTO [dbo].[Capabilities] ([Name], [Description])
	VALUES
	    ('INSERT_OWNER', 'Create a new owner'),
	    ('VIEW_OWNERS', 'View owner list and details'),
	    ('VIEW_OWNER', 'View owner'),
	    ('EDIT_OWNER', 'Modify existing owner'),
	    ('DELETE_OWNER', 'Remove a owner'),
	    ('VIEW_ONLY_OWNER', 'View only own owner details'),
		('VIEW_ONLY_OWN_PETS', 'View only own pet details'),
	    ('INSERT_PET', 'Create a new pet'),
	    ('VIEW_PETS', 'View pets list and details'),
	    ('VIEW_PET', 'View pet'),
	    ('EDIT_PET', 'Modify existing pet'),
	    ('DELETE_PET', 'Remove a pet');
	
	
	-- ============================================
	-- ADMIN: all capabilities
	-- ============================================
	INSERT INTO [dbo].[RolesCapabilities] ([RolesId], [CapabilitiesId])
	SELECT r.[Id], c.[Id]
	FROM [dbo].[Roles] r
	CROSS JOIN [dbo].[Capabilities] c
	WHERE r.[Name] = 'ADMIN';
	
	
	-- ============================================
	-- EMPLOYEE: VIEW_OWNERS, VIEW_OWNER,
	--           VIEW_PETS, VIEW_PET
	-- ============================================
	INSERT INTO [dbo].[RolesCapabilities] ([RolesId], [CapabilitiesId])
	SELECT r.[Id], c.[Id]
	FROM [dbo].[Roles] r
	CROSS JOIN [dbo].[Capabilities] c
	WHERE r.[Name] = 'EMPLOYEE'
	  AND c.[Name] IN ('VIEW_OWNERS', 'VIEW_OWNER',
	                    'VIEW_PETS', 'VIEW_PET');
	
	
	-- ============================================
	-- OWNER: VIEW_ONLY_OWNER, VIEW_ONLY_OWN_PETS
	-- ============================================
	INSERT INTO [dbo].[RolesCapabilities] ([RolesId], [CapabilitiesId])
	SELECT r.[Id], c.[Id]
	FROM [dbo].[Roles] r
	CROSS JOIN [dbo].[Capabilities] c
	WHERE r.[Name] = 'OWNER'
	  AND c.[Name] IN ('VIEW_ONLY_OWNER', 'VIEW_ONLY_OWN_PETS');

	    
	COMMIT TRANSACTION;
END TRY
BEGIN CATCH
    ROLLBACK TRANSACTION;
    THROW;
END CATCH;

DBCC CHECKIDENT ('dbo.Roles', RESEED, 3);
DBCC CHECKIDENT ('dbo.Capabilities', RESEED, 12); 
