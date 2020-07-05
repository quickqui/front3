import React from "react";
import { BooleanInput, TextInput, DateInput } from "react-admin";

export const scalarInput = prop => {
  const { property,disabled } = prop;
  // const{dataModel} = options
  if (property.type === "Boolean") {
    return <BooleanInput disabled={disabled} {...prop} />;
  }
  if (property.type === "DateTime") {
    //FIXME DateTimeInput 有bug。‘can nof read property find of null...' 之类的。
    //可能是跟datasource 配合的bug，否则不会别处没有看到。
    return <DateInput disabled={disabled} {...prop} />;
    // return <DateTimeInput
  }
  return <TextInput disabled={disabled} {...prop} />;
};
