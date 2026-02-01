export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  EDITOR: 'editor',
  VIEWER: 'viewer',
};

export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Administrator',
  [ROLES.MANAGER]: 'Manager',
  [ROLES.EDITOR]: 'Content Editor',
  [ROLES.VIEWER]: 'Viewer',
};

export const ROLE_STYLES = {
  [ROLES.ADMIN]: 'bg-primary/10 text-primary border-primary/20',
  [ROLES.MANAGER]: 'bg-accent/10 text-accent border-accent/20',
  [ROLES.EDITOR]: 'bg-success/10 text-success border-success/20',
  [ROLES.VIEWER]: 'bg-secondary/10 text-secondary border-secondary/20',
};

export const ROLE_OPTIONS = Object.values(ROLES).map((role) => ({
  value: role,
  label: ROLE_LABELS[role],
}));

// (Optional, maybe I'll need it)
export const PERMISSIONS = {
  CAN_MANAGE_USERS: [ROLES.ADMIN],
  CAN_EDIT_CONTENT: [ROLES.ADMIN, ROLES.MANAGER, ROLES.EDITOR],
};
