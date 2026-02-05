"use client";

import * as React from "react";
import {
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  Legend,
  LegendProps,
} from "recharts";
import { cn } from "@/lib/utils";

// -----------------------------------------------------------------------------
// Chart config type
// -----------------------------------------------------------------------------

export type ChartConfig = Record<
  string,
  {
    label?: string;
    color?: string;
    icon?: React.ComponentType<{ className?: string }>;
  }
>;

// -----------------------------------------------------------------------------
// Chart context
// -----------------------------------------------------------------------------

const ChartContext = React.createContext<{
  config: ChartConfig;
}>({ config: {} });

function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }
  return context;
}

// -----------------------------------------------------------------------------
// ChartContainer
// -----------------------------------------------------------------------------

export interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig;
  children: React.ReactElement;
}

const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ config, className, children, ...props }, ref) => {
    const cssVars = React.useMemo(() => {
      const vars: Record<string, string> = {};
      Object.entries(config).forEach(([key, value]) => {
        if (value?.color) {
          vars[`--color-${key}`] = value.color;
        }
      });
      return vars;
    }, [config]);

    return (
      <ChartContext.Provider value={{ config }}>
        <div
          ref={ref}
          style={cssVars as React.CSSProperties}
          className={cn("min-h-[200px] w-full", className)}
          {...props}
        >
          <ResponsiveContainer width="100%" height="100%">
            {children}
          </ResponsiveContainer>
        </div>
      </ChartContext.Provider>
    );
  }
);
ChartContainer.displayName = "ChartContainer";

// -----------------------------------------------------------------------------
// ChartTooltip
// -----------------------------------------------------------------------------

export interface ChartTooltipContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  hideLabel?: boolean;
  hideIndicator?: boolean;
  indicator?: "line" | "dot" | "dashed";
  nameKey?: string;
  labelKey?: string;
  labelFormatter?: (label: unknown, payload: unknown[]) => React.ReactNode;
  formatter?: (value: unknown, name: unknown, item: unknown, index: number, payload: unknown[]) => React.ReactNode;
  active?: boolean;
  payload?: Array<{ name?: string; value?: unknown; dataKey?: string; payload?: Record<string, unknown> }>;
  label?: unknown;
}

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  ChartTooltipContentProps
>(
  (
    {
      className,
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      labelKey,
      nameKey,
      labelFormatter,
      formatter,
      active,
      payload = [],
      label,
      ...props
    },
    ref
  ) => {
    const { config } = useChart();
    if (!active || !payload?.length) return null;
    const labelValue =
      !hideLabel && (labelKey ? (payload[0]?.payload as Record<string, unknown>)?.[labelKey] ?? label : label);
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border border-gray-200 bg-white p-2 shadow-md dark:border-gray-800 dark:bg-gray-950",
          className
        )}
        {...props}
      >
        {labelValue != null && labelValue !== "" && (
          <div className="mb-2 text-sm font-medium">
            {typeof labelFormatter === "function"
              ? labelFormatter(labelValue, payload)
              : String(labelValue)}
          </div>
        )}
        <div className="flex flex-col gap-1.5">
          {payload.map((item, index) => {
            const key = (nameKey ?? item.dataKey ?? item.name ?? "value") as string;
            const configItem = config[key];
            const value =
              typeof formatter === "function"
                ? formatter(item.value, item.name, item, index, payload)
                : item.value;
            return (
              <div
                key={String(item.dataKey ?? index)}
                className="flex items-center gap-2 text-sm"
              >
                {!hideIndicator && configItem?.color && (
                  <span
                    className="shrink-0 rounded-[2px] border"
                    style={{
                      backgroundColor: configItem.color,
                      borderColor: configItem.color,
                      width: indicator === "line" ? "8px" : "8px",
                      height: indicator === "line" ? "2px" : "8px",
                    }}
                  />
                )}
                <span className="text-gray-500 dark:text-gray-400">
                  {configItem?.label ?? key}:
                </span>
                <span className="font-medium">{String(value ?? "")}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);
ChartTooltipContent.displayName = "ChartTooltipContent";

export interface ChartTooltipProps extends Omit<TooltipProps<number, string>, 'content'> {
  content?: React.ReactNode;
}

function ChartTooltip({
  content,
  ...props
}: ChartTooltipProps) {
  const resolvedContent: TooltipProps<number, string>['content'] =
    content === undefined
      ? (tooltipProps) => (
          <ChartTooltipContent {...(tooltipProps as React.ComponentProps<typeof ChartTooltipContent>)} />
        )
      : typeof content === "function"
        ? content as TooltipProps<number, string>['content']
        : () => content;

  return <Tooltip {...props} content={resolvedContent} />;
}

// -----------------------------------------------------------------------------
// ChartLegend
// -----------------------------------------------------------------------------

/** Props for custom legend content. Kept separate from Legend to avoid type conflicts with HTMLAttributes. */
export interface ChartLegendContentProps extends React.HTMLAttributes<HTMLDivElement> {
  nameKey?: string;
  payload?: Array<{ value?: unknown; dataKey?: unknown; name?: string; [key: string]: unknown }>;
  formatter?: (value: unknown, name: unknown, item: unknown, index?: number) => React.ReactNode;
}

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  ChartLegendContentProps
>(
  (
    { className, nameKey, payload, formatter, ...props },
    ref
  ) => {
    const { config } = useChart();
    if (!payload?.length) return null;
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-wrap items-center gap-4",
          className
        )}
        {...props}
      >
        {payload.map((item) => {
          const rawKey = nameKey ?? item.dataKey ?? item.value ?? "value";
          const keyStr = typeof rawKey === "string" || typeof rawKey === "number" ? String(rawKey) : "item";
          const configItem = config[keyStr];
          const value =
            typeof formatter === "function"
              ? formatter(item.value, item.name, item)
              : item.value;
          const displayValue: React.ReactNode =
            value == null || value === ""
              ? null
              : typeof value === "object" && !React.isValidElement(value)
                ? String(value)
                : (value as React.ReactNode);
          return (
            <div
              key={keyStr}
              className="flex items-center gap-2 text-sm"
            >
              {configItem?.color && (
                <span
                  className="shrink-0 rounded-[2px]"
                  style={{
                    backgroundColor: configItem.color,
                    width: "8px",
                    height: "8px",
                  }}
                />
              )}
              <span className="text-muted-foreground">
                {configItem?.label ?? keyStr}
              </span>
              {displayValue != null && displayValue !== "" ? (
                <span className="font-medium">{displayValue}</span>
              ) : null}
            </div>
          );
        })}
      </div>
    );
  }
);
ChartLegendContent.displayName = "ChartLegendContent";

type ChartLegendProps = Omit<
  LegendProps & React.ComponentPropsWithoutRef<typeof ChartLegendContent>,
  'ref'
>;

function ChartLegend({ content, ...props }: ChartLegendProps) {
  return (
    <Legend
      {...props}
      content={content ?? <ChartLegendContent />}
    />
  );
}

// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  useChart,
};
