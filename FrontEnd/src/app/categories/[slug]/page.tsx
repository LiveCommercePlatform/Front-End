import { notFound } from "next/navigation" // برای نمایش صفحه 404 در صورت عدم وجود داده
import { useEffect, useState } from "react"

type CategoryPageProps = {
  params: {
    slug: string
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params
  const [categoryData, setCategoryData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // فرض کنیم که از این API می‌خواهیم داده‌ها رو بگیریم
    const fetchCategoryData = async () => {
      try {
        const res = await fetch(`/api/categories/${slug}`)

        if (!res.ok) {
          notFound()  // در صورت عدم موفقیت در دریافت داده، صفحه 404 نمایش داده می‌شود.
        }

        const data = await res.json()
        setCategoryData(data)
      } catch (error) {
        console.error("Error fetching category data:", error)
        notFound()  // در صورت خطا در دریافت داده، صفحه 404 نمایش داده می‌شود.
      } finally {
        setLoading(false)
      }
    }

    fetchCategoryData()
  }, [slug])

  if (loading) {
    return <div>در حال بارگذاری...</div>
  }

  if (!categoryData) {
    return <div>داده‌ای برای این دسته پیدا نشد!</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">دسته‌بندی: {slug}</h1>
      <p>دسته: {categoryData.name}</p>
      <ul>
        {categoryData.products.map((product: any) => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
    </div>
  )
}
