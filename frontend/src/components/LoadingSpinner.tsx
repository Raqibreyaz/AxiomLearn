interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
}

const sizeMap = {
  sm: "w-5 h-5",
  md: "w-8 h-8",
  lg: "w-12 h-12",
};

const LoadingSpinner = ({ size = "md", fullScreen = false }: LoadingSpinnerProps) => {
  const spinner = (
    <div
      className={`${sizeMap[size]} rounded-full border-2 border-purple-500/30 border-t-purple-500 animate-spin`}
    />
  );

  if (fullScreen) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          {spinner}
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
