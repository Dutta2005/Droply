import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DashboardContent from "@/components/DashboardContent";
import { CloudUpload, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";

export default async function Dashboard() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId) {
    redirect("/sign-in");
  }

  // Serialize the user data to avoid passing the Clerk User object directly
  const serializedUser = user
    ? {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        username: user.username,
        emailAddress: user.emailAddresses?.[0]?.emailAddress,
      }
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-default-50 via-primary-50/30 to-secondary-50/20">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-primary-200/20 to-secondary-200/20 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-secondary-200/20 to-primary-200/20 blur-3xl animate-pulse delay-1000"></div>
      </div>

      <Navbar user={serializedUser} />

      <main className="flex-1 container mx-auto py-8 px-6 relative z-10">
        {/* Enhanced welcome section */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-2 rounded-full bg-gradient-to-r from-primary-100 to-secondary-100">
              <Sparkles className="h-6 w-6 text-primary-600" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Welcome Back
            </h1>
          </div>
          <p className="text-default-600 text-lg max-w-2xl mx-auto">
            Your personal cloud storage is ready. Upload, organize, and access your files from anywhere with ease.
          </p>
        </div>

        <DashboardContent
          userId={userId}
          userName={
            user?.firstName ||
            user?.fullName ||
            user?.emailAddresses?.[0]?.emailAddress ||
            ""
          }
        />
      </main>

      {/* Enhanced footer */}
      <footer className="relative z-10 bg-gradient-to-r from-default-100/80 to-primary-100/20 backdrop-blur-sm border-t border-default-200/50">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="p-2 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500">
                <CloudUpload className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-white">
                  Droply
                </h2>
                <p className="text-xs text-default-500">Cloud Storage Simplified</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-default-500 text-sm">
                &copy; {new Date().getFullYear()} Droply. All rights reserved.
              </p>
              <p className="text-xs text-default-400 mt-1">
                Secure • Fast • Reliable
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}