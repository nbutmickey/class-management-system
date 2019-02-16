let  jsonBack =require('../../utils/jsonBack') ;
const express = require('express');
const router = express.Router();
let  jsonUtils =require('../../utils/jsonBack') ;
let classTeacherDao = require('../../dao/classteacher/classteacher.dao');
/**
 *author:qxx
 *description:根据jobId查看本班学生基本信息
 *time:2018/12/9
 */
router.get('/allBasicList/:jobId',function (req,res) {
    let jobId=req.params.jobId;
    classTeacherDao.getBasicClassInfo(function (result) {
        if(result!=='error'){
            jsonUtils.jsonBack(res,true,result,'本班学生信息拉取成功！');
        }else{
            jsonUtils.jsonBack(res,false,null,'内部出现了一点问题！');
        }
    },jobId);
});

/**
 *author:qxx
 *description:设置班级团委头衔信息
 *time:2018/12/9
 */
router.post('/setClassPosition',function (req,res) {
    let {position,studentId}=req.body.classPosition;
    classTeacherDao.setClassPosition(function (result) {
        if(result){
            jsonUtils.jsonBack(res,true,null,'班委信息设置成功！');
        }else{
            jsonUtils.jsonBack(res,false,null,'内部出现了一点问题！');
        }
    },position,studentId);
});

/**
 *author:qxx
 *description:查看本班家庭经济困难学生
 *time:2018/12/9
 */
router.get('/classPoorList/:jobId',function (req,res) {
   let jobId=req.params.jobId;
   classTeacherDao.getClassPoor(function (result) {
       if(result!=='error'){
           jsonUtils.jsonBack(res,true,result,'查看本班经济困难学生信息！');
       }else{
           jsonUtils.jsonBack(res,false,null,'内部出现了一点问题！');
       }
   },jobId)
})

/**
 *author:qxx
 *description:根据jobId查看本班学生住宿情况
 *time:2018/12/9
 */
router.get('/classDormitoryList/:jobId',function (req,res) {
    let jobId=req.params.jobId;
    classTeacherDao.getClassAccommodation(function (result) {
        if(result!=='error'){
            jsonUtils.jsonBack(res,true,result,'本班学生住宿情况拉取成功！');
        }else{
            jsonUtils.jsonBack(res,false,null,'内部出现了一点问题！');
        }
    },jobId);
})


/**
 *author:qxx
 *description:填写本学期班主任工作计划
 *time:2018/12/10
 */
router.post('/fillClassTeacherScheme',function (req,res) {
    let schemeInfo=req.body.schemeInfo;
    classTeacherDao.fillWorkPlan(function (result) {
        if(result){
            jsonUtils.jsonBack(res,true,null,'班主任本学期工作计划填写成功！');
        }else{
            jsonUtils.jsonBack(res,false,null,'内部出现了一点问题！');
        }
    },schemeInfo);
})


/**
 *author:qxx
 *description:填写召开班会记录
 *time:2018/12/10
 */
router.post('/fillClassMeetingRecord',function (req,res) {
    let meetingInfo=req.body.meetingInfo
    classTeacherDao.fillMeetingRecord(function (result) {
        if(result){
            jsonUtils.jsonBack(res,true,null,'班会记录填写成功！');
        }else{
            jsonUtils.jsonBack(res,false,null,'内部出现了一点问题！');
        }
    },meetingInfo)
})

/**
 *author:qxx
 *description:填写下寝室记录
 *time:2018/12/10
 */
router.post('/fillClassDormitoryRecord',function (req,res) {
    let {jobId,time,semester,week,dormitoryNames,mainContent}=req.body.dormitoryRecord;
    classTeacherDao.fillDormitoryRecord(function (result) {
        if(result){
            jsonUtils.jsonBack(res,true,null,'寝室记录表已填写成功！');
        }else{
            jsonUtils.jsonBack(res,false,null,'内部出现了一点问题！');
        }
        },jobId,time,semester,week,dormitoryNames,mainContent);
});

