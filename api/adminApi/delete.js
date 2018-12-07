const express = require('express');
const router = express.Router();
let classteacherDao = require('../../dao/classteacherDao');
let counselorDao = require('../../dao/counselorDao');
let studentDao = require('../../dao/studentDao');

router.post('/deleteSingleClassteacherInfo',function (req,res) {
    let jobId = req.params.jobId;
    classteacherDao.deleteclassteacherInfo(function (result) {
        if(result){
            res.json({
                success:true,
                message:'删除班主任信息成功',
                data:null,
            })
        }else {
            res.json({
                success:false,
                message:'删除班主任信息失败',
                data:null,
            })
        }
    },jobId)
})

router.post('/deleteSingleCounselorInfo',function (req,res) {
    let jobId = req.params.jobId;
    counselorDao.deleteclassteacherInfo(function (result) {
        if(result){
            res.json({
                success:true,
                message:'删除辅导员信息成功',
                data:null,
            })
        }else {
            res.json({
                success:false,
                message:'删除辅导员信息失败',
                data:null,
            })
        }
    },jobId)
})

router.post('/deleteSingleStudentInfo',function (req,res) {
    let studentId = req.params.studentId;
    studentDao.deletestudentInfo(function (result) {
        if(result){
            res.json({
                success:true,
                message:'删除辅导员信息成功',
                data:null,
            })
        }else {
            res.json({
                success:false,
                message:'删除辅导员信息失败',
                data:null,
            })
        }
    },studentId)
})

module.exports = router;