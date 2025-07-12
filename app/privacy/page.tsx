import Link from "next/link";

export default function PrivacyPage() {
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
            <h2 className="text-3xl font-bold text-gray-900">Privacy Policy</h2>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <div className="p-6">
              <p className="text-gray-700">
                This privacy policy will help you understand how we use and protect the data you provide to us when you visit and use our service.
              </p>
              <h3 className="mt-4 font-bold text-gray-900">What User Data We Collect</h3>
              <p className="mt-2 text-gray-700">
                When you visit the website, we may collect the following information:
                <ul>
                  <li>Your IP address.</li>
                  <li>Your contact information and email address.</li>
                  <li>Other information such as interests and preferences.</li>
                  <li>Data profile regarding your online behavior on our website.</li>
                </ul>
              </p>
              <h3 className="mt-4 font-bold text-gray-900">Why We Collect Your Data</h3>
              <p className="mt-2 text-gray-700">
                We are collecting your data for several reasons:
                <ul>
                  <li>To better understand your needs.</li>
                  <li>To improve our services and products.</li>
                  <li>To send you promotional emails containing the information we think you will find interesting.</li>
                  <li>To contact you to fill out surveys and participate in other types of market research.</li>
                  <li>To customize our website according to your online behavior and personal preferences.</li>
                </ul>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