/**
 *author:qxx
 *description:填写寝室卫生情况
 *time:2019/1/24
 */
router.post('/fillBedroomHygiene',function (req,res) {
    let bedRoomHygiene=req.body.bedRoomHygiene;
     classTeacherDao.fillBedRoomHygieneInfo(function (result) {
         if(result){
             jsonUtils.jsonBack(res,true,null,'寝室卫生表已填写成功！');
         }else{
             jsonUtils.jsonBack(res,false,null,'内部出现了一点问题！');
         }
     },bedRoomHygiene)
})

/**
 *author:qxx
 *description:填写学生谈话记录表
 *time:2018/12/10
 */
router.post('/fillStudentTalkRecord',function (req,res) {
    let {jobId,studentName,talkTime,times,mainProblem,kpOfCounseling,types}=req.body.talkRecord;
    let flag=true;
    classTeacherDao.fillTalkRecord(function (result) {
        if(result)
        {
         for(let i=0;i<types.length;i++){
            classTeacherDao.insertStudentTalkContact(function () {
                if(result){
                    flag=true;
                }else{
                    flag=false;
                }
            },types[i]);
         }
        }else{
            flag=false;
        }
    },jobId,studentName,talkTime,times,mainProblem,kpOfCounseling);
    if(flag){
        jsonUtils.jsonBack(res,true,null,'学生谈话记录表已填写成功！');
    }else{
        jsonUtils.jsonBack(res,false,null,'内部出现了一点问题！');
    }
})


/**
 *author:qxx
 *description:对突发事件进行记录
 *time:2018/12/10
 */
router.post('/fillEmergencyInfo',function (req,res) {
    let emergencyInfo=req.body.emergencyInfo;
    classTeacherDao.fillEmergenciesRecord(function (result) {
        if(result){
            jsonUtils.jsonBack(res,true,null,'突发事件记录成功！');
        }else{
            jsonUtils.jsonBack(res,false,null,'内部出现了一点问题！');
        }
    },emergencyInfo)
})

/**
 *author:qxx
 *description:查看本班学生获奖情况
 *time:2018/12/10
 */
router.get('/classAwardList/:jobId',function (req,res) {
    let jobId=req.params.jobId;
    classTeacherDao.getClassAwardInfo(function (result) {
        if(result){
            jsonUtils.jsonBack(res,true,null,'学生获奖列表已返回！');
        }else{
            jsonUtils.jsonBack(res,false,null,'内部出现了一点问题！');
        }
    },jobId);
})
/**
 *author:qxx
 *description:查看本班学生违纪情况
 *time:2018/12/10
 */
router.get('/classViolationList/:jobId',function (req,res) {
    let jobId=req.params.jobId;
    classTeacherDao.getClassViolationInfo(function (result) {
        if(result){
            jsonUtils.jsonBack(res,true,null,'本班学生违纪列表已返回！');
        }else {
            jsonUtils.jsonBack(res, false, null, '内部出现了一点问题！');
        }
    },jobId);
})

/**
 *author:qxx
 *description:填写班级活动记录
 *time:2019/1/24
 */

router.post('/fillClassActivity',function (req,res) {
    let classActivity=req.body.classActivity;
    classTeacherDao.fillClassActivityInfo(function (result) {
        if(result){
            jsonUtils.jsonBack(res,true,null,'班级活动记录已成功插入！');
        }else{
            jsonUtils.jsonBack(res,false,null,'内部出现了一点问题！');
        }
    },classActivity)
})


/**
 *author:qxx
 *description:返回问题归类列表
 *time:2019/1/24
 */
router.get('/problemTypeList',function (req,res) {
    classTeacherDao.getAllTalkTypes(function (result) {
        if(result!=='error'){
            jsonUtils.jsonBack(res,true,null,'问题归类列表已返回！');
        }else{
            jsonUtils.jsonBack(res,false,null,'内部出现了一点问题！');
        }
    });
})

/**
 *author:qxx
 *description:生成班主任手册
 *time:2018/12/10
 */

module.exports=router;