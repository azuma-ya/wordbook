"use client";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

import {} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface Props {
  data: {
    level: number;
    count: number;
  }[];
}

const chartConfig = {
  1: {
    label: "苦手",
    color: "hsl(var(--chart-1))",
  },
  2: {
    label: "まだ",
    color: "hsl(var(--chart-2))",
  },
  3: {
    label: "うろ覚え",
    color: "hsl(var(--chart-3))",
  },
  4: {
    label: "ほぼ覚えた",
    color: "hsl(var(--chart-4))",
  },
  5: {
    label: "覚えた",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

const Chart = ({ data }: Props) => {
  const total = data.reduce((acc, item) => acc + item.count, 0);

  const label = (level: number) => {
    switch (level) {
      case -1:
        return "苦手";
      case 0:
        return "まだ";
      case 1:
        return "うろ覚え";
      case 2:
        return "ほぼ覚えた";
      case 3:
        return "覚えた";
      default:
        return "覚えた";
    }
  };

  const transformedData = data.reduce(
    (acc, { level, count }) => {
      acc[label(level)] = count;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square w-full max-w-[250px]"
    >
      <RadialBarChart
        data={[transformedData]}
        innerRadius={80}
        outerRadius={130}
      >
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 6}
                      className="fill-foreground text-2xl font-bold"
                    >
                      {`${total.toLocaleString()}問`}
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </PolarRadiusAxis>
        <RadialBar
          dataKey="苦手"
          stackId="a"
          cornerRadius={5}
          fill="var(--color-1)"
          className="stroke-transparent stroke-2"
        />
        <RadialBar
          dataKey="まだ"
          fill="var(--color-2)"
          stackId="a"
          cornerRadius={5}
          className="stroke-transparent stroke-2"
        />
        <RadialBar
          dataKey="うろ覚え"
          fill="var(--color-3)"
          stackId="a"
          cornerRadius={5}
          className="stroke-transparent stroke-2"
        />
        <RadialBar
          dataKey="ほぼ覚えた"
          fill="var(--color-4)"
          stackId="a"
          cornerRadius={5}
          className="stroke-transparent stroke-2"
        />
        <RadialBar
          dataKey="覚えた"
          fill="var(--color-5)"
          stackId="a"
          cornerRadius={5}
          className="stroke-transparent stroke-2"
        />
      </RadialBarChart>
    </ChartContainer>
  );
};

export default Chart;
