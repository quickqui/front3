import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

//FIXME 没有实现，意图是把Title写出来的标题覆盖掉，
//因为每个复用的view都会写标题，导致在多个view的page上面，title被连接了。比如dashboard的标题，有很多view参与了。
//类似于“ListView”的component里面有《Title》，使用了reactDom，portal
export const OverrideTitle = (prop) => {
  const { className, defaultTitle, record, title, translate, ...rest } = prop;
  const container = document.getElementById("react-admin-title");
  if (!container) return null;
  //NOTE 没有尝试成功。router也需要修改这个node，会矛盾。可能没有别的办法。
  try {
    console.log("begin to remove children");
    while (container.firstChild) {
      console.log(container.firstChild);
      container.removeChild(container.firstChild);
      console.log("removed");
    }
  } catch (e) {
    console.log("tried");
  }

  const titleElement = !title ? (
    <span className={className} {...rest}>
      {defaultTitle}
    </span>
  ) : typeof title === "string" ? (
    <span className={className} {...rest}>
      {title}
    </span>
  ) : (
    React.cloneElement(title, { className, record, ...rest })
  );
  return ReactDOM.createPortal(titleElement, container);
};

// OverrideTitle.propTypes = {
//   defaultTitle: PropTypes.string,
//   className: PropTypes.string,
//   record: PropTypes.object,
//   title: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
// };

// export default translate(OverrideTitle);
export default OverrideTitle;
