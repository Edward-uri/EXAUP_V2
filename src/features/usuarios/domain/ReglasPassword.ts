
export function errorDePassword(password: string): string | null {
    if (password.length < 8) return 'La contraseña debe tener al menos 8 caracteres.';
    if (!/[A-Z]/.test(password)) return 'La contraseña debe incluir al menos una mayúscula.';
    if (!/[0-9]/.test(password)) return 'La contraseña debe incluir al menos un número.';
    return null;
}