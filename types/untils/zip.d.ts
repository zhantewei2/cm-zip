export interface zipRuntime {
    (filepath: string): void;
}
export declare const zipFolder: (inputDir: string, targetFilePath: string, runtime?: zipRuntime) => Promise<void>;
export declare const zipLoad: (zipFilePath: string, outDir: string, runtime?: zipRuntime) => Promise<void>;
