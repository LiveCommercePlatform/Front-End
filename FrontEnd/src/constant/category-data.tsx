import {
  FaDesktop,
  FaCamera,
  FaUsers,
  FaChartBar,
  FaVideo,
  FaBook,
} from "react-icons/fa";


export const categories_data = [
  {
    title: "تحلیل کسب و کار",
    description: "توضیحاتی درباره تحلیل کسب و کار و اهمیت آن.",
    icon: <FaChartBar className="w-10 h-10 text-orange-500" />,
    name: "business-analytics", // تگ انگلیسی برای URL
  },
  {
    title: "مدیریت و ارتباطات",
    description: "توضیح کوتاهی از این دوره، برخی از مزایا.",
    icon: <FaUsers className="w-10 h-10 text-teal-500" />,
    name: "management-communication", // تگ انگلیسی برای URL
  },
  {
    title: "طراحی وب",
    description: "توضیح کوتاهی از این دوره.",
    icon: <FaDesktop className="w-10 h-10 text-blue-500" />,
    name: "web-design", // تگ انگلیسی برای URL
  },
  {
    title: "گیت‌هاب",
    description: "توضیح کوتاهی از این دوره.",
    icon: <FaBook className="w-10 h-10 text-green-500" />,
    name: "github", // تگ انگلیسی برای URL
  },
  {
    title: "ایجاد ویدیو",
    description: "توضیح کوتاهی از این دوره.",
    icon: <FaVideo className="w-10 h-10 text-yellow-500" />,
    name: "video-creation", // تگ انگلیسی برای URL
  },
  {
    title: "عکاسی",
    description: "توضیح کوتاهی از این دوره.",
    icon: <FaCamera className="w-10 h-10 text-pink-500" />,
    name: "photography", // تگ انگلیسی برای URL
  },
];