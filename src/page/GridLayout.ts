interface LayoutTemplate {
  columns?: number | string;
  rows?: number | string;
}
interface LayoutItem {
  column?: number | string;
  row?: number | string;
}
function forOneTemplate(template: string | undefined | number): string {
  if (template) {
    if (typeof template === "number") {
      return "1fr ".repeat(template).trim();
    } else {
      return template;
    }
  } else {
    return "1fr ".repeat(3).trim();
  }
}
function forOneItem(item: string | undefined | number): string {
  if (item) {
    if (typeof item === "number") {
      return "span " + item;
    } else {
      return item;
    }
  } else {
    return "span 1";
  }
}
export function getGridTemplate(layout: LayoutTemplate) {
  const columns = forOneTemplate(layout.columns);
  const rows = forOneTemplate(layout.rows);
  return { gridTemplateColumns: columns, gridTemplateRows: rows };
}
export function getGridItem(layout: LayoutItem) {
  return {
    gridColumn: forOneItem(layout.column),
    gridRow: forOneItem(layout.row),
  };
}
