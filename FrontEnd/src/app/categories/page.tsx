import { Card, CardContent } from "@/components/ui/card";
import {
  FaDesktop,
  FaCamera,
  FaUsers,
  FaChartBar,
  FaVideo,
  FaBook,
} from "react-icons/fa";

const categories = [
  {
    title: "تحلیل کسب و کار",
    description: "توضیحاتی درباره تحلیل کسب و کار و اهمیت آن.",
    icon: <FaChartBar className="w-10 h-10 text-orange-500" />,
  },
  {
    title: "مدیریت و ارتباطات",
    description: "توضیح کوتاهی از این دوره، برخی از مزایا.",
    icon: <FaUsers className="w-10 h-10 text-teal-500" />,
  },
  {
    title: "طراحی وب",
    description: "توضیح کوتاهی از این دوره.",
    icon: <FaDesktop className="w-10 h-10 text-blue-500" />,
  },
  {
    title: "گیت‌هاب",
    description: "توضیح کوتاهی از این دوره.",
    icon: <FaBook className="w-10 h-10 text-green-500" />,
  },
  {
    title: "ایجاد ویدیو",
    description: "توضیح کوتاهی از این دوره.",
    icon: <FaVideo className="w-10 h-10 text-yellow-500" />,
  },
  {
    title: "عکاسی",
    description: "توضیح کوتاهی از این دوره.",
    icon: <FaCamera className="w-10 h-10 text-pink-500" />,
  },
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-[#faf9f6] py-16 px-6">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-14">
        دسته بندی محصولات
      </h1>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {categories.map((category, index) => (
          <Card
            key={index}
            className="bg-white shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden border border-gray-100"
          >
            <div className="flex justify-end px-6">
              <div className="bg-gradient-to-r from-blue-50 to-emerald-50 h-20 w-20 flex justify-center items-center rounded-2xl">
                {category.icon}
              </div>
            </div>
            <CardContent className="text-start px-6">
              <h2 className="text-lg font-bold text-gray-800 mb-3">
                {category.title}
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">
                {category.description}
              </p>
              <div className="flex justify-end">
                <button className="text-emerald-600 font-medium hover:underline transition">
                  → مشاهده
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}