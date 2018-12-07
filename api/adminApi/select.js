const express = require('express');
const router = express.Router();
let classteacherDao = require('../../dao/classteacherDao');
let counselorDao = require('../../dao/counselorDao');
let studentDao = require('../../dao/studentDao');
let adminDao = require('../../dao/adminDao');

router.get('/getClassteacherAllInfo',function (req,res) {
    classteacherDao.getAllclassteacherInfo(function (result) {
        res.send(result);
    });
})
router.get('/getCounselorAllInfo',function (req,res) {
    counselorDao.getAllcounselorInfo(function (result) {
        res.send(result);
    });
})
router.get('/getStudentAllInfo',function (req,res) {
    studentDao.getAllstudentInfo(function (result) {
        res.send(result);
    });
})
router.get('/getSingleteacherInfo',function (req,res) {
    let jobId=req.query.jobId;
    classteacherDao.getSingleclassteacherInfo(function (result) {
        res.send(result);
    },jobId);
})
router.get('/getSingleCounselorInfo',function (req,res) {
    let jobId=req.query.jobId;
    counselorDao.getSinglecounselorInfo(function (result) {
        res.send(result);
    },jobId);
})
router.get('/getSingleStudentInfo',function (req,res) {
    let studentId=req.query.studentId;
    studentDao.getSinglestudentInfo(function (result) {
        res.send(result);
    },studentId);
})

/**
 *author:qxx
 *description:寝室长申请信息展示
 *time:2018/12/4
 */
router.get('/getApplyChiefAllInfo',function (req,res) {
    adminDao.getAllApplyForBedRoomChief(res.send);
})

module.exports = router;