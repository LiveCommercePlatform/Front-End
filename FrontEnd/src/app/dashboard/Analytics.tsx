export default function AnalyticsTab() {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">تحلیل‌ها</h3>

      <div className="p-6 bg-white rounded-xl shadow">
        <p className="text-gray-600">
          در این بخش می‌توانید گزارش‌های آماری، نمودارها و تحلیل عملکرد سیستم را مشاهده کنید.
        </p>

        <div className="mt-4 text-sm text-gray-500">
          (اینجا بعداً می‌تونی chart، جدول یا فیلتر تاریخ اضافه کنی)
        </div>
      </div>
    </div>
  );
}
