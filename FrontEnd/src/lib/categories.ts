import { apiFetch } from "@/lib/api";

export type CategoryNode = {
  id: number;
  key: string;
  name_fa: string;
  parent_id?: number;
  children?: CategoryNode[];
};

export type CategoryTreeResponse = {
  data: CategoryNode[];
};

export type ParentOption = { label: string; value: string; id: number };
export type ChildOption = {
  label: string;
  value: string;
  id: number;
  parentKey: string;
  parentId: number;
};

export async function fetchCategoryTree() {
  const res = await apiFetch("/categories/tree", { method: "GET" });
  const json = (await res.json()) as CategoryTreeResponse;

  if (!res.ok) {
    throw new Error((json as any)?.error || "خطا در دریافت دسته‌بندی‌ها");
  }

  return json.data;
}

export function buildCategoryOptions(tree: CategoryNode[]) {
  const parents: ParentOption[] = [];
  const children: ChildOption[] = [];

  for (const p of tree) {
    parents.push({ id: p.id, value: p.key, label: p.name_fa });

    for (const c of p.children ?? []) {
      children.push({
        id: c.id,
        value: c.key,
        label: c.name_fa,
        parentKey: p.key,
        parentId: p.id,
      });
    }
  }

  return { parents, children };
}
