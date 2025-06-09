import { Bell, User } from "lucide-react";

const Header = () => {
  return (
    <header className="flex items-center justify-between px-6 py-3 bg-gradient-to-r from-cyan-700 to-purple-900 text-white shadow-md">
      <h2 className="text-lg font-semibold">Home</h2>

      <div className="flex items-center gap-4">
        <div className="relative">
          <input
            className="rounded-lg px-3 py-1 text-sm text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            type="text"
            placeholder="Search..."
          />
        </div>

        <div className="relative">
          <Bell className="w-5 h-5 cursor-pointer hover:text-cyan-300 transition" />
          <span className="absolute -top-2 -right-2 text-[10px] bg-red-600 text-white rounded-full px-1.5 py-0.5 leading-none">
            3
          </span>
        </div>

        <div className="flex items-center gap-2">
          <User className="w-6 h-6" />
          <span className="text-sm font-medium">NKASE_DEMO_TARGET</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
