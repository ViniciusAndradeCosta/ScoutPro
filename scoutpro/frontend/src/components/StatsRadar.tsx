import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface StatsRadarProps {
  data: Array<{
    attribute: string;
    value: number;
    fullMark: number;
  }>;
}

export function StatsRadar({ data }: StatsRadarProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart data={data}>
        <PolarGrid stroke="rgba(255, 255, 255, 0.15)" strokeWidth={2} />
        <PolarAngleAxis
          dataKey="attribute"
          tick={{ fill: '#8b92a8', fontSize: 13 }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 100]}
          tick={{ fill: '#8b92a8', fontSize: 11 }}
          tickCount={6}
        />
        <Radar
          name="Stats"
          dataKey="value"
          stroke="#00d9ff"
          fill="#00d9ff"
          fillOpacity={0.4}
          strokeWidth={3}
          dot={{ fill: '#00d9ff', r: 5 }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
