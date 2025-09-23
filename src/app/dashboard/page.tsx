import { KeyMetrics } from '@/components/dashboard/key-metrics';
import { RiskMap } from '@/components/dashboard/risk-map';
import { SensorDataChart } from '@/components/dashboard/sensor-data-chart';
import { RecentAlerts } from '@/components/dashboard/recent-alerts';
import { ActionPlanGenerator } from '@/components/dashboard/action-plan-generator';
import { DataSources } from '@/components/dashboard/data-sources';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <KeyMetrics />
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
        <div className="lg:col-span-3 grid gap-6 lg:gap-8">
          <RiskMap />
          <SensorDataChart />
        </div>
        <div className="lg:col-span-2 grid gap-6 lg:gap-8 auto-rows-max">
          <ActionPlanGenerator />
          <DataSources />
          <RecentAlerts />
        </div>
      </div>
    </div>
  );
}
