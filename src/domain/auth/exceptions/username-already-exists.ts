export class UsernameAlreadyExistsException extends Error {
    constructor(username: string) {
        super(`Username "${username}" already exists.`);
        this.name = "UsernameAlreadyExistsException";
    }
}
