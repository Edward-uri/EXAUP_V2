export type UserRole =
  | "admin"
  | "director_vinculacion"
  | "director_programa_educativo";

export const USER_ROLES: Record<string, UserRole> = {
  ADMIN: "admin",
  DIRECTOR_VINCULACION: "director_vinculacion",
  DIRECTOR_PROGRAMA_EDUCATIVO: "director_programa_educativo",
};

export const ALL_ROLES: UserRole[] = [
  USER_ROLES.ADMIN,
  USER_ROLES.DIRECTOR_VINCULACION,
  USER_ROLES.DIRECTOR_PROGRAMA_EDUCATIVO,
];
