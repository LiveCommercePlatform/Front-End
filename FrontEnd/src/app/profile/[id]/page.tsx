import { redirect } from "next/navigation";

export default function ProfileRootPage({ params }: { params: { id: string } }) {
  redirect(`/profile/${params.id}/products`);
}
