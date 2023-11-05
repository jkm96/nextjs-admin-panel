import Link from "next/link";

export default function NotAuthenticated() {
    return(
        <div className="grid m-4 place-items-center">
            <h1 className="w3-jumbo w3-animate-top w3-center text-2xl text-red-500"><code>Access Denied</code></h1>
            <hr className="w3-border-white w3-animate-left m-auto w-1/2"/>
            <h3 className="w3-center w3-animate-right">You are not authenticated to access this resource.</h3>
            <h3 className="w3-center w3-animate-zoom">🚫🚫🚫🚫</h3>
            <h6 className="w3-center w3-animate-zoom">error code:403 forbidden</h6>
            <Link className="text-blue-700" href="/auth/signin">Please Log in</Link>
        </div>
    );
}
