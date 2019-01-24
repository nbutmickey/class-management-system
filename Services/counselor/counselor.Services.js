import {jsonBack} from "../../utils/jsonBack";
const express = require('express');
const router = express.Router();
let counselorDao = require('../../dao/counselor/counselor.dao');
/**
 *author:qxx
 *description:根据jobId查询辅导员管理的班级的学生基本信息
 *time:2018/12/7
 */
router.get('/allStudentList',function (req,res) {
    let jobId=req.query.jobId;
    counselorDao.getClassAllStuInfo(function (result) {
        if(result!=='error')
        jsonBack(res,true,result,'学生基本信息列表拉取成功');
        jsonBack(res,false,null,'内部出现了一点问题');
    },jobId)
})

/**
 *author:qxx
 *description:根据studentId查看学生详细信息
 *time:2018/12/9
 */
router.get('/getStudentDetailInfo',function (req,res) {
    let studentId=req.query.studentId;
    //待定
})
/**
 *author:qxx
 *description:根据studentId审批贫困生申请
 *time:2018/12/7
 */
router.post('/approvedPoor',function (req,res) {
    let {studentId,attitude}=req.body.poorAttitude;
    counselorDao.changeApplyForPoorByCounselor(function (result) {
            if(result)
                jsonBack(res,true,null,'辅导员已经审批通过申请！');
                jsonBack(res,false,null,'内部出现了一点问题！');
        }
    ,attitude,studentId);
});


/**
 *author:qxx
 *description:根据jobId查看辅导员管理的所有班级经济困难学生的信息以及状态
 *time:2018/12/7
 */
router.get('/allPoorList',function (req,res) {
    let jobId=req.query.jobId;
    counselorDao.getPoorByCounselor(function (result) {
        if(result!=='error')
            jsonBack(res,true,result,'所有经济困难学生信息已经返回！');
            jsonBack(res,false,null,'内部出现了一点问题！');
    },jobId);
});

/**
 *author:qxx
 *description:根据jobId查看辅导员管理的所有班级的班委信息
 *time:2018/12/7
 */
router.get('/classCommitList',function (req,res) {
    let jobId=req.query.jobId;
    let data={};
    counselorDao.getClassCommitteeByCounselor(function (result) {

        if(result!=='error')
            jsonBack(res,true,data,'获取所有班委信息成功！');
            jsonBack(res,false,null,'内部出现了一点问题！');
    },jobId)
})

/**
/**
 *author:qxx
 *description:根据jobId查看辅导员管理的所有班级的学生违纪情况
 *time:2018/12/7
 */
router.get('/allStuVioList',function (req,res) {
    let jobId=req.query.jobId;
    counselorDao.getViolationByCounselor(function (result) {
        if(result!=='error')
            jsonBack(res,true,result,'学生违纪情况列表拉取成功！');
            jsonBack(res,false,null,'内部出现了一点问题！');
    },jobId)
})
/**
 *author:qxx
 *description:根据jobId查看辅导员管理的所有班级的学生获奖情况
 *time:2018/12/7
 */
router.get('/allStuAwardList',function (req,res) {
    let jobId=req.query.jobId;
    counselorDao.getAwardByCounselor(function (result) {
        if(result!=='error')
            jsonBack(res,true,result,'获奖信息列表拉取成功！');
            jsonBack(res,false,null,'内部出现了一点问题！');
    },jobId)
})

module.exports =router;