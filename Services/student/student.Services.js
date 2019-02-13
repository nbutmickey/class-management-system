const express = require('express');
const router = express.Router();
let studentDao = require('../../dao/student/student.dao');
let  jsonUtils =require('../../utils/jsonBack') ;
let moment=require('moment');
/**
 *author:qxx
 *description:根据studentId,bedRoomId进行寝室长申请
 *time:2018/12/5
 */
router.post('/applyBedRoomChief',function (req,res) {
    let {studentId,buildId,bedRoomId}=req.body.apply;
   studentDao.applyForBedRoomChief(function (result) {
       if(result){
           jsonUtils.jsonBack(res,true,null,'已提交寝室长申请表格，请耐心等待管理员回复！');
       }else{
           jsonUtils.jsonBack(res,false,null,'内部出现了一点问题！');
       }
   },studentId,buildId,bedRoomId);
})

/**
 *author:qxx
 *description:在填写寝室前判断寝室是否有寝室长
 *time:2018/12/5
 */
router.get('/checkBedRoomChief/:bedRoomId',function (req,res) {
    let bedRoomId=req.params.bedRoomId;
    studentDao.queryBedRoomChiefCount(function (result) {
        if(result>=1){
            jsonUtils.jsonBack(res,true,null,'实在抱歉，该寝室已存在寝室长！');
        }else{
            jsonUtils.jsonBack(res,true,null,'该寝室暂无寝室长');
        }
    },bedRoomId);
})

/**
 *author:qxx
 *description:根据studentId获取贫困生申请进度
 *time:2019/1/22
 */
router.get('/poorApplyStepById/:studentId',function (req,res) {
    let studentId=req.params.studentId;
    studentDao.getPoorStudentStepById(function (result) {
        if(result!=='error'){
            jsonUtils.jsonBack(res,true,result,'贫困生申请进度已返回');
        }else{
            jsonUtils.jsonBack(res,false,null,'内部出现了一点问题！');
        }
    },studentId)
})
/**
 *author:qxx
 *description:根据studentId查询寝室长申请进度
 *time:2019/1/31
 */
router.get('/bedRoomApplyChiefStepById/:studentId',function (req,res) {
    let studentId=req.params.studentId;
    studentDao.getBedRoomApplyChiefStepById(function (result) {
        if(result!=='error'){
            jsonUtils.jsonBack(res,true,result,'寝室长申请进度已返回');
        }else{
            jsonUtils.jsonBack(res,false,null,'内部出现了一点问题！');
        }
    },studentId)
})

/**
 *author:qxx
 *description:个人信息
 *time:2019/1/31
 */
router.get('/getPersonalInfo/:studentId',function (req,res) {
    let studentId=req.params.studentId;
    studentDao.getStudentInfoById(function (result) {
        result.birthday=moment(result.birthday).format("YYYY-MM-DD");
        if(result!=='error'){
            jsonUtils.jsonBack(res,true,result,'个人信息拉取成功！');
        }else{
            jsonUtils.jsonBack(res,false,null,'内部出现了一点问题！');
        }
    },studentId)
})

/**
 *author:qxx
 *description:完善个人信息
 *time:2018/12/5
 */
router.post('/completeStudentInfo',function (req,res) {
    let stuInfo=req.body.stuInfo;
    studentDao.updatestudentAllInfo(function (result){
        if(result){
            jsonUtils.jsonBack(res,true,null,'完善个人信息成功!');
        }else{
            jsonUtils.jsonBack(res,false,null,'完善个人信息失败!请检查各字段!');
        }
    },stuInfo);
})

/**
 *author:qxx
 *description:贫困生申请
 *time:2018/12/5
 */

router.post('/applyPoor',function (req,res) {
    let applyInfo=req.body.applyInfo;
    studentDao.applyForPoor(function (result) {
        if(result){
            jsonUtils.jsonBack(res,true,null,'贫困生申请已提交，请耐心等待班主任和辅导员的审核！');
        }else{
            jsonUtils.jsonBack(res,false,null,'貌似内部出现了一点问题');
        }
    },applyInfo);
})

/**
 *author:qxx
 *description:获奖信息录入
 *time:2018/12/5
 */
router.post('/insertAwardInfo',function (req,res) {
    let awardInfo=req.body.awardInfo;
    studentDao.insertAwardInfo(function (result) {
        if(result){
            jsonUtils.jsonBack(res,true,null,'获奖信息已经录入！');
        }else{
            jsonUtils.jsonBack(res,false,null,'貌似内部出现了一点问题');
        }
    },awardInfo);
})

/**
 *author:qxx
 *description:根据studentId查询获奖信息列表
 *time:2018/12/5
 */
router.get('/singleStuAwardInfo/:studentId',function (req,res) {
    let studentId=req.params.studentId;
    studentDao.getSingleStuAwardInfo(function (result) {
        result.forEach(item=>{
            item.awardTime=moment(item.awardTime).format("YYYY-MM-DD");
        })
        if(result!=='error'){
            jsonUtils.jsonBack(res,true,result,'获奖信息获得成功！');
        }else{
            jsonUtils.jsonBack(res,false,null,'内部出现了一点问题！');
        }
    },studentId);
})

/**
 *author:qxx
 *description:党团信息录入
 *time:2018/12/5
 */
router.post('/insertActivityInfo',function (req,res) {
    let activityInfo=req.body.activeInfo;
    studentDao.insertActivityInfo(function (result) {
        if(result){
            jsonUtils.jsonBack(res,true,null,'党团信息信息已经录入！');
        }else{
            jsonUtils.jsonBack(res,false,null,'貌似内部出现了一点问题');
        }

    },activityInfo)
})

/**
 *author:qxx
 *description:根据studentId查询党团活动信息列表
 *time:2018/12/5
 */
router.get('/singleStuActivityInfo/:studentId',function (req,res) {
    let studentId=req.params.studentId;
    studentDao.getSingleStuActivityInfo(function (result) {
        result.forEach(item=>{
            item.activityTime=moment(item.activityTime).format("YYYY-MM-DD");
        })
        if(result!=='error'){
            jsonUtils.jsonBack(res,true,result,'党团活动信息获得成功！');
        }else{
            jsonUtils.jsonBack(res,false,null,'内部出现了一点问题！');
        }
    },studentId);
})

module.exports =router;