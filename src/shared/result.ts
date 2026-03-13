export type Result<T, E = Error> = 
    | { isSuccess: true; value: T }
    | { isSuccess: false; error: E };