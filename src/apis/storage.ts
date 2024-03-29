import httpRequest from "@/request";

// 列表查询
interface storageList {
  page: number,
  size: number,
}
export function apiStorageList(parentId: string, params: storageList) {
  return httpRequest({
    url: `/v1/storage?parentId=${parentId}`,
    method: "get",
    params: params
  });
}

// 删除
export function apiDelStorage(ids: [string]) {
  return httpRequest({
    url: `/v1/storage?ids=${ids}`,
    method: "delete",
  });
}

// 上传
export function apiUploadStorage(params: any) {
  return httpRequest({
    url: `/v1/storage/upload`,
    method: "post",
    data: params,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}

// 下载
export function apiDownloadStorage(id: string) {
  return httpRequest({
    responseType: 'blob', // 重点，responseType设置为 blob
    url: `/v1/storage/download?id=${id}`,
    method: "post",
  });
}