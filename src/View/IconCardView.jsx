import React from "react";
import { ListController } from "react-admin";

import IconCard from "../Component/IconCard";

export const IconCardView = props => {
  const  resource  = props['functionModel'].resource;
    const filter = props["functionModel"]?.query?.filter;

  const location = { pathname: resource };
  const basePath = "/" + resource;
  return (
    <ListController
      location={location}
      basePath={basePath}
      resource={resource}
      filter={filter}
      {...props}
    >
      {controllerProps => (
        <IconCard
          icon={props.functionModel?.parameters?.["icon"]}
          text={props.functionModel?.name}
          value={controllerProps.total}
          {...props}
          {...controllerProps}
        />
      )}
    </ListController>
  );
};
