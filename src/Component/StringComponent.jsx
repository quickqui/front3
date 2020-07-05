import { cloneElement } from "react";
export const StringComponent = ({ record, render, children, ...rest }) =>
  cloneElement(children, {
    record: { _label: render ? render(record) : record },
    ...rest
  });
