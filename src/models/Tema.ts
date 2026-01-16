import type Postagem from "./Postagem";


export default interface Usuario {
    id: number;
    descicao: string;
    postagem?: Postagem[] | null;
}   