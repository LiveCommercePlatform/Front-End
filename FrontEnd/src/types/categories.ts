export type CategoryNode = {
  id: number;
  key: string;
  name_fa: string;
  children?: { id: number; key: string; name_fa: string; parent_id: number }[];
};

export type CategoryTreeResponse = { data: CategoryNode[] };

export type CategoryOption = { value: string; label: string; id:number };
export type CategoryTagsMap = Record<string, { value: string; label: string; id: number }[]>;
