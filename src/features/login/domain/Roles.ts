export type UserRole =
  | "super_admin"
  | "director_vinculacion"
  | "director_programa_educativo";

export const USER_ROLES: Record<string, UserRole> = {
  SUPER_ADMIN: "super_admin",
  DIRECTOR_VINCULACION: "director_vinculacion",
  DIRECTOR_PROGRAMA_EDUCATIVO: "director_programa_educativo",
};

export const ALL_ROLES: UserRole[] = [
  USER_ROLES.SUPER_ADMIN,
  USER_ROLES.DIRECTOR_VINCULACION,
  USER_ROLES.DIRECTOR_PROGRAMA_EDUCATIVO,
];
