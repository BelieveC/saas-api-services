import Link from "next/link";

export const metadata = {
  title: "Welcome | Chai API Services",
  description: "Get started with Chai API Services",
};

export default function Home() {
  return (
    <div className="min-h-screen grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-20 gap-16 font-geist-sans">
      <main className="flex flex-col gap-8 row-start-2">
        <h1 className="text-4xl font-bold">Chai API Services</h1>

        <Link
          href="/dashboard"
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
        >
          Manage API Keys
        </Link>

        <div className="text-center max-w-2xl">
          <p className="text-lg mb-4">
            Powerful API services for your applications. Generate and manage API
            keys, monitor usage, and scale your projects with ease.
          </p>
        </div>

        <div className="flex gap-4">
          <a
            className="flex items-center justify-center gap-2 h-12 px-5 rounded-full bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] transition-colors duration-200 text-base leading-5 font-medium cursor-pointer border border-transparent"
            href="https://docs.chaiapi.services"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read Documentation
          </a>
          <a
            href="https://github.com/yourusername/chai-api-services"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center min-w-[180px] h-12 px-5 rounded-full border border-black/[0.08] dark:border-white/[0.145] hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent transition-colors duration-200 text-base leading-5 font-medium"
          >
            View on GitHub
          </a>
        </div>
      </main>
    </div>
  );
}
