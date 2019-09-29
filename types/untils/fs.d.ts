export declare const fsPromise: <T>(method: string, ...args: any) => Promise<T>;
export interface ReadFileRef {
    type: 'file' | 'dir';
    filePath: string;
    parentDirPath?: string;
    fileName: string;
}
export declare const _readDir: (pathUri: string, relativePath: string, listReadFile: ReadFileRef[]) => Promise<void>;
export declare const readDir: (pathUri: string) => Promise<ReadFileRef[]>;
export declare const mkdir: (dir: string) => Promise<void>;
export declare const perfectMkdir: (dir: string, mklist?: string[], main?: boolean) => boolean;
export declare const checkFileAndMkdir: (filePath: string) => boolean;
