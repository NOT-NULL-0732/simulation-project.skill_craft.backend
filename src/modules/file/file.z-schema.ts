import { z } from 'zod';
import { UPLOAD_FILE_SERVICE_LIST } from '@/common/config/file.config';

export const ServiceKeySchema = z.enum(UPLOAD_FILE_SERVICE_LIST);
export const UploadFileZSchema = z.object({
  service: ServiceKeySchema,
});
