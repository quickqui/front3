import { Property, Presentation, PropertyRule } from "@quick-qui/model-defines";
import _ from "lodash";
import { ModelWrapped } from "../Model";

export function findPresentation(
  model: ModelWrapped,
  presentationName: string | undefined,
  resourceName: string
): Presentation | undefined {
  const presentations = model?.presentationModel?.presentations;
  const re = presentations?.find(
    presentation => presentation.name === presentationName
  );
  if (!re) {
    //NOTE default，不是model的机制，而是front与model的私下约定。
    return presentations?.find(presentation => presentation.name === "default");
  }
  return re;
}

function propertyOrder(presentation: Presentation, property: Property): number {
  return (
    presentation?.propertyRules?.find(pr => pr.property === property.name)
      ?.order ?? 0
  );
}

export function applyPresentation(
  presentation: Presentation,
  properties: Property[]
): Property[] {
  return _(properties)
    .filter(prop => {
      return !rulesHelp(presentation, prop).isHidden; //TODO 可能有问题，如果hidden就根本不渲染，submit的时候可能不包括，那么prefill可能不起作用
    })
    .sortBy(prop => propertyOrder(presentation, prop))
    .value();
}

export interface PropertyRuleView {
  isHidden: boolean;
  isDisabled: boolean;
  component: string | undefined;
}

export function rulesHelp(
  presentation: Presentation | undefined,
  property: Property
): PropertyRuleView {
  const rule: PropertyRule | undefined = presentation?.propertyRules?.find(
    propertyRule => propertyRule.property === property.name
  );
  return {
    //TODO 引入白名单， 当有property定义shown的时候，其他自动hidden
    isHidden: rule?.rules?.find(it => it === "hidden") ? true : false,
    isDisabled: rule?.rules?.find(it => it === "disabled") ? true : false,
    component:rule?.rules?.find(it => it.startsWith("resolve:"))
  };
}
