import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  standalone: false,

  name: "sortByDate",
  pure: true,
})
export class SortByDatePipe implements PipeTransform {
  transform(
    value: any[],
    field: string = "startDate",
    order: "asc" | "desc" = "desc"
  ): any[] {
    if (!Array.isArray(value)) return value;
    const copy = [...value];

    copy.sort((a: any, b: any) => {
      const aDate = this.parseDate(a?.[field]);
      const bDate = this.parseDate(b?.[field]);

      if (!aDate && !bDate) return 0;
      if (!aDate) return order === "asc" ? -1 : 1;
      if (!bDate) return order === "asc" ? 1 : -1;

      if (aDate > bDate) return order === "asc" ? 1 : -1;
      if (aDate < bDate) return order === "asc" ? -1 : 1;
      return 0;
    });

    return copy;
  }

  private parseDate(value: any): Date | null {
    if (!value) return null;
    // handle year-only like '2018' or ISO date strings
    if (/^\d{4}$/.test(value)) return new Date(`${value}-01-01`);
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }
}
