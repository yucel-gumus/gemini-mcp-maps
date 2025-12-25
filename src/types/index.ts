export interface MapParams {
    location?: string;
    search?: string;
    origin?: string;
    destination?: string;
}

export enum ChatState {
    IDLE = 'idle',
    GENERATING = 'generating',
    THINKING = 'thinking',
    EXECUTING = 'executing',
}

export enum ChatRole {
    USER = 'user',
    ASSISTANT = 'assistant',
    SYSTEM = 'system',
    ERROR = 'error',
}

export interface GeocodingResult {
    lat: number;
    lon: number;
    displayName: string;
}

export interface MapConfig {
    defaultCenter: [number, number];
    defaultZoom: number;
    tileUrl: string;
    maxZoom: number;
    attribution: string;
}

export type MapQueryHandler = (params: MapParams) => void;

export type SendMessageHandler = (input: string, role: string) => Promise<void>;
