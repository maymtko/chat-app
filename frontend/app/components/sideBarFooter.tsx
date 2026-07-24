import { logout } from "@/hooks/logout";
import { ThemeToggle } from "./themeToglgle"; // Adjust paths as needed
import { LogOut } from 'lucide-react';
import { clearUserlogout } from '@/lib/features/auth/authSlice'
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/lib/store'
import Image from "next/image";

export function SidebarFooter() {
      
    const dispatch = useDispatch<AppDispatch>()
    const router = useRouter();

     const { user } = useSelector(
    (state: RootState) => state.auth
  )
console.log('userrr',user,user?.photo_url);

  const handleLogout = () => {
    logout();
    router.push("/");
    dispatch(clearUserlogout())
  };



  return (
    <div className="mt-auto p-4 border-t border-slate-200 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-900/40 flex items-center justify-between">
      {/* Left Profile Info */}
      <div className="flex items-center gap-3">
        {/* <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center font-medium text-xs text-slate-700 dark:text-zinc-300">
        </div> */}
        <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center overflow-hidden">
        {user?.photo_url ? (
          <Image
            src={user.photo_url}
            alt="Profile"
            width={32}
            height={32}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-xs font-medium text-slate-700 dark:text-zinc-300">
            {user?.display_name?.[0]?.toUpperCase() ?? "U"}
          </span>
        )}
      </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-slate-700 dark:text-zinc-200 leading-none">
            {user?.display_name ?? "Username"}
          </span>
          <span className="text-xs text-slate-400 dark:text-zinc-500 mt-1">
            Online
          </span>
        </div>
      </div>

      {/* Right Actions Container*/}
      <div className="flex items-center gap-1">
        {/*Theme Toggle */}
        <ThemeToggle />

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="p-2 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-zinc-800/50 transition-colors duration-200 cursor-pointer"
          aria-label="Log Out"
        >
          <LogOut size={18} />
        </button>
      </div>
    </div>
  );
}