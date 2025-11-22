import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token');

    if (!authToken) {
        redirect('/login');
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Admin Header could go here */}
            {children}
        </div>
    );
}
