import api from "./axios"

export type UploadedImageResponse = {
  message: string
  filename: string
  file_url: string
}

export async function uploadAdminImage(
  file: File
): Promise<UploadedImageResponse> {
  const formData = new FormData()

  formData.append("file", file)

  const response = await api.post<UploadedImageResponse>(
    "/admin/uploads/images",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  )

  return response.data
}
