const reduce = (previousState = {}, eventAction) => {
  if (eventAction.type.startsWith("QQ/EVENT/")) {
    return {
      ...previousState,
      // [eventAction.type]: [...(previousState[eventAction.type] ?? []), eventAction.payload.event],
      eventLog:[...(previousState.eventLog??[]), eventAction.payload.event]
    };
  }
  return previousState;
};
export default reduce;
