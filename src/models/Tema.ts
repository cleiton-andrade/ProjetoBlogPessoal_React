import type Postagem from "./Postagem";


export default interface Usuario {
    id: number;
    descricao: string;
    postagem?: Postagem[] | null;
}   