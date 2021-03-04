export class Utility {
    static pause = (s: number) => new Promise<number>((resolve) => setTimeout((_) => resolve(s), s * 1000));
}