import { useState } from "react";
import { User, Moon, Sun, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useNavigate } from "react-router-dom";

interface HeaderMenuProps {
  user: { username: string; avatar?: string };
  onSignOut?: () => void;
}

export default function HeaderMenu({ user, onSignOut }: HeaderMenuProps) {
  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setDarkMode(!darkMode);
  };

  const handleProfileEdit = () => {
    setOpen(false);
    navigate("/profile");
  };

  const handleSignOut = async () => {
    setOpen(false);
    if (onSignOut) {
      onSignOut();
    } else {
      try {
        await fetch("/api/auth/logout", { method: "POST" });
        window.location.href = "/auth";
      } catch (err) {
        console.error("Sign out failed:", err);
      }
    }
  };

  const initials = user?.username?.slice(0, 2).toUpperCase() || "?";

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger className="focus:outline-none">
        <Avatar className="w-10 h-10 cursor-pointer hover:ring-2 hover:ring-emerald-500 transition-all">
          <AvatarImage src={user?.avatar || undefined} />
          <AvatarFallback className="bg-emerald-600 text-white text-lg font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 mt-2">
        <DropdownMenuItem onClick={handleProfileEdit} className="cursor-pointer">
          <User className="w-4 h-4 mr-2" />
          Edit Profile
        </DropdownMenuItem>

        <DropdownMenuItem onClick={toggleTheme} className="cursor-pointer">
          {darkMode ? (
            <>
              <Sun className="w-4 h-4 mr-2" />
              Light Mode
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 mr-2" />
              Dark Mode
            </>
          )}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-400">
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}