const express = require('express');
const router = express.Router();
let classTeacherDao = require('../../dao/classteacherDao');
/**
 *author:qxx
 *description:查看本班学生基本信息
 *time:2018/12/9
 */
router.get('/getAllBasicInfo',function (req,res) {
    classTeacherDao.getBasicClassInfo(function (result) {
        res.send(result);
    },req.query.jobId)
})

/**
 *author:qxx
 *description:设置班级团委头衔信息
 *time:2018/12/9
 */
router.post('/setClassPosition',function (req,res) {
    classTeacherDao.setClassPosition(function (result) {
        if(result){
            res.json({
                success:true,
                message:'班委设置成功！',
                data:null
            })
        }else{
            res.json({
                success:false,
                message:'班委设置失败！',
                data:null
            })
        }
    },req.body.info)
})
/**
 *author:qxx
 *description:查看本班家庭经济困难学生
 *time:2018/12/9
 */
router.get('/getClassPoorInfo',function (req,res) {
   classTeacherDao.getClassPoor(function (result) {
       res.send(result)
   },req.params.jobId)
})

/**
 *author:qxx
 *description:查看本班学生住宿情况
 *time:2018/12/9
 */
router.get('/getClassDormitoryInfo',function (req,res) {
    classTeacherDao.getClassAccommodation(function (result) {
        res.send(result)
    },req.params.jobId)
})


/**
 *author:qxx
 *description:填写本学期班主任工作计划
 *time:2018/12/10
 */
router.post('/fillClassTeacherScheme',function (req,res) {
    classTeacherDao.fillWorkPlan(function (result) {
        if(result){
            res.json({
                success:true,
                message:'班主任工作计划填写成功！',
                data:null
            })
        }else{
            res.json({
                success:false,
                message:'班主任工作计划填写失败！',
                data:null
            })
        }
    },req.body.info);
})
/**
 *author:qxx
 *description:填写召开班会记录
 *time:2018/12/10
 */
router.post('/fillClassMeetingRecord',function (req,res) {
    classTeacherDao.fillMeetingRecord(function (result) {
        if(result){
            res.json({
                success:true,
                message:'班会记录填写成功！',
                data:null
            })
        }else{
            res.json({
                success:false,
                message:'班会记录填写失败！',
                data:null
            })
        }
    },req.body.info)
})
/**
 *author:qxx
 *description:填写下寝室记录
 *time:2018/12/10
 */
router.post('/fillClassDormitoryRecord',function (req,res) {
    classTeacherDao.fillDormitoryRecord(function (result) {
        if(result){
            res.json({
                success:true,
                message:'下寝室记录填写成功！',
                data:null
            })
        }else{
            res.json({
                success:false,
                message:'下寝室记录填写失败！',
                data:null
            })
        }
    },req.body.info)

})


/**
 *author:qxx
 *description:填写学生谈话记录表
 *time:2018/12/10
 */
router.post('/fillStudentTalkRecord',function (req,res) {
    classTeacherDao.fillTalkRecord(function (result) {
            if(result){
                res.json({
                    success:true,
                    message:'学生谈话记录填写成功！',
                    data:null
                })
            }else{
                res.json({
                    success:false,
                    message:'学生谈话记录填写失败！',
                    data:null
                })
            }
    },req.body.info)
})
/**
 *author:qxx
 *description:填写寝室卫生情况
 *time:2018/12/10
 */
router.post('/fillBedRoomHygieneInfo',function (req,res) {
    classTeacherDao.fillBedRoomHygieneInfo(function (result) {
        if(result){
            res.json({
                success:true,
                message:'寝室卫生情况填写成功！',
                data:null
            })
        }else{
            res.json({
                success:false,
                message:'寝室卫生情况填写失败！',
                data:null
            })
        }
    },req.body.info)
})

/**
 *author:qxx
 *description:对突发事件进行记录
 *time:2018/12/10
 */
router.post('/fillEmergencyInfo',function (req,res) {
    classTeacherDao.fillEmergenciesRecord(function (result) {
        if(result){
            res.json({
                success:true,
                message:'突发事件填写成功！',
                data:null
            })
        }else{
            res.json({
                success:false,
                message:'突发事件填写失败！',
                data:null
            })
        }
    },req.body.info)
})

/**
 *author:qxx
 *description:查看本班学生获奖情况
 *time:2018/12/10
 */
router.get('/getClassAwardInfo',function (req,res) {
    classTeacherDao.getClassAwardInfo(function (result) {
        res.send(result);
    },req.query.jobId);
})
/**
 *author:qxx
 *description:查看本班学生违纪情况
 *time:2018/12/10
 */
router.get('/getClassViolationInfo',function (req,res) {
    classTeacherDao.getClassViolationInfo(function (result) {
        res.send(result);
    },req.query.jobId);
})
/**
 *author:qxx
 *description:生成班主任手册
 *time:2018/12/10
 */

module.exports=router;