import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen bg-bg text-white">

      {/* Hero */}
      <section className="text-center py-24 px-6">
        <h1 className="text-5xl font-bold mb-6">
          Smart Faculty Workload Management
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto mb-8">
          Automate workload allocation, prevent faculty overload,
          and manage academic resources efficiently.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            to="/login"
            className="bg-primary px-6 py-3 rounded-xl font-semibold hover:bg-blue-600"
          >
            Get Started
          </Link>

          <Link
            to="/login"
            className="border border-white/20 px-6 py-3 rounded-xl hover:bg-white/10"
          >
            Admin Login
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-8 px-12 pb-24">
        {[
          "Automated Workload Calculation",
          "Overload Prevention",
          "Department-wise Reports",
        ].map((feature, i) => (
          <div
            key={i}
            className="bg-card p-8 rounded-2xl shadow-lg border border-white/10"
          >
            <h3 className="text-xl font-semibold mb-3">{feature}</h3>
            <p className="text-gray-400">
              Simplify faculty workload management with modern tools.
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}