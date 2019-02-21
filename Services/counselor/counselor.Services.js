const express = require('express');
let  jsonUtils =require('../../utils/jsonBack') ;
const router = express.Router();
let counselorDao = require('../../dao/counselor/counselor.dao');
/**
 *author:qxx
 *description:根据jobId查询辅导员管理的班级的学生基本信息
 *time:2018/12/7
 */
router.get('/allStudentList/:jobId',function (req,res) {
    let jobId=req.params.jobId;
    let pageSize=req.headers.pagesize;
    let currentPage=req.headers.currentpage;
    console.log(currentPage);
    counselorDao.getClassAllStuInfo(function (result) {
        if(result!=='error'){
            jsonUtils.jsonBack(res,true,result,'学生基本信息列表拉取成功');
        }else{
            jsonUtils.jsonBack(res,false,null,'内部出现了一点问题');
        }
    },jobId,currentPage,pageSize)
})

/**
 *author:qxx
 *description:根据studentId审批贫困生申请
 *time:2018/12/7
 */
router.post('/approvedPoor',function (req,res) {
    let { studentId,attitude }=req.body.poorAttitude;
    if(attitude){
        counselorDao.approveApplyForPoorByCounselor(function (result) {
                if(result){
                    jsonUtils.jsonBack(res,true,null,'辅导员已经审批通过申请！');
                }else{
                    jsonUtils.jsonBack(res,false,null,'内部出现了一点问题！');
                }
            }
            ,studentId);
    }else{
        counselorDao.notApproveApplyForPoorByCounselor(function (result) {
                if(result){
                    jsonUtils.jsonBack(res,true,null,'辅导员不同意通过申请！');
                }else{
                    jsonUtils.jsonBack(res,false,null,'内部出现了一点问题！');
                }
            }
            ,studentId);
    }

});

router.get('/allApplyPoorList/:jobId',function (req,res) {
    let jobId=req.params.jobId;
    counselorDao.getApplyPoorByCounselor(function (result) {
        if(result!=='error'){
            jsonUtils.jsonBack(res,true,result,'申请贫困生信息已返回');
        }else{
            jsonUtils.jsonBack(res,false,null,'内部出现了一点问题');
        }
    },jobId)
})
/**
 *author:qxx
 *description:根据jobId查看辅导员管理的所有班级经济困难学生的信息以及状态
 *time:2018/12/7
 */
router.get('/allPoorList/:jobId',function (req,res) {
    let jobId=req.params.jobId;
    counselorDao.getPoorByCounselor(function (result) {
        if(result!=='error'){
            jsonUtils.jsonBack(res,true,result,'所有经济困难学生信息已经返回！');
        }else{
            jsonUtils.jsonBack(res,false,null,'内部出现了一点问题！');
        }
    },jobId);
});

/**
 *author:qxx
 *description:根据jobId查看辅导员管理的所有班级的班委信息
 *time:2018/12/7
 */
router.get('/classCommitList/:jobId',function (req,res) {
    let jobId=req.params.jobId;
    let data={};
    counselorDao.getClassCommitteeByCounselor(function (result) {
        if(result!=='error'){
            jsonUtils.jsonBack(res,true,result,'获取所有班委信息成功！');
        }else{
            jsonUtils.jsonBack(res,false,null,'内部出现了一点问题！');
        }
    },jobId)
})

/**
/**
 *author:qxx
 *description:根据jobId查看辅导员管理的所有班级的学生违纪情况
 *time:2018/12/7
 */
router.get('/allStuVioList/:jobId',function (req,res) {
    let jobId=req.params.jobId;
    counselorDao.getViolationByCounselor(function (result) {
        if(result!=='error'){
            jsonUtils.jsonBack(res,true,result,'学生违纪情况列表拉取成功！');
        }else{
            jsonUtils.jsonBack(res,false,null,'内部出现了一点问题！');
        }
    },jobId)
})
/**
 *author:qxx
 *description:根据jobId查看辅导员管理的所有班级的学生获奖情况
 *time:2018/12/7
 */
router.get('/allStuAwardList/:jobId',async(req,res)=>{
    let jobId=req.params.jobId;
    try {
        let result=await counselorDao.getAwardByCounselor(jobId);
        //console.log(result);
        jsonUtils.jsonBack(res,true,result,'获奖信息列表拉取成功！');
    }catch (e) {
        jsonUtils.jsonBack(res,false,null,'内部出现了一点问题！');
    }
})

module.exports =router;