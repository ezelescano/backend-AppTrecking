import { IComments } from "./IComments";

export interface IPostComments {
  id: string;
  user_id: string;
  content: string;
  image_url?: string;
  place_id?: string;
  comments: IComments[];
}
