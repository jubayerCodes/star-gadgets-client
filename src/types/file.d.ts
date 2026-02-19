export interface IFile {
  file: File | FileMetadata | null;
  preview?: string | null;
  error?: string | null;
}
