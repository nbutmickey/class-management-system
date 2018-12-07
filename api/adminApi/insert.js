const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
let classteacherDao = require('../../dao/classteacherDao');
let counselorDao = require('../../dao/counselorDao');
let studentDao = require('../../dao/studentDao');

/**
 *author:qxx
 *description:录入班主任信息
 *time:2018/12/2
 */
router.post('/inputClassteacherInfo',function (req,res) {
    let {jobId,name,password,collegeId,classId } = req.body.classTeacherInfo;
    //密码加盐处理进行存储
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password,salt);
    let info = {
        jobId:jobId,
        name:name,
        pwd:hash,
        collegeId:collegeId,
        classId:classId
    }
    classteacherDao.insertclassteacherInfo(function (result) {
        if(result){
            res.json({
                success:true,
                message:'录入班主任信息成功',
                data:null,
            })
        }else {
            res.json({
                success:false,
                message:'录入班主任信息失败',
                data:null,
            })
        }
    },info);
})

/**
 *author:qxx
 *description:录入辅导员信息
 *time:2018/12/2
 */
router.post('/inputCounselorInfo',function (req,res) {
    let {jobId,name,password,collegeId,classId} = req.params.counselorInfo;
    //密码加盐处理进行存储
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password,salt);
    let results;
    const info = {
        jobId:jobId,
        name:name,
        pwd:hash,
        collegeId:collegeId,
    }
    if(counselorDao.insertcounselorInfo(res,info)){
        let flag=false;
        for(let i=0;i<classId.length;i++){
            flag=counselorDao.insertContact(info.jobId,classId[i]);
        }
        if(flag){
            results={
                success:true,
                message:'录入辅导员信息成功',
                data:null,
            }
        }else{
            results={
                success:false,
                message:'录入辅导员信息失败，插入联系失败！',
                data:null,
            }
        }
    }else{
        results={
            success:false,
            message:'录入辅导员信息失败，插入基本信息失败！',
            data:null,
        }
    }
    res.send(results);
})

/**
 *author:qxx
 *description:录入学生信息
 *time:2018/12/2
 */
router.post('/inputStudentInfo',function (req,res) {
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
    studentDao.insertstudentInfo(function (result) {
        if(result){
            res.json({
                success:true,
                message:'录入班主任信息成功',
                data:null,
            })
        }else {
            res.json({
                success:false,
                message:'录入班主任信息失败',
                data:null,
            })
        }
    },info);
})

module.exports =router;