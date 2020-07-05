import realtimeSaga from "ra-realtime";

const observeRequest = (realtimeResources, interval) => dataProvider => (
  type,
  resource,
  params
) => {
  // Filtering so that only posts are updated in real time
  if (!realtimeResources || !realtimeResources.includes(resource)) return null;

  // Use your apollo client methods here or sockets or whatever else including the following very naive polling mechanism
  return {
    subscribe(observer) {
      let intervalId = setInterval(() => {
        dataProvider(type, resource, params)
          .then(results => observer.next(results)) // New data received, notify the observer
          .catch(error => observer.error(error)); // Ouch, an error occurred, notify the observer
      }, interval);

      const subscription = {
        unsubscribe() {
          // Clean up after ourselves
          if (intervalId) {
            clearInterval(intervalId);
            intervalId = undefined;
            // Notify the saga that we cleaned up everything
            observer.complete();
          }
        }
      };
      return subscription;
    }
  };
};

export default (resources, interval) => dataProvider =>
  realtimeSaga(observeRequest(resources, interval)(dataProvider));
