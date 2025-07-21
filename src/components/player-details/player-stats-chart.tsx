"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts"
import { ChartTooltip, ChartTooltipContent, ChartContainer } from "../ui/chart"

interface PlayerStatsChartProps {
  data: { round: string; points: number }[];
}


export default function PlayerStatsChart({ data }: PlayerStatsChartProps) {
  return (
    <ChartContainer config={{
      points: {
        label: "Pontos",
      },
    }} className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 0, left: -30, bottom: 5 }} barCategoryGap="20%">
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="round" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} allowDecimals={false} />
          <Tooltip 
            cursor={{ fill: 'transparent' }}
            content={<ChartTooltipContent indicator="dot" />}
          />
          <Bar dataKey="points" stackId="a" radius={[4, 4, 0, 0]} >
            {data.map((entry, index) => (
               <Cell key={`cell-${index}`} fill={entry.points >= 0 ? "hsl(var(--primary))" : "hsl(var(--destructive))"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
