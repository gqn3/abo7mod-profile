import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const AnalyticsChart = ({ data }: { data: Array<{ date: string; views: number }> }) => (
  <div className="h-72 rounded-[2rem] border border-white/10 bg-white/[0.04] p-4">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="views" x1="0" x2="0" y1="0" y2="1">
            <stop offset="5%" stopColor="#d7b46a" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#d7b46a" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
        <XAxis dataKey="date" stroke="#9b9b91" />
        <YAxis stroke="#9b9b91" allowDecimals={false} />
        <Tooltip contentStyle={{ background: "#080808", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16, color: "#f5f5f0" }} />
        <Area type="monotone" dataKey="views" stroke="#d7b46a" fillOpacity={1} fill="url(#views)" />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);
