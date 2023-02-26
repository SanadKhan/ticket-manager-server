import multer, { MulterError } from 'multer';

const fileUploads = (filename,filelimit=6) => {
    console.log("From middleware file ",filename, filelimit);
    if(filelimit === 1) {
        var upload = multer({
            limits: { fileSize: 1 * 1024 * 1024 }
        }).single(filename);
    } else {
        upload = multer({
            limits: { fileSize: 1000000 }
        }).array(filename, filelimit);
    }
    return (req, res, next) => {
        upload(req, res,(err) => {
            if(err instanceof MulterError) {
                if(err.message == 'File too large') {
                    console.log(`Multer: ${err}`);
                    return res.status(401).send({msgText: "File too Large" ,success: false })
                } else if(err.message == 'Unexpected field' && filelimit === 1) {
                    console.log(`Multer: ${err.message}`);
                    return res.status(401).send({msgText: "Max one allowed" ,success: false })
                } 
            } else if (err) {
                console.log(`U.E: ${err.message}`);
                return res.status(401).send({error: `U.E: ${err.message}` ,success: false }) // Unknown  error while uploading
            }
            next();
        });
    }  
};

export default fileUploads; 
