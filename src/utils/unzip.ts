import JSZip from "jszip";

export default async function unzip(url: string): Promise<JSZip.JSZipObject[]> {
  const zip = new JSZip();
  const file = await fetch(url);
  await zip.loadAsync(file.blob());
  const allFiles = Object.values(zip.files);
  return allFiles;
}
