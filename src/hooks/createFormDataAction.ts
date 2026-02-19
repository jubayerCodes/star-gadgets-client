import { ApiResponse } from "@/types";
import { IFile } from "@/types/file";
import { UseMutateAsyncFunction } from "@tanstack/react-query";

export interface IFileFormData<T, U> {
  file: IFile;
  data: T;
  setFile: (file: IFile) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: UseMutateAsyncFunction<ApiResponse<U>, Error, any, unknown>;
  id?: string;
}

export const createFormDataAction = async <T, U>({ file, data, setFile, action, id }: IFileFormData<T, U>) => {
  if (!file.file && !file.preview) {
    setFile({
      file: null,
      error: "Image is required",
    });
    return;
  }

  const formData = new FormData();
  formData.append("data", JSON.stringify(data));

  if (file.file) {
    formData.append("file", file.file);
  }

  if (id) {
    const res = await action({ id, data: formData });
    return res;
  } else {
    const res = await action(formData);
    return res;
  }
};
