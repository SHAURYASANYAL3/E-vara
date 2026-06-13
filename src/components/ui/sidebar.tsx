import * as React from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const getRandomWidth = () => `${Math.floor(Math.random() * 40) + 50}%`;

const SidebarMenuSkeleton = React.forwardRef<HTMLDivElement, React.ComponentProps<"div"> & { showIcon?: boolean }>(
  ({ className, showIcon = false, ...props }, ref) => {
    const width = React.useMemo(() => getRandomWidth(), []);
    return (
      <div ref={ref} className={cn("flex h-8 items-center gap-2 rounded-md px-2", className)} {...props}>
        {showIcon && <Skeleton className="size-4 rounded-md" />}
        <Skeleton className="h-4 flex-1" style={{ "--skeleton-width": width } as React.CSSProperties} />
      </div>
    );
  }
);
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton";

export { SidebarMenuSkeleton };