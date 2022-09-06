export interface BlockData {
    url: string,
    time: number
}

export interface Unlock {
    url: string,
    started: number,
    duration: number,
    reason: string,
    limit: string
}

export interface StatisticsRecord {
    title: string,
    subtitle?: string,
    value: number,
    started?: number
}

export enum TimeSpan {
    day,
    week,
    month,
    allTime,
}
export enum Measurement {
    Frequency,
    Time
}
