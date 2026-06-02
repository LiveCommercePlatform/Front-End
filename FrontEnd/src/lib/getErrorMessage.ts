const errorMap: Record<string, string> = {
  "Invalid email": "ایمیل نامعتبر است!",
  "Invalid password": "رمز عبور نامعتبر است!",
  "Verification code expired": "کد تایید منقضی شده است!",
  "Invalid verification code": "کد تایید اشتباه است!",
  "User not found": "کاربری با این مشخصات یافت نشد!",
  "Incorrect current password":"پسورد فعلی نادرست وارد شده!",
  "Invalid credentials": "کاربر مورد نظر یافت نشد.",
  "profile_not_completed": "اطلاعات شخصی را در داشبورد تکمیل کنید.",
  "You are the owner, you cannot dislike your own product":"مالک نمیتواند محصول خود را دیسلایک کند! ",
  "You are the owner, you cannot like your own product":"مالک نمیتواند محصول خود رالایک کند! ",
  "Email already exists":"ایمیل وارد شده در سیستم موجود است.",
  "live_room_not_live":"لایو در حال پخش نیست.",
}

export function getErrorMessage(
  backendError?: string
): string {
  if (!backendError) {
    return "خطایی رخ داده است. لطفاً دوباره تلاش کنید"
  }

  return errorMap[backendError] || "خطای غیرمنتظره‌ای رخ داد"
}
