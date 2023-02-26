
// ****File with Aws Presigner ****

// import config from '../../../config';
// import { S3Client, PutObjectCommand, GetObjectCommand} from "@aws-sdk/client-s3";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// const s3 = new S3Client({
//     region: config.AWS_RN || '',
//     credentials: {
//         accessKeyId: config.AWS_AK || '',
//         secretAccessKey: config.AWS_SK || ''
//     } 
// });

// export const uploadSingle = async (file) => {
//     try {
//         const fileName = Date.now()+ '' +file.originalname;
//         const clientParams = {
//             Bucket: config.AWS_BN,
//             Body: file.buffer,
//             Key: fileName,
//             ContentType: file.mimetype
//         }
//         const client = new PutObjectCommand(clientParams);
//         await s3.send(client);
//         return { fileName }
//     } catch (error) {
//         throw error;
//     }
// }

// export const uploadMultiple = async (allFiles) => {
//     try {
//         let file, clientParams, client, files = [];
//         let uploadedFiles = await Promise.all(allFiles.map(async(allfile) => {
//             file = Date.now()+ '' +allfile.originalname;
//             files.push( {file} );
//             clientParams = {
//                 Bucket: config.AWS_BN,
//                 Body: allfile.buffer,
//                 Key: file,
//                 ContentType: allfile.mimetype
//             }
//             client = new PutObjectCommand(clientParams);
//             return  await s3.send(client);
//         }));
//         return files;
//     } catch (error) {
//         throw error;
//     }
// }

// export const getFileUrl = async(files, imageKey, fileCount=2) => {
//     try {
//         if(fileCount === 1) {
//             for(const file of files){
//                 const getObjectParams = {
//                     Bucket: config.AWS_BN,
//                     Key: file[imageKey]
//                 }
//                 const command = new GetObjectCommand(getObjectParams);
//                 const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
//                 file[imageKey] = url;
//             }
//         } else {
//             for(const file of files){
//                 for(const innerFile of file[imageKey]) {
//                     if(innerFile.file){
//                         const getObjectParams = {
//                             Bucket: config.AWS_BN,
//                             Key: innerFile.file
//                         }
//                         const command = new GetObjectCommand(getObjectParams);
//                         const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
//                         innerFile.file = url;
//                     }
//                 }
//             }
//         }
//         return files 
//     } catch (error) {
//         throw error;   
//     }
// };

// export const getSingleObjFileUrl = async(files, imageKey, fileCount=2) => {
//     try {
//         if(fileCount === 1) {
//             const getObjectParams = {
//                 Bucket: config.AWS_BN,
//                 Key: files[imageKey]
//             }
//             const command = new GetObjectCommand(getObjectParams);
//             const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
//             files[imageKey] = url;
//         } else {
//             for(const innerFile of files[imageKey]) {
//                 if(innerFile.file){
//                     const getObjectParams = {
//                         Bucket: config.AWS_BN,
//                         Key: innerFile.file
//                     }
//                     const command = new GetObjectCommand(getObjectParams);
//                     const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
//                     innerFile.file = url;
//                 }
//             }   
//         }
//         return files 
//     } catch (error) {
//         throw error;   
//     }
// };

// export const getFilename = (values, imageKey, fileCount=2) => {
//     if(fileCount === 2){
//         if(values.length > 0){                  // if files are nested in array of objects
//             for(const file of values){
//                 for(const innerFile of file[imageKey]) {
//                     if(innerFile.file){
//                         innerFile.filename = innerFile.file;
//                     }
//                 }
//             }
//         } else {                                // if files are from single object i.e gallery
//             for(const innerFile of values[imageKey]) {
//                 if(innerFile.filename){
//                     innerFile.filename = innerFile.file;
//                 }
//             }
//         }
//     } else {
//         for(const innerFile of values) {
//             innerFile.filename = innerFile[imageKey];
//         }
//     }
//     return values;
// };

