import DashboardLayout from "../components/DashboardLayout";

export default function Reports() {
  const downloadCSV = () => {
    window.open("http://localhost:5000/api/reports/workload-csv");
  };

  return (
    <DashboardLayout title="Reports">
      <div className="bg-card p-6 rounded-2xl max-w-md">
        <h3 className="text-lg font-bold mb-4">
          Workload Reports
        </h3>

        <button
          onClick={downloadCSV}
          className="bg-green-600 px-4 py-2 rounded-lg"
        >
          Download CSV Report
        </button>
      </div>
    </DashboardLayout>
  );
}