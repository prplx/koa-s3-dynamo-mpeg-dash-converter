export type State =
  | 'started'
  | 'converting'
  | 'done'
  | 'uploading'
  | 'downloading'
  | 'error';

export interface DBItem {
  [key: string]: string | State;
  file_url: string;
  state: State;
  etag: string;
}
