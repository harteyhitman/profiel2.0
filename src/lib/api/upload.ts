import axiosInstance from '../axios';

export interface UploadProfileImageResponse {
  url: string;
  message: string;
}

export interface UploadChurchLogoResponse {
  url: string;
  message: string;
}

export const uploadAPI = {
  /**
   * Upload profile image
   * POST /api/upload/profile
   */
  uploadProfileImage: async (file: File): Promise<UploadProfileImageResponse> => {
    const formData = new FormData();
    formData.append('image', file); // Client uses 'image' field name based on ImageUpload component
    
    const response = await axiosInstance.post<UploadProfileImageResponse>('/upload/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Upload church logo
   * POST /api/churches/:churchId/logo (client uses this)
   * POST /api/upload/church/:churchId/logo (document shows this, but client uses churches endpoint)
   */
  uploadChurchLogo: async (churchId: number, file: File): Promise<UploadChurchLogoResponse> => {
    const formData = new FormData();
    formData.append('logo', file); // Client uses 'logo' field name
    
    // Use /churches/:churchId/logo to match client folder implementation
    const response = await axiosInstance.post<UploadChurchLogoResponse>(`/churches/${churchId}/logo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
