export default interface Todo {
    id?: number;
    title: string;
    description?: string | null;
    producer?: string | null;
    region?: string | null;
    dateLimite: Date;
    isFinished: boolean;
    tags?: string[];
}
