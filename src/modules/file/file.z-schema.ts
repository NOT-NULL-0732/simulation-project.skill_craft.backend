import { z } from 'zod';
import { UPLOAD_FILE_SERVICE_KEY } from '@/common/config/file.config';

export const ServiceKeySchema = z.enum(
  Object.keys(UPLOAD_FILE_SERVICE_KEY) as [
    keyof typeof UPLOAD_FILE_SERVICE_KEY,
  ],
);
export const UploadFileZSchema = z.object({
  service: ServiceKeySchema,
});
