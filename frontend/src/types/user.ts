export type User = {
    id: string;
    username: string;
    role: string;
    capabilities: string[];

    ownerId?: number | null;
}

