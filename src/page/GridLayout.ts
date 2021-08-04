interface LayoutTemplate {
  columns?: number | string;
  rows?: number | string;
}
interface LayoutItem {
  column?: number | string;
  row?: number | string;
}
function forOneTemplate(template: string | number): string {
  if (typeof template === "number") {
    return "1fr ".repeat(template).trim();
  } else {
    return template;
  }
}
function forOneItem(item: string | number | undefined): string {
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
export function getGridTemplate(layout: LayoutTemplate | string | number) {
  let copied: LayoutTemplate = {};
  if (typeof layout === "number" || typeof layout === "string") {
    copied = { columns: layout };
  } else {
    copied = { ...layout };
  }
  const columns = copied.columns
    ? { gridTemplateColumns: forOneTemplate(copied.columns) }
    : { gridAutoColumns: "1fr" };
  const rows = copied.rows
    ? { gridTemplateRows: forOneTemplate(copied.rows) }
    : { gridAutoRows: "1fr" };
  return { ...columns, ...rows };
}
export function getGridItem(layout: LayoutItem) {
  return {
    gridColumn: forOneItem(layout.column),
    gridRow: forOneItem(layout.row),
  };
}
