import Link from "next/link";

export default function TermsPage() {
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
            <h2 className="text-3xl font-bold text-gray-900">Terms of Service</h2>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <div className="p-6">
              <p className="text-gray-700">
                Please read these terms of service carefully before using our service.
              </p>
              <h3 className="mt-4 font-bold text-gray-900">1. Conditions of Use</h3>
              <p className="mt-2 text-gray-700">
                We will provide their services to you, which are subject to the conditions stated below in this document. Every time you visit this website, use its services or make a purchase, you accept the following conditions. This is why we urge you to read them carefully.
              </p>
              <h3 className="mt-4 font-bold text-gray-900">2. Privacy Policy</h3>
              <p className="mt-2 text-gray-700">
                Before you continue using our website we advise you to read our privacy policy [link to privacy policy] regarding our user data collection. It will help you better understand our practices.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
