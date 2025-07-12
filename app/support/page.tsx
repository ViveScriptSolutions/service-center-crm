import Link from "next/link";

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            <Link href="/">ServicePro</Link>
          </h1>
          <nav className="space-x-4">
            <Link href="/about" className="text-gray-500 hover:text-gray-700">
              About
            </Link>
            <Link href="/contact" className="text-gray-500 hover:text-gray-700">
              Contact
            </Link>
          </nav>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-3xl font-bold text-gray-900">Support</h2>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <div className="p-6">
              <p className="text-gray-700">
                If you need any help or support, please feel free to contact us.
              </p>
              <dl className="mt-4 sm:divide-y sm:divide-gray-200">
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Email
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    support@servicepro.com
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Phone
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    +1 (555) 123-4567
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
