export function writedata(name: string, data: {}): void

interface readData{
        name: string,
        created_at: string,
        data?: any
}
export function readdata(name: string): readData

export var dir: string