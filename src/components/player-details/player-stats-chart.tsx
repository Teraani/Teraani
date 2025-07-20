"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts"
import { ChartTooltip, ChartTooltipContent, ChartContainer } from "../ui/chart"

const chartData = [
  { round: '1', points: 10, other: 3.10 },
  { round: '2', points: 0, other: 0 },
  { round: '3', points: 2, other: 0.60 },
  { round: '4', points: -0.80, other: 0 },
  { round: '5', points: 8, other: 1.70 },
];

export default function PlayerStatsChart() {
  return (
    <ChartContainer config={{
      points: {
        label: "Pontos",
      },
      other: {
        label: "Outros",
      }
    }} className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 5, right: 0, left: -30, bottom: 5 }} barCategoryGap="20%">
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="round" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} allowDecimals={false} />
          <Tooltip 
            cursor={{ fill: 'transparent' }}
            content={<ChartTooltipContent indicator="dot" />}
          />
          <Bar dataKey="points" stackId="a" radius={[4, 4, 0, 0]} >
            {chartData.map((entry, index) => (
               <Cell key={`cell-${index}`} fill={entry.points >= 0 ? "hsl(var(--primary))" : "hsl(var(--destructive))"} />
            ))}
          </Bar>
           <Bar dataKey="other" stackId="a" radius={[4, 4, 0, 0]} fill={"hsl(var(--primary) / 0.5)"} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}