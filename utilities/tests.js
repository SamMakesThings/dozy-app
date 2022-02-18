/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export function findByTestID(container, testID) {
  return container.findWhere((node) => node.prop('testID') === testID);
}
