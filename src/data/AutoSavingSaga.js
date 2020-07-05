import { takeLatest, put, takeEvery, take } from "redux-saga/effects";

export default function* () {
    yield takeEvery("AUTO_SAVING_ON_CHANGE", saveIt);
}
// function* saveIt2{l
//     console.log('what?')
// }

export function saveItAction(autoSavingAction) {
  const { record, source, value, resource } = autoSavingAction.payload;
  return {
    type: "RA/CRUD_UPDATE",
    payload: {
      id: record.id,
      data: { ...record, [source]: value },
      previousData: record,
    },
    meta: {
      resource,
      fetch: "UPDATE",
      onSuccess: {
        notification: {
          body: "ra.notification.updated",
          level: "info",
          messageArgs: {
            smart_count: 1,
          },
        },
      },
      onFailure: {
        notification: {
          body: "ra.notification.http_error",
          level: "warning",
        },
      },
    },
  };
}
export function* saveIt(autoSavingAction) {
  try {
    yield put(saveItAction(autoSavingAction));
  } catch (e) {
    console.error("request error: ", e);
  }
}
