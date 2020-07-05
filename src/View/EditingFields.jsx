import React from "react";

import {
  SelectArrayInput,
  ReferenceArrayInput,
  SelectInput,
  ReferenceInput,
  ArrayField,
  ChipField,
  SingleFieldList
} from "react-admin";
import { scalarInput } from "../Component/ScalarInput";
import { StringComponent } from "../Component/StringComponent";

import { applyPresentation, rulesHelp } from "./PresentationUtil";

function forProperty(property, model, prv) {
  const disabled = prv.isDisabled;
  if (model.isTypeRelation(property)) {
    if (model.isTypeList(property)) {
      return (
        <ReferenceArrayInput
          label={property.name}
          source={property.name + "Ids"}
          reference={property.relation.to}
          key={property.name}
          disabled={disabled}
        >
          <SelectArrayInput
            optionText={model.getBriefPropertyName(
              model.getTypeEntity(property)
            )}
          />
        </ReferenceArrayInput>
      );
    } else {
      return (
        <ReferenceInput
          label={property.name}
          source={property.name + ".id"}
          reference={property.relation.to}
          key={property.name}
          disabled={disabled}
        >
          <SelectInput
            optionText={model.getBriefPropertyName(
              model.getTypeEntity(property)
            )}
          />
        </ReferenceInput>
      );
    }
  }
  if (model.isTypeList(property)) {
    if (model.isTypeScalar(property)) {
      return (
        <ArrayField
          source={property.name}
          key={property.name}
          disabled={disabled}
        >
          <SingleFieldList linkType={false}>
            <StringComponent>
              d
              <ChipField source="_label" />
            </StringComponent>
          </SingleFieldList>
        </ArrayField>
      );
    } else {
      return (
        <ArrayField
          source={property.name}
          key={property.name}
          disabled={disabled}
        >
          <SingleFieldList linkType={false}>
            <StringComponent render={record => JSON.stringify(record)}>
              <ChipField source="_label" />
            </StringComponent>
          </SingleFieldList>
        </ArrayField>
      );
    }
  }

  return scalarInput({
    property,
    source: property.name,
    key: property.name,
    disabled
  });
}
export function editingFieldsForCommand(functionModel, model, presentation) {
  //TODO functionModel.properties 是不存在的，有问题，需要更新。
  const properties = functionModel.properties ?? [];
  applyPresentation(presentation, properties).map(property =>
    forProperty(property, model, rulesHelp(presentation, property))
  );
}
export function editingFields(entity, model, presentation) {
  return applyPresentation(presentation, entity.properties).map(property =>
    forProperty(property, model, rulesHelp(presentation, property))
  );
}
