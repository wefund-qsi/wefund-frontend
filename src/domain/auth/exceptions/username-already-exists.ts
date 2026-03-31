/**
 * Exception levée lors d'une tentative d'inscription avec un username déjà existant
 */
export class UsernameAlreadyExistsException extends Error {
    /**
     * Constructeur de l'exception
     *
     * @param {string} username - Le username qui existe déjà dans le système
     */
    constructor(username: string) {
        super(`Username "${username}" already exists.`);
        this.name = "UsernameAlreadyExistsException";
    }
}
