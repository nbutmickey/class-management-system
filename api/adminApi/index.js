const express = require('express');
const router = express.Router();
let upload = require('../../middlewares/multer');
let fs = require('fs');
let classteacherDao = require('../../dao/classteacherDao');
let counselorDao = require('../../dao/counselorDao');
let studentDao = require('../../dao/studentDao');
let adminDao = require('../../dao/adminDao');
const xls = require('node-xlsx');
/**
 *author:qxx
 *description:批量录入班主任信息
 *time:2018/12/3
 */
router.post('/uploadClassteacherInfo',upload.single('xlsxFile'),function (req,res) {
    upload(req,res,function (err) {
        if(err){
            //出现异常
            res.json({
                success:false,
                message:'上传失败！'
            })
        }else{
            //上传成功
            let uploadName=req.originalname;
            //读取刚刚上传的xlsx文件
            let sheets = xls.parse(fs.readFileSync('../../static/upload/'+uploadName));
            //遍历刚刚上传的xlsx文件
            sheets.forEach(function (sheet) {
                let flag = false;
                for(let rowId=1;rowId<sheet['data'].length;rowId++){
                    let row = sheet['data'][rowId];
                    const salt = bcrypt.genSaltSync(10);
                    const hash = bcrypt.hashSync(row[2],salt);
                    let info ={
                        jobId:parseInt(row[0]),
                        name:row[1],
                        pwd:hash,
                        collegeId:parseInt(row[3]),
                        classId:parseInt(row[4])
                    }
                    flag=classteacherDao.insertclassteacherInfo(info);
                }
                if(flag){
                    res.json({
                        success:true,
                        message:'班主任信息批量导入成功！'
                    })
                }else{
                    res.json({
                        success:false,
                        message:'班主任信息批量导入失败！'
                    })
                }
            })
        }
    })
})


/**
 *author:qxx
 *description:批量录入辅导员信息
 *time:2018/12/3
 */
router.post('/uploadCounselorInfo',upload.single('xlsxFile'),function (req,res) {

    upload(req,res,function (err) {
        if(err){
            //出现异常
            res.json({
                success:false,
                message:'上传失败！'
            })
        }else{
            //上传成功
            let uploadName=req.originalname;
            //读取刚刚上传的xlsx文件
            let sheets = xls.parse(fs.readFileSync('../../static/upload/'+uploadName));
            //遍历刚刚上传的xlsx文件
            sheets.forEach(function (sheet) {
                let flaga = false;
                let flagb = false;
                for(let rowId=1;rowId<sheet['data'].length;rowId++){
                    let row = sheet['data'][rowId];
                    const salt = bcrypt.genSaltSync(10);
                    const hash = bcrypt.hashSync(row[2],salt);
                    let classArray = row[4].split(',');
                    let info ={
                        jobId:parseInt(row[0]),
                        name:row[1],
                        pwd:hash,
                        collegeId:parseInt(row[3])
                    }
                        //插入基本信息
                        flaga=counselorDao.insertcounselorInfo(info);
                        //插入辅导员对应的班级列表
                    for(let i=0;i<classArray.length;i++){
                        flagb=counselorDao.insertContact(info.jobId,parseInt(classArray[i]));
                    }
                }
                if(flaga&&flagb){
                    res.json({
                        success:true,
                        message:'辅导员信息批量导入成功！'
                    })
                }else{
                    res.json({
                        success:false,
                        message:'辅导员信息批量导入失败！'
                    })
                }
            })
        }
    })
})



/**
 *author:qxx
 *description:批量录入学生信息
 *time:2018/12/3
 */
router.post('/uploadStudentInfo',upload.single('xlsxFile'),function (req,res) {
    upload(req,res,function (err) {
        if(err){
            //出现异常
            res.json({
                success:false,
                message:'上传失败！'
            })
        }else{
            //上传成功
            let uploadName=req.originalname;
            //读取刚刚上传的xlsx文件
            let sheets = xls.parse(fs.readFileSync('../../static/upload/'+uploadName));
            //遍历刚刚上传的xlsx文件
            sheets.forEach(function (sheet) {
                let flag = false;
                for(let rowId=1;rowId<sheet['data'].length;rowId++){
                    let row = sheet['data'][rowId];
                    const salt = bcrypt.genSaltSync(10);
                    const hash = bcrypt.hashSync(row[2],salt);
                    let info ={
                        studentId:parseInt(row[0]),
                        name:row[1],
                        pwd:hash,
                        collegeId:parseInt(row[3]),
                        classId:parseInt(row[4])
                    }
                    flag=studentDao.insertstudentInfo(info);
                }
                if(flag){
                    res.json({
                        success:true,
                        message:'学生信息批量导入成功！'
                    })
                }else{
                    res.json({
                        success:false,
                        message:'学生信息批量导入失败！'
                    })
                }
            })
        }
    })
})

/**
 *author:qxx
 *description:寝室长申请处理
 *time:2018/12/3
 */
router.post('/applyForBedRoomChief',function (req,res) {
    let {studentId}=req.params.applyChiefConfirm;
    if(adminDao.changeApplyForBedRoomChief(studentId)){
        res.json({
            success:true,
            message:'已成功将其设置为寝室长！'
        })
    }else{
        res.json({
            success:false,
            message:'出现了一点错误，请重新操作！'
        })
    }
})


module.exports =router;