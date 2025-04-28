export type Box = {
    id: number;
    word: string;
    x: number;
    y: number;
}
export type Dropzone = {
    id: number;
    x: number;
    y: number;
    occupiedBy: string | null;
}

export default Box;

