import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-lg mb-6">
        Sorry, we couldn&apos;t find the page you&apos;re looking for.
      </p>
      <Link
        href="/screens/dashboard/"
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
      >
        Return To Dash
      </Link>
    </div>
  );
}
