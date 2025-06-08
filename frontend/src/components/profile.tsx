import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";

interface ProfileCardProps {
  name: string;
  email: string;
  branch: string;
  batch: string;
  degree: string;
  facultyAdvisor: string;
  imageUrl?: string;
}

export function ProfileCard({
  name,
  email,
  branch,
  batch,
  degree,
  facultyAdvisor,
  imageUrl,
}: ProfileCardProps) {
  return (
    <Card className="w-full max-w-md mx-auto !border-none !shadow-none">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="w-20 h-20">
          <AvatarImage src={imageUrl} alt={name} />
          <AvatarFallback>
            {name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-2xl">{name}</CardTitle>
          <p className="text-sm text-muted-foreground">{email}</p>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 gap-2">
          <InfoItem label="Branch" value={branch} />
          <InfoItem label="Batch" value={batch} />
          <InfoItem label="Degree" value={degree} />
          <InfoItem label="Faculty Advisor" value={facultyAdvisor} />
        </div>
      </CardContent>
    </Card>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <Label className="text-sm font-medium text-muted-foreground">
        {label}
      </Label>
      <span className="text-sm">{value}</span>
    </div>
  );
}
