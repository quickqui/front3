import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { translate, warning } from "ra-core";


//FIXME 没有实现，意图是把Title写出来的标题覆盖掉，
//因为每个复用的view都会写标题，导致在多个view的page上面，title被连接了。比如dashboard的标题，有很多view参与了。
//类似于“ListView”的component里面有《Title》，使用了reactDom，portal
export const OverrideTitle = ({
  className,
  defaultTitle,
  record,
  title,
  translate,
  ...rest
}) => {
  const container = document.getElementById("react-admin-title");
  if (!container) return null;
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  warning(!defaultTitle && !title, "Missing title prop in <Title> element");

  const titleElement = !title ? (
    <span className={className} {...rest}>
      {defaultTitle}
    </span>
  ) : typeof title === "string" ? (
    <span className={className} {...rest}>
      {translate(title, { _: title })}
    </span>
  ) : (
    React.cloneElement(title, { className, record, ...rest })
  );
  return ReactDOM.createPortal(titleElement, container);
};

OverrideTitle.propTypes = {
  defaultTitle: PropTypes.string,
  className: PropTypes.string,
  record: PropTypes.object,
  translate: PropTypes.func.isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
};

export default translate(OverrideTitle);
