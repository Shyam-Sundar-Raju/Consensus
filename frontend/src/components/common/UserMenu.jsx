import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/button";

export default function UserMenu() {
  const { logout } = useAuth();

  return (
    <Button
      variant="ghost"
      className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50"
      onClick={logout}
    >
      <span className="mr-2">🚪</span> Logout
    </Button>
  );
}