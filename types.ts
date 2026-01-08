
export enum KPopGroup {
  ONEUS = 'ONEUS',
  ONF = 'ONF',
  VERIVERY = 'VERIVERY',
  P1HARMONY = 'P1HARMONY'
}

export interface Post {
  id: string;
  groupId: KPopGroup;
  title: string;
  cp: string;
  penName: string;
  writingDate: string;
  genre: string[];
  isAdult: boolean;
  isCollab: boolean;
  collabName?: string;
  content: string;
  imageUrl?: string;
  createdAt: number;
}

export interface GroupMeta {
  id: KPopGroup;
  image: string;
  color: string;
  description: string;
}
