import { Card, CardContent } from "@/components/ui/card";

export function WelcomeBanner() {
  return (
    <Card className="bg-primary/10 border-0">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Chào mừng trở lại, Alex!</h2>
            <p className="text-muted-foreground max-w-md">
              Khóa học Vượt qua nỗi sợ nói trước công chúng của bạn đã được 11 người dùng mới hoàn thành trong tuần này!
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
