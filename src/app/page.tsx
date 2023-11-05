import Link from "next/link";

export default function Dashboard() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
    <Link href="/auth/signin" className="text-red-600">Sign In</Link>
    </main>
  )
}
