const express = require('express');
const router = express.Router();
let studentDao = require('../../dao/studentDao');
/**
 *author:qxx
 *description:寝室长申请
 *time:2018/12/5
 */
router.post('/applyBedRommChief',function (req,res) {
    let {studentId,bedRoomId}=req.params.apply;
   studentDao.applyForBedRoomChief(function (result) {
       res.send(result);
   },studentId,bedRoomId);
})

/**
 *author:qxx
 *description:在填写寝室前判断寝室是否有寝室长
 *time:2018/12/5
 */
router.get('/checkBedRommChief',function (req,res) {
    let bedRoomId=req.query.bedRoomId;
    console.log(bedRoomId);
    studentDao.queryBedRoomChiefCount(function (result) {
        if(result>=1){
            res.json({
                success:false,
                message:'该寝室已存在寝室长！',
                data:null
            })
        }else {
            res.json({
                success:true,
                message:'该寝室暂时还没有寝室长！',
                data:null
            })
        }
    },bedRoomId)
})


/**
 *author:qxx
 *description:完善个人信息
 *time:2018/12/5
 */
router.post('/updateStudentAllInfo',function (req,res) {
    studentDao.updatestudentAllInfo(function (result){
        if(result){
            res.json({
                success:true,
                message:'完善个人信息成功!',
                data:null
            })
        }else {
            res.json({
                success:true,
                message:'完善个人信息失败!请检查各字段!',
                data:null
            })
        }
    },req.body.info);
})

/**
 *author:qxx
 *description:贫困生申请
 *time:2018/12/5
 */

router.post('/applyPoor',function (req,res) {
    studentDao.applyForPoor(function (result) {
        if(result){
            res.json({
                success:true,
                message:'贫困生申请已提交，请耐心等待班主任和辅导员的审核！',
                data:null
            })
        }else {
            res.json({
                success:false,
                message:'貌似内部出现了一点问题',
                data:null
            })
        }
    },req.body.info);
})

/**
 *author:qxx
 *description:获奖信息录入
 *time:2018/12/5
 */
router.post('/insertAwarInfo',function (req,res) {
    studentDao.insertAwardInfo(function (result) {
        if(result){
            res.json({
                success:true,
                message:'获奖信息已经录入',
                data:null
            })
        }else{
            res.json({
                success:false,
                message:'内部出现了一点问题！',
                data:null
            })
        }
    },req.body.info)
})

/**
 *author:qxx
 *description:获奖信息展示
 *time:2018/12/5
 */
router.get('/selectSingleStuAwardInfo',function (req,res) {
    studentDao.getSingleStuAwardInfo(function (result) {
        res.send(result);
    },req.query.studentId);
})

/**
 *author:qxx
 *description:党团信息录入
 *time:2018/12/5
 */
router.post('/insertActivityInfo',function (req,res) {
    studentDao.insertActivityInfo(function (result) {
        if(result){
            res.json({
                success:true,
                message:'获奖信息已经录入',
                data:null
            })
        }else {
            res.json({
                success:false,
                message:'内部出了一点小问题，获奖信息录入失败！',
                data:null
            })
        }
    },req.body.info)
})

/**
 *author:qxx
 *description:党团活动信息展示
 *time:2018/12/5
 */
router.get('/selectSingleStuActivityInfo',function (req,res) {
    studentDao.getSingleStuActivityInfo(function (result) {
        res.send(result);
    },req.query.studentId);
})

module.exports =router;