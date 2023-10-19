export {};

export type TError = {
    code: number,
    text: string,
}

export type TUser = {
    id: number,
    name: string,
    soname: string,
    token:string,
};

export type TnavButton = {
    to: string;
    text: string;
}