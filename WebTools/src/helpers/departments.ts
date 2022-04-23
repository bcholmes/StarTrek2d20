export enum Department {
    Command,
    Conn,
    Security,
    Engineering,
    Science,
    Medicine
}

export function allDepartments() {
    return [ Department.Command, Department.Conn, Department.Security, Department.Engineering, Department.Science, Department.Medicine];
}