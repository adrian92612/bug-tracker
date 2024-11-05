import { cn } from "@/lib/utils";

type LabelValueProps = {
  label: string;
  value: string | number;
  className?: string;
  labelCN?: string;
  valueCN?: string;
};

export const LabelValue = ({
  label,
  value,
  className,
  labelCN,
  valueCN,
}: LabelValueProps) => {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <h3 className={cn("font-bold", labelCN)}>{label}</h3>
      <p className={cn(valueCN)}>{value}</p>
    </div>
  );
};
