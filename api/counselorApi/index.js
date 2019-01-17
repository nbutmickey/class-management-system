const express = require('express');
const router = express.Router();
let counselorDao = require('../../dao/counselorDao');
/**
 *author:qxx
 *description:查看学生基本信息
 *time:2018/12/7
 */
router.get('/getAllStudentBasicInfo',function (req,res) {
    counselorDao.getClassAllStuInfo(function (result) {
        res.send(result);
    },req.query.jobId)
})

/**
 *author:qxx
 *description:查看学生详细信息
 *time:2018/12/9
 */
router.get('/getStudentDetailInfo',function (req,res) {
    //待定
})
/**
 *author:qxx
 *description:审批通过贫困生申请
 *time:2018/12/7
 */
router.post('/approvedPoor',function (req,res) {
    counselorDao.changeApplyForPoorByCounselor(function (result) {
        if(result){
            res.json({
                success:true,
                message:'已通过辅导员申请',
                data:null
            })
        }else{
            res.json({
                success:false,
                message:'未通过辅导员申请',
                data:null
            })
        }
        }
    ,req.params.studentId)
})

/**
 *author:qxx
 *description:审批不通过贫困生申请
 *time:2018/12/7
 */
router.post('/notapprovedPoor',function (req,res) {
    counselorDao.changeNotAgreePoorByCounselor(function (result) {
            if(result){
                res.json({
                    success:true,
                    message:'未通过辅导员申请',
                    data:null
                })
            }else{
                res.json({
                    success:false,
                    message:'内部出了点问题！',
                    data:null
                })
            }
        },req.params.studentId)
})

/**
 *author:qxx
 *description:查看所有经济困难学生的信息
 *time:2018/12/7
 */
router.get('/getAllPoorInfo',function (req,res) {
    counselorDao.getPoorByCounselor(function (result) {
        res.send(result);
    },req.query.studentId)
})
/**
 *author:qxx
 *description:查看每个班的班委信息
 *time:2018/12/7
 */
router.get('/getClassCommitInfo',function (req,res) {
    counselorDao.getClassCommitteeByCounselor(function (result) {
        res.send(result);
    },req.query.jobId)
})
/**
/**
 *author:qxx
 *description:查看所有学生违纪情况
 *time:2018/12/7
 */
router.get('/getAllStuVioInfo',function (req,res) {
    counselorDao.getViolationByCounselor(function (result) {
        res.send(result);
    },req.query.jobId)
})
/**
 *author:qxx
 *description:查看所有学生的获奖情况
 *time:2018/12/7
 */
router.get('/getAllStuAwardInfo',function (req,res) {
    counselorDao.getAwardByCounselor(function (result) {
        res.send(result);
    },req.query.jobId)
})

module.exports =router;