import { useAuth, signOut } from "../../lib/authContext";
import Link from "next/link";

export default function Header(props: any) {
  const { user, loading } = useAuth();

  return (
    <div className="flex h-full flex-row">
      <div className="flex-1 my-auto ml-3">
        <Link href="/">
          <button>fontquick</button>
        </Link>
      </div>

      <div className="m-auto space-x-2 mr-3">
        {!user && !loading ? (
          <>
            <Link passHref href="/signin">
              <button className="m-auto">signin</button>
            </Link>
          </>
        ) : null}
        {user ? (
          <>
            <Link href="/app">
              <button>fonts</button>
            </Link>

            <button onClick={signOut}>signout</button>
          </>
        ) : null}
      </div>
    </div>
  );
}
