interface reqOps {
    useModFuncs: boolean
}

/**
 * 
 * @function
 * Imports/Requires .sst file code
 * 
 * @param options useModFuncs:boolean
 * Not implemented yet..
 * 
 */
export function reqScript(name: string, options: reqOps) : any

/**
 * 
 * @function
 * Converts .sst into a valid .js file
 */
export function convertScript(name: string) : void