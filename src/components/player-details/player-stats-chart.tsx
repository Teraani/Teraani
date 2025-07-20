"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { ChartTooltip, ChartTooltipContent, ChartContainer } from "../ui/chart"

const chartData = [
  { round: '#11', points: 13.10 },
  { round: '#12', points: 0.00 },
  { round: '#13', points: 2.60 },
  { round: '#14', points: -0.80 },
  { round: '#15', points: 9.70 },
];

export default function PlayerStatsChart() {
  return (
    <ChartContainer config={{
      points: {
        label: "Pontos",
      },
    }} className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="round" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} />
          <Tooltip 
            cursor={false}
            content={<ChartTooltipContent indicator="dot" />}
          />
          <Bar dataKey="points" radius={4}>
            {chartData.map((entry, index) => (
              <rect key={`cell-${index}`} fill={entry.points >= 0 ? "hsl(var(--primary))" : "hsl(var(--destructive))"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
