"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4", className)}
      // classNames={{
      //   months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
      //   month: "space-y-4",
      //   caption: "flex justify-center pt-1 relative items-center px-8",
      //   caption_label: "text-sm font-medium",
      //   nav: "flex items-center",
      //   nav_button: cn(
      //     buttonVariants({ variant: "outline" }),
      //     "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 transition-opacity"
      //   ),
      //   nav_button_previous: "absolute left-1",
      //   nav_button_next: "absolute right-1",
      //   table: "w-full border-collapse space-y-1",
      //   head_row: "flex",
      //   head_cell: "text-muted-foreground rounded-md w-10 font-medium text-[0.8rem] h-10 flex items-center justify-center",
      //   row: "flex w-full mt-2",
      //   cell: cn(
      //     "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent/50",
      //     "first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
      //   ),
      //   day: cn(
      //     buttonVariants({ variant: "ghost" }),
      //     "h-10 w-10 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground"
      //   ),
      //   day_range_end: "day-range-end",
      //   day_selected: 
      //     "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-md transition-colors",
      //   day_today: "bg-accent text-accent-foreground rounded-md",
      //   day_outside: 
      //     "text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
      //   day_disabled: "text-muted-foreground opacity-50",
      //   day_range_middle:
      //     "aria-selected:bg-accent aria-selected:text-accent-foreground",
      //   day_hidden: "invisible",
      //   ...classNames,
      // }}
      
      components={{
            Chevron: (props) => {
               if (props.orientation === "left") {
                 return <ChevronLeft {...props} />;
               }
               return <ChevronRight {...props} />;
             },
            }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }