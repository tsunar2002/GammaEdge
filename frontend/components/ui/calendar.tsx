"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker, useDayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function CalendarFooter() {
    const { previousMonth, nextMonth, goToMonth } = useDayPicker();
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
    const [currentDisplayMonth, setCurrentDisplayMonth] = React.useState(() => new Date());
    
    // Update current display month when navigation happens
    React.useEffect(() => {
        setErrorMessage(null);
    }, [previousMonth, nextMonth]);
    
    // Calculate date boundaries
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Earliest allowed month (3 months back from current month)
    const earliestMonth = currentMonth - 2;
    const earliestYear = currentYear;
    
    // Latest allowed month (current month)
    const latestMonth = currentMonth;
    const latestYear = currentYear;
    
    // Check if we can navigate
    const canGoPrevious = () => {
        if (!previousMonth) return false;
        const prevMonth = previousMonth.getMonth();
        const prevYear = previousMonth.getFullYear();
        
        // Check if previous month is >= earliest allowed month
        if (prevYear < earliestYear) return false;
        if (prevYear === earliestYear && prevMonth < earliestMonth) return false;
        return true;
    };
    
    const canGoNext = () => {
        if (!nextMonth) return false;
        const nxtMonth = nextMonth.getMonth();
        const nxtYear = nextMonth.getFullYear();
        
        // Check if next month is <= latest allowed month
        if (nxtYear > latestYear) return false;
        if (nxtYear === latestYear && nxtMonth > latestMonth) return false;
        return true;
    };

    const handlePreviousClick = () => {
        if (canGoPrevious() && previousMonth) {
            goToMonth(previousMonth);
            setCurrentDisplayMonth(previousMonth);
            setErrorMessage(null);
        } else {
            setErrorMessage("Only 3 months of history allowed");
        }
    };

    const handleNextClick = () => {
        if (canGoNext() && nextMonth) {
            goToMonth(nextMonth);
            setCurrentDisplayMonth(nextMonth);
            setErrorMessage(null);
        } else {
            setErrorMessage("Cannot simulate future dates");
        }
    };

    return (
        <div className="flex flex-col w-full mt-4 border-t border-border">
            <div className="flex justify-between w-full pt-2">
                <button 
                    onClick={handlePreviousClick}
                    className={cn(buttonVariants({ variant: "outline" }), "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100")}
                    type="button"
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>
                <button 
                    onClick={handleNextClick}
                    className={cn(buttonVariants({ variant: "outline" }), "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100")}
                    type="button"
                >
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
            {errorMessage && (
                <div className="text-xs text-red-500 text-center mt-2 font-medium animate-in fade-in slide-in-from-top-1">
                    {errorMessage}
                </div>
            )}
        </div>
    );
}

function Calendar({
  className,
  classNames,
  showOutsideDays = false,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      hideWeekdays
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center hidden", // Hide default nav
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "hidden",
        head_cell: "hidden",
        row: "flex w-full mt-2 justify-between",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      footer={<CalendarFooter />}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
