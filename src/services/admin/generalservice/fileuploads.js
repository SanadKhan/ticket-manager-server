import ImageKit from "imagekit";
import config from "../../../config";

// SDK initialization
var imagekit = new ImageKit({
    publicKey : config.IK_PUBK,
    privateKey : config.IK_PRIK,
    urlEndpoint : config.IK_URLEND
});

// URL generation
// var imageURL = imagekit.url({
//     path : "/default-image.jpg",
//     transformation : [{
//         "height" : "300",
//         "width" : "400"
//     }]
// });

// Upload function internally uses the ImageKit.io javascript SDK
// function upload(data) {
//     var file = document.getElementById("file1");
//     imagekit.upload({
//         file : file.files[0],
//         fileName : "abc1.jpg",
//         tags : ["tag1"]
//     }, function(err, result) {
//         console.log(arguments);
//         console.log(imagekit.url({
//             src: result.url,
//             transformation : [{ height: 300, width: 400}]
//         }));
//     })
// }

export const uploadFiles = async (allFile) => {
    try {
        console.log("allfile", allFile);
        let contents = await Promise.all(allFile.map((file) => {
            return imagekit.upload({
                file: file.buffer,
                fileName: file.originalname
            })
        }))
        let files = []
        console.log("contents", contents)
        for(const content of contents) {
            let { url , fileId } = content
            files.push({fileId, url})
        }
        console.log("files", files)
        return { status: 200, success: true, files}
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