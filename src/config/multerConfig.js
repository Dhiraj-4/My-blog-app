import multer from 'multer';
import multers3 from 'multer-s3';
import { s3 } from './awsConfing.js';
import { AWS_BUCKET_NAME } from './serverConfig.js';

export const s3Uploader = multer({
    storage: multers3({
        s3: s3,
        bucket: AWS_BUCKET_NAME,
        key: function (req, file, cb) {
            if(!file) {
                return cb(new Error('File not found'));
            }

            console.log(file);
            if(file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg') {
                return cb(new Error('Invaild file type'));
            }

            const fileExtension = file.originalname.split('.')[1];

            cb(null, Date.now().toString() + '.' + fileExtension);
        }
    })
})