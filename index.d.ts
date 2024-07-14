declare module "file-extension" {
  function fileExtension(filename: string): string;
  export = fileExtension;
}

declare module "xml2json" {
  export function toJson(xml: string, options?: any): string;
}
