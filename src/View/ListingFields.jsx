import React from "react";

import { FunctionField, ReferenceField, TextField } from "react-admin";
import { scalarField } from "../Component/ScalarField";
import { applyPresentation } from "./PresentationUtil";

export function listingFields(entity, model, presentation) {
  return applyPresentation(presentation, entity.properties)
    .map(property => {
      if (model.isTypeRelation(property)) {
        if (model.isTypeList(property)) {
          return (
            <FunctionField
              key={property.name}
              label={property.name + " - Count"}
              render={record =>
                (record[property.name] && record[property.name].length) || 0
              }
            />
          );
        } else {
          return (
            <ReferenceField
              label={property.name}
              //TODO 协议穿透？ 需要fakedata（以及各种dataprovider）返回xxxx.id形式的relate
              source={property.name + ".id"}
              reference={property.relation.to}
              key={property.name}
            >
              <TextField
                source={model.getBriefPropertyName(
                  model.getTypeEntity(property)
                )}
              />
            </ReferenceField>
          );
        }
      }
      if (model.isTypeList(property)) {
        return (
          <FunctionField
            key={property.name}
            label={property.name + " - Count"}
            render={record =>
              (record[property.name] && record[property.name].length) || 0
            }
          />
        );
      }
      return scalarField({
        property,
        source: property.name,
        key: property.name
      });
    })
}
