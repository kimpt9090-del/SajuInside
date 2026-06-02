"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
} from "recharts";
import type { ScoreReport } from "@/features/tests/engine";
import {
  buildPairBarsFromReport,
  buildRadarFromReport,
  hasChartData,
} from "@/lib/chart-data";

const COLORS = {
  primary: "#6366f1",
  primaryFill: "rgba(99, 102, 241, 0.35)",
  left: "#0ea5e9",
  right: "#8b5cf6",
};

export function ResultChart({ report }: { report: ScoreReport }) {
  const radarData = useMemo(() => buildRadarFromReport(report), [report]);
  const pairData = useMemo(() => buildPairBarsFromReport(report), [report]);
  const [tab, setTab] = useState<"radar" | "bars">(
    pairData.length > 0 ? "radar" : "radar",
  );

  if (!hasChartData(report)) return null;

  const showTabs = pairData.length > 0 && radarData.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-4"
    >
      {showTabs ? (
        <div className="flex gap-2 rounded-xl bg-zinc-100 p-1">
          <TabButton active={tab === "radar"} onClick={() => setTab("radar")}>
            레이더
          </TabButton>
          <TabButton active={tab === "bars"} onClick={() => setTab("bars")}>
            축별 비교
          </TabButton>
        </div>
      ) : null}

      <div className="h-[300px] w-full sm:h-[320px]">
        {tab === "radar" && radarData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="72%">
              <PolarGrid stroke="#e4e4e7" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: "#52525b", fontSize: 12, fontWeight: 600 }}
              />
              <Radar
                name="점수"
                dataKey="value"
                stroke={COLORS.primary}
                fill={COLORS.primary}
                fillOpacity={0.4}
                strokeWidth={2}
                animationDuration={800}
                animationEasing="ease-out"
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #e4e4e7",
                  fontSize: 13,
                }}
                formatter={(value) => [`${Number(value ?? 0)}%`, "비율"]}
              />
            </RadarChart>
          </ResponsiveContainer>
        ) : null}

        {tab === "bars" && pairData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={pairData}
              layout="vertical"
              margin={{ left: 8, right: 16, top: 8, bottom: 8 }}
            >
              <XAxis type="number" domain={[0, 100]} hide />
              <YAxis
                type="category"
                dataKey="name"
                width={36}
                tick={{ fill: "#71717a", fontSize: 12 }}
              />
              <Tooltip
                cursor={{ fill: "rgba(0,0,0,0.04)" }}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #e4e4e7",
                }}
                formatter={(value, name, props) => {
                  const row = props.payload as (typeof pairData)[0];
                  const label =
                    name === "left" ? row.leftLabel : row.rightLabel;
                  return [`${Number(value ?? 0)}%`, label];
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: 12 }}
                formatter={(value) =>
                  value === "left" ? "첫 번째 극" : "두 번째 극"
                }
              />
              <Bar
                dataKey="left"
                stackId="a"
                radius={[4, 0, 0, 4]}
                animationDuration={700}
              >
                {pairData.map((_, i) => (
                  <Cell key={`l-${i}`} fill={COLORS.left} />
                ))}
              </Bar>
              <Bar
                dataKey="right"
                stackId="a"
                radius={[0, 4, 4, 0]}
                animationDuration={700}
              >
                {pairData.map((_, i) => (
                  <Cell key={`r-${i}`} fill={COLORS.right} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : null}

        {tab === "bars" && pairData.length === 0 && radarData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={radarData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <XAxis
                dataKey="subject"
                tick={{ fill: "#71717a", fontSize: 11 }}
                interval={0}
                angle={-20}
                textAnchor="end"
                height={56}
              />
              <YAxis domain={[0, 100]} tick={{ fill: "#a1a1aa", fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #e4e4e7",
                }}
                formatter={(v) => [`${Number(v ?? 0)}%`, "비율"]}
              />
              <Bar
                dataKey="value"
                radius={[8, 8, 0, 0]}
                animationDuration={700}
              >
                {radarData.map((_, i) => (
                  <Cell
                    key={i}
                    fill={i % 2 === 0 ? COLORS.primary : COLORS.left}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : null}
      </div>
    </motion.div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex-1 rounded-lg py-2 text-sm font-semibold transition",
        active
          ? "bg-white text-zinc-900 shadow-sm"
          : "text-zinc-500 hover:text-zinc-700",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
