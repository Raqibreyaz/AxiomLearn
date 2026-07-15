/* Spec §14 — Status Pill */

type PillStatus = "success" | "warning" | "danger" | "info" | "default";

interface StatusPillProps {
  status: PillStatus;
  label: string;
}

const statusClasses: Record<PillStatus, string> = {
  success: "bg-success-tint text-success",
  warning: "bg-[#F6EBD3] text-gold",
  danger:  "bg-danger-tint text-danger",
  info: "bg-axiom-tint text-axiom",
  default: "bg-line text-t2",
};

const StatusPill = ({ status, label }: StatusPillProps) => (
  <span
    className={`
      inline-block font-mono text-[10.5px] px-[9px] py-[3px] rounded-pill
      ${statusClasses[status]}
    `}
  >
    {label}
  </span>
);

export default StatusPill;
