import React from "react"; // we need this to make JSX compile
import { Datagrid, ShowButton } from "react-admin";
import * as R from "ramda";
import { listingFields } from "../View/ListingFields";

export const SimpleTable = props => {
  const { property, model } = props;
  console.log(property);
  // const relationType = model && model.types && model.types.find(ty => ty.name === field.typeRef.name);
  const relationPro = (model.entities ?? []).find(
    R.propEq("name", property.relation.to)
  );
  return (
    <Datagrid {...props}>
      {listingFields(relationPro, model)}
      <ShowButton />
    </Datagrid>
  );
};
