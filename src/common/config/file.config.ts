// Key => FileDirectory
export const UPLOAD_FILE_SERVICE_LIST = ['course__course_cover_image'] as const;
export type UPLOAD_FILE_SERVICE_KEY = (typeof UPLOAD_FILE_SERVICE_LIST)[number];

export enum SIZE_UNIT {
  B = 1,
  KB = 1024,
  MB = 1024 * 1024,
  GB = 1024 * 1024 * 1024,
  PB = 1024 * 1024 * 1024 * 1024,
}

export interface UPLOAD_FILE_SERVICE_CONFIG {
  maxSize: number;
  limit: number;
  savePath: string;
}

export const FILE_CONFIG: Record<
  UPLOAD_FILE_SERVICE_KEY,
  UPLOAD_FILE_SERVICE_CONFIG
> = {
  course__course_cover_image: {
    limit: 1,
    maxSize: 300 * SIZE_UNIT.MB,
    savePath: 'course',
  },
};
