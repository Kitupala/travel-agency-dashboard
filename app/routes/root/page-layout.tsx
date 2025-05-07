import { useNavigate } from "react-router";
import { logoutUser } from "~/appwrite/auth";

const PageLayout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/sign-in");
  };

  return (
    <div className="flex items-center gap-12 p-12">
      <button onClick={handleLogout} className="cursor-pointer">
        <img src="/assets/icons/logout.svg" alt="logout" className="size-6" />
      </button>

      <button
        onClick={() => {
          navigate("/dashboard");
        }}
        className="cursor-pointer"
      >
        Go to Dashboard →
      </button>
    </div>
  );
};

export default PageLayout;
