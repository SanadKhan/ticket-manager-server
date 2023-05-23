import ImageKit from "imagekit";
import config from "../../../config";

// SDK initialization
var imagekit = new ImageKit({
    publicKey : config.IK_PUBK,
    privateKey : config.IK_PRIK,
    urlEndpoint : config.IK_URLEND
});

export const uploadFiles = async (allFile) => {
    try {
        let contents = await Promise.all(allFile.map((file) => {
            return imagekit.upload({
                file: file.buffer,
                fileName: file.originalname
            })
        }))
        let files = []
        for(const content of contents) {
            let { url , fileId } = content
            files.push({fileId, url})
        }
        return files
    } catch (error) {
        throw error
    }
        
}

export const deleteFiles = async (files) => {
    try {
        return imagekit.bulkDeleteFiles(files);
    } catch (error) {
        throw error
    }
  
}