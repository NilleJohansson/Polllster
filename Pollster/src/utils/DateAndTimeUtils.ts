import { format, formatDistanceToNow } from "date-fns";

export function getTimeFromEvent(timestamp: number, addSuffix: boolean = true): string {
      if (typeof timestamp === 'undefined' || isNaN(timestamp)) {
            return "Invalid time";
      }

      return formatDistanceToNow(new Date(timestamp * 1000), { addSuffix: addSuffix });
}

export function formatToDDMMYYY(timestamp: number): string {
      return format(new Date(timestamp * 1000), 'MMM dd, yyyy');
}