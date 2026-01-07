import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/button";

export default function UserMenu() {
  const { logout } = useAuth();

  return (
    <Button
      variant="ghost"
      className="w-full btn-logout"
      onClick={logout}
    > Logout
    </Button>
  );
}