import TransportDistributionChart from "./TransportDistributionChart";
import TrendChart from "./TrendChart";
import ErrorCard from "../common/ErrorCard";

const DashboardAnalytics = ({ analytics, loading, error }) => {
  return (
    <section className="grid gap-5">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <TrendChart
          title="Uploads per week"
          description="Track how many documents were uploaded over the past 6 weeks."
          data={analytics.uploadsPerWeek}
          labelKey="week"
          dataKey="count"
        />

        <TrendChart
          title="Itineraries per month"
          description="See month-over-month growth in your trip plans."
          data={analytics.itinerariesPerMonth}
          labelKey="month"
          dataKey="count"
        />

        <TransportDistributionChart data={analytics.transportDistribution} />
      </div>

      {error ? <ErrorCard message={error} /> : null}
    </section>
  );
};

export default DashboardAnalytics;
