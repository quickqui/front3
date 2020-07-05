import { cloneElement } from "react";
export const FormPrefill = ({ record, children, prefill, ...rest }) => {
  return cloneElement(children, {
    record: { ...record, ...prefill },
    ...rest,
    ...children.props
  });
};
