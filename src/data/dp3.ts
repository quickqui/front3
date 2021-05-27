import {
  DataProvider,
  GET_LIST,
  GET_ONE,
  GET_MANY,
  GET_MANY_REFERENCE,
  UPDATE,
  UPDATE_MANY,
  CREATE,
  DELETE,
  DELETE_MANY,
} from "@quick-qui/data-provider";
const re = (dp2: DataProvider) => ({
  getList: (resource: any, params: any) => dp2(GET_LIST, resource, params),
  getOne: (resource: any, params: any) => dp2(GET_ONE, resource, params),

  getMany: (resource: any, params: any) => dp2(GET_MANY, resource, params),

  getManyReference: (resource: any, params: any) =>
    dp2(GET_MANY_REFERENCE, resource, params),

  update: (resource: any, params: any) => dp2(UPDATE, resource, params),

  updateMany: (resource: any, params: any) =>
    dp2(UPDATE_MANY, resource, params),

  create: (resource: any, params: any) => dp2(CREATE, resource, params),

  delete: (resource: any, params: any) => dp2(DELETE, resource, params),

  deleteMany: (resource: any, params: any) =>
    dp2(DELETE_MANY, resource, params),
});
export default re;
