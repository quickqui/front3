import React from "react";
import {
  ArrayField,
  ChipField,
  SingleFieldList,
  ReferenceArrayField,
  ReferenceField,
  TextField
} from "react-admin";
import { StringComponent } from "../Component/StringComponent";
import { scalarField } from "../Component/ScalarField";
import { SimpleTable } from "../Component/SampleTable";
import { applyPresentation, rulesHelp } from "./PresentationUtil";
import { parseRefWithProtocolInsure } from "@quick-qui/model-defines";
import { resolveWithOutDefault } from "../Resolve";

export function showingFields(entity, model, presentation) {
  return applyPresentation(presentation, entity.properties).map(property => {
    const component = rulesHelp(presentation, property).component;
    if (component) {
      const { path } = parseRefWithProtocolInsure(component);
      const ReactComponent = React.lazy(() => resolveWithOutDefault(path));
      return (
          <ReactComponent
            source={property.name}
            property={property}
            key={property.name}
            addLabel={true}
          />
      );
    }
    if (model.isTypeRelation(property)) {
      if (model.isTypeList(property)) {
        return (
          <ReferenceArrayField
            label={property.name}
            source={property.name + "Ids"}
            reference={property.relation.to}
            key={property.name}
          >
            <SimpleTable property={property} model={model} />
          </ReferenceArrayField>
        );
      } else {
        return (
          <ReferenceField
            label={property.name}
            source={property.name + ".id"}
            reference={property.relation.to}
            key={property.name}
          >
            <TextField
              source={model.getBriefPropertyName(model.getTypeEntity(property))}
            />
          </ReferenceField>
        );
      }
    }
    if (model.isTypeList(property)) {
      if (model.isTypeScalar(property)) {
        return (
          <ArrayField source={property.name} key={property.name}>
            <SingleFieldList linkType={false}>
              <StringComponent>
                <ChipField source="_label" />
              </StringComponent>
            </SingleFieldList>
          </ArrayField>
        );
      } else {
        return (
          <ArrayField source={property.name} key={property.name}>
            <SingleFieldList linkType={false}>
              <StringComponent render={record => JSON.stringify(record)}>
                <ChipField source="_label" />
              </StringComponent>
            </SingleFieldList>
          </ArrayField>
        );
      }
    }

    return scalarField({
      property,
      source: property.name,
      key: property.name
    });
  });
}
