import {
  Link,
  NavLink,
  Outlet,
  redirect,
  useLoaderData,
  useNavigate,
} from "react-router";
import { getExistingUser, logoutUser, storeUserData } from "~/appwrite/auth";
import { account } from "~/appwrite/client";

export async function clientLoader() {
  try {
    const user = await account.get();
    if (!user.$id) return redirect("/sign-in");

    const existingUser = await getExistingUser(user.$id);

    return existingUser?.$id ? existingUser : await storeUserData();
  } catch (error) {
    console.log("Error in clientLoader", error);
    return redirect("/sign-in");
  }
}

const PageLayout = () => {
  const user = useLoaderData();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/sign-in");
  };

  return (
    <>
      <header className="root-nav h-[100px] wrapper relative z-20">
        <Link to="/">
          <img
            src="/assets/icons/logo.svg"
            alt="logo"
            className="size-[30px]"
          />
          <h1>Tourvisto</h1>
        </Link>

        <aside>
          {user?.status === "admin" ? (
            <NavLink
              to={"/dashboard"}
              className="text-base md:text-lg font-light text-white"
            >
              Admin Panel
            </NavLink>
          ) : (
            <p className="text-lg font-light text-white">{user?.name}</p>
          )}

          <img
            src={user?.imageUrl || "/assets/images/david.webp"}
            alt={user?.name || "David"}
            referrerPolicy="no-referrer"
            className="size-10 rounded-full aspect-square"
          />
          <button
            onClick={handleLogout}
            className="cursor-pointer flex flex-row items-center bg-white/30 size-10 rounded-full hover:bg-white/40 transition-all duration-500"
          >
            <img
              src="/assets/icons/logout.svg"
              alt="logout"
              className="size-6 ml-1.5"
            />
          </button>
        </aside>
      </header>

      <main className="w-full h-full bg-light-300 pt-12 lg:pt-10">
        <Outlet />
      </main>
    </>
  );
};

export default PageLayout;
