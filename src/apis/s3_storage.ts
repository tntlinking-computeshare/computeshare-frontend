import httpRequest from "@/request";

interface baseParams {
  page: number,
  size: number,
  name: string,
}

// 获取桶中的存储列表
// bucketName: 桶名
// prefix：文件夹的名字
export function apiGetBucketList(bucketName: string, params: bucketListParams) {
  return httpRequest({
    url: `/v1/s3bucket/${bucketName}/objects?prefix=${params.prefix}&page=${params.page}&size=${params.size}&name=${params.name}`,
    method: "get",
  });
}

interface bucketListParams extends baseParams{
  prefix: string,
}

// 创建桶
export function apiCreateBucket(params: createBucket) {
  return httpRequest({
    url: `/v1/s3bucket`,
    method: "post",
    data: params,
  });
}
interface createBucket {
  bucketName: string //桶名
}

// 获取桶列表
export function apiBucketList(params: baseParams) {
  return httpRequest({
    url: `/v1/s3bucket?page=${params.page}&size=${params.size}&name=${params.name}`,
    method: "get",
  });
}

let controller = new AbortController();

// 上传文件到s3
export function apiUploadFileToS3(bucketName: string, params: uploadS3) {
  return httpRequest({
    url: `/v1/storage/${bucketName}/objects/upload`,
    method: "post",
    data: params,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    signal: controller.signal
  });
}

// 取消上传
export function cancelUploadToS3() {
  // 取消请求
  controller.abort()
  controller = new AbortController();
}

interface uploadS3 {
  prefix?: string, //prefix：文件夹的名字
  file: any,
}

// 从s3下载文件
export function apiDownloadFileFromS3(bucketName: string, key: string) {
  return httpRequest({
    url: `/v1/storage/${bucketName}/objects/download?key=${key}`,
    method: "get",
    responseType: 'blob', // 重点，responseType设置为 blob
  });
}

// 从s3删除文件
export function apiDeleteFileFromS3(bucketName: string, key: string) {
  return httpRequest({
    url: `/v1/storage/${bucketName}/objects/delete?key=${key}`,
    method: "delete",
  });
}

// 从s3删除文件夹
export function apiDeleteFolderFromS3(bucketName:string, params:s3Folder) {
    return httpRequest({
        url: `/v1/storage/${bucketName}/mkdir?dirName=${params.dirName}&prefix=${params.prefix}`,
        method: "delete",
    });
}

// 清除桶
export function apiClearBucket(bucketName: string) {
  return httpRequest({
    url: `/v1/s3bucket/${bucketName}/empty`,
    method: "delete",
  });
}

// 删除桶
export function apiDeleteBucket(bucketName: string) {
  return httpRequest({
    url: `/v1/s3bucket/${bucketName}`,
    method: "delete",
  });
}

// S3创建文件夹
export function apiS3CreateFolder(bucketName: string, params: s3Folder) {
  return httpRequest({
    url: `/v1/storage/${bucketName}/mkdir`,
    method: "post",
    data: params,
  });
}
interface s3Folder {
  dirName: string, // 文件夹名称
  prefix: string, // 层级
}