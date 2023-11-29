interface reqOps {
    useModFuncs: boolean,
    root: string
}

/**
 * 
 * @function
 * Imports/Requires .sst file code
 */
export function requireScript(name: string, options: reqOps) : any
