
export default (previousState = {}, event) => {
  if (event.type.startsWith("QQ/EVENT/")) {
    return {
      ...previousState,
      [event.type]: [...(previousState[event.type] ?? []), event],
    };
  }
  return previousState;
};
