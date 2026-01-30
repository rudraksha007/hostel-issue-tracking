'use client';
import { useRouter } from 'next/navigation';
import { AuthAPI } from '@/lib/api/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/card';
import { Button } from '@repo/ui/components/button';

export default function Logout() {
    const router = useRouter();

    const handleLogout = async () => {
        await AuthAPI.logout();
        router.refresh();
    };

    const handleCancel = () => {
        router.push('/dashboard');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-5">
            <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Are you sure you want to logout?</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex gap-4">
                <Button
                    onClick={handleLogout}
                    variant="destructive"
                    className="flex-1"
                >
                    Logout
                </Button>
                <Button
                    onClick={handleCancel}
                    variant="secondary"
                    className="flex-1"
                >
                    Cancel
                </Button>
                </div>
            </CardContent>
            </Card>
        </div>
    );
}
