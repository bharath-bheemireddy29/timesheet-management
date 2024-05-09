// Define the roles and their permissions using a TypeScript enum and type
enum Role {
    User = 'user',
    Admin = 'admin',
  }

  // Define the permissions type
  type Permissions = 'getUsers' | 'manageUsers';

  // Define the structure for all roles using a Record type
  const allRoles: Record<Role, Permissions[]> = {
    [Role.User]: [],
    [Role.Admin]: ['getUsers', 'manageUsers'],
  };

  // Extract roles and rights from the allRoles object
  const roles: string[] = Object.keys(allRoles);
  const roleRights: Map<string, Permissions[]> = new Map(Object.entries(allRoles));

  // Export roles and roleRights
  export { roles, roleRights };
