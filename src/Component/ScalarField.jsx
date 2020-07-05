import React from "react";
import { TextField, BooleanField, DateField } from "react-admin";

export const scalarField = prop => {
  const { property } = prop;
  if (property.type === "Boolean") {
    return <BooleanField {...prop} />;
  }
  if (property.type === "DateTime") {
    return <DateField {...prop} />;
  }
  return <TextField {...prop} />;
};
