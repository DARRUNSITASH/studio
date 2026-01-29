
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function ProfilePage() {
    const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar-1');

    return (
        <Card>
            <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Manage your personal information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                        {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt="User Avatar" />}
                        <AvatarFallback>RK</AvatarFallback>
                    </Avatar>
                    <Button variant="outline">Change Photo</Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                     <div className="grid gap-2">
                        <Label htmlFor="full-name">Full Name</Label>
                        <Input id="full-name" defaultValue="Ravi Kumar" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue="r.kumar@example.com" />
                    </div>
                </div>

                <Button>Save Changes</Button>

            </CardContent>
        </Card>
    )
}
