interface decryptResults {
    status: string,
    reason?: string,
    data?: string
}
interface encryptResults {
    status: string,
    reason?: string,
    data?: string
}
export function decryptFile(path: string, pass: string): encryptResults

export function encryptFile(path: string, data: string, pass: string): decryptResults

export function decryptText(data: string, pass: string) : decryptResults

export function encryptText(data: string, pass: string) : encryptResults

