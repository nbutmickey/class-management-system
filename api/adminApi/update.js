const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
let classteacherDao = require('../../dao/classteacherDao');
let counselorDao = require('../../dao/counselorDao');
let studentDao = require('../../dao/studentDao');

router.post('/updateSingleClassteacherInfo',function (req,res) {
    let {jobId,name,password,collegeId,classId } = req.body.classTeacherInfo;
    //密码加盐处理进行存储
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password,salt);
    let results;
    const info = {
        jobId:jobId,
        name:name,
        pwd:hash,
        collegeId:collegeId,
        classId:classId
    }

    classteacherDao.updateclasstecacherInfo(function (result){
        if(result){
            res.json({
                success:true,
                message:'更新班主任信息成功',
                data:null,
            })
        }else{
            res.json({
                success:false,
                message:'更新班主任信息失败',
                data:null,
            })
        }
    },info)
})

router.post('/updateSingleCounselorInfo',function (req,res) {
    let {jobId,name,password,collegeId } = req.body.counselorInfo;
    //密码加盐处理进行存储
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password,salt);
    const info = {
        jobId:jobId,
        name:name,
        pwd:hash,
        collegeId:collegeId,
    }
    counselorDao.updatecounselorInfo(function (result) {
        if(result){
            res.json({
                success:true,
                message:'更新辅导员信息成功',
                data:null,
            })
        }else{
            res.json(
                {
                    success:false,
                    message:'更新辅导员信息失败',
                    data:null,
                }
            )
        }
    },info)
})
router.post('/updateSingleStudentInfo',function (req,res) {
    let { studentId,name,password,collegeId,classId } = req.body.studentInfo;
    //密码加盐处理进行存储
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password,salt);
    let results;
    const info = {
        studentId:studentId,
        name:name,
        pwd:hash,
        collegeId:collegeId,
        classId:classId
    }
    studentDao.updatestudentInfo(function (result) {
        if(result){
            res.json({
                success:true,
                message:'更新学生信息成功',
                data:null,
            })
        }else{
            res.json({
                success:true,
                message:'更新学生信息失败',
                data:null,
            })
        }
    },info)
})
module.exports = router;