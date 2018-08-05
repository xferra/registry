import { Dependency } from './deps';
import { Meta } from './meta';

/**
 * This abstract class describes methods of package manager object
 */
export abstract class Manager {

    protected name: string;
    private cached: { [key: string]: any };

    constructor(name: string) {
        this.name = name;
        this.cached = {};
    }

    private requestCache(key: string, value?: any) : any
    {
        if (!value) {
            return this.cached[key];
        }
        this.cached[key] = value;
    }

    protected async cache(
        request: (name: string, version?: string) => Promise<any>, 
        name: string, 
        version?: string ) : Promise<any> 
        {
        const key = `${name}:${version}`;
        if(!this.requestCache(key)) {
            this.requestCache(key, await request(name, version));
        }
        return this.requestCache(key);
    }

    /**
     * Get package meta-information
     * @param {string} name - package name
     * @param {string} version - package version, latest by default
     */
    abstract async getMeta(name: string, version?: string) : Promise<Meta>;

    /**
     * Get package dependesies
     * @param {string} name - package name
     * @param {string} version - package version, latest by default
     */
    abstract async getDeps(name: string, version?: string) : Promise<Dependency[]>;

    /**
     * Get list of package versions
     * @param {string} name - package name
     */
    abstract async getVersions(name: string) : Promise<string[]>;
}
