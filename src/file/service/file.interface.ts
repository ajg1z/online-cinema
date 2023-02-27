import { AuthorTypeFile } from '../file.model';

export interface FullPathPayload {
  authorType: AuthorTypeFile;
  name: string;
  type?: string;
}
