import fileExtension from "file-extension";
import unzip from "./utils/unzip";
import { isOPF } from "./utils/file-type";
import parseOPF from "./parser/opf";

window.onload = async () => {
  const allFiles = await unzip("src/books/重构.epub");
  const opfFile = allFiles.find((file) => isOPF(fileExtension(file.name)));
  if (opfFile) {
    parseOPF(await opfFile.async("string"));
  }
};
