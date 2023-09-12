interface SheetData {
    range?: string,
    majorDimension?: string,
    values: any
}

interface FSAMapping {
    fsa: string,
    city: string,
    cumulativeRevenue: number,
    cumulativeJobs: number,
    averageRevenuePerJob: number
}

export type {
    SheetData,
    FSAMapping
}