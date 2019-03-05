const express = require("express");
const router = express.Router();
let jsonUtils = require("../../utils/jsonBack");
let classTeacherDao = require("../../dao/classteacher/classteacher.dao");
/**
 *author:qxx
 *description:根据jobId查看本班学生基本信息
 *time:2018/12/9
 */
router.get("/allBasicList/:jobId",async(req, res)=> {
  let jobId = req.params.jobId;
  //利用try...catch语句捕捉异常，try语句中正常执行业务逻辑代码，利用catch语句捕捉try语句中执行代码的异常。
  try {
      //await后面跟的函数表示这是一个异步函数，根据jobId去查询班级学生的基本信息，如果一切正常，返回的结果是该函数中resolve的结果
      // 如果出现异常，则在该函数中rejetc，在这里的catch语句中捕捉reject异常
      let result=await classTeacherDao.getBasicClassInfo(jobId);
      //利用jsonBack构建返回体，并向前端返回信息拉取成功的数据
      jsonUtils.jsonBack(res, true, result, "本班学生信息拉取成功！")
  }catch (e) {
      //利用jsonBack构建返回体，并向前端返回错误原因，以免前端页面因为访问错误而无法得知错误信息
      jsonUtils.jsonBack(res, false, null,'参数错误');
  }
});

/**
 *author:qxx
 *description:设置班级团委头衔信息
 *time:2018/12/9
 */
router.post("/setClassPosition", function(req, res) {
   //设置班委信息，主要是根据请求体中的学生ID和班委职位名称向数据库更新指定学生的班级职位信息
  let { position, studentId } = req.body.classPosition;
  classTeacherDao.setClassPosition(
    function(result) {
      if (result) {
          //回调函数的结果是更新成功与否，如果为true，则向前端返回更新成功信息
        jsonUtils.jsonBack(res, true, null, "班委信息设置成功！");
      } else {
          //更新失败的话则返回错误信息，前端做异常处理
        jsonUtils.jsonBack(res, false, null, "内部出现了一点问题！");
      }
    },
    position,
    studentId
  );
});

/**
 *author:qxx
 *description:查看本班家庭经济困难学生
 *time:2018/12/9
 */
router.get("/classPoorList/:jobId", function(req, res) {
  let jobId = req.params.jobId;
  //调用dao层的获取班级贫困生的函数获取结果集，参数为班主任工号jobId
  classTeacherDao.getClassPoor(function(result) {
     //对结果集进行处理，如果结果集返回的是error则向前端响应错误信息，否则响应结果集。
    if (result !== "error") {
      jsonUtils.jsonBack(res, true, result, "查看本班经济困难学生信息！");
    } else {
      jsonUtils.jsonBack(res, false, null, "内部出现了一点问题！");
    }
  }, jobId);
});

/**
 *author:qxx
 *description:返回本班需要审批的贫困生申请列表
 *time:2019/2/19
 */
router.get("/getClassPoorCheck/:jobId",function (req,res) {
    //原理和上一个获取本班经济困难学生信息相同
    let jobId=req.params.jobId;
    classTeacherDao.getClassPoorCheck(function (result) {
        if(result!=='error'){
            jsonUtils.jsonBack(res, true, result, "本班需要审批的经济困难学生信息已返回！");
        }else{
            jsonUtils.jsonBack(res, false, null, "内部出现了一点问题！");
        }
    },jobId);
})

/**
 *author:qxx
 *description:审批本班贫困生信息
 *time:2019/2/19
 */
router.post('/approvedPoorByClassTeacher',function (req,res) {
    //根据请求体中的班主任审批贫困生信息去更新数据库中的字段值
    //审批贫困生信息中包含两个属性，一个是学号（studentId）另一个是班主任对的态度，即同意（true）和不同意(false)
    let { studentId,attitude }=req.body.poorAttitude;
    if(attitude){
        //如果班主任同意，则调用dao层的班主任同意函数
        classTeacherDao.approvedPoor(function (result) {
            //该回调函数的返回值为true或者false,为true则表示approvedPoor函数执行成功，否则表示执行失败。
            if(result){
                jsonUtils.jsonBack(res,true,null,'班主任已经审批通过申请！');
            }else{
                jsonUtils.jsonBack(res,false,null,'内部出现了一点问题！');
            }
        },studentId)
    }else{
        //如果班主任不同意，则调用dao层的班主任不同意函数
        classTeacherDao.notApprovedPoor(function (result) {
            if(result){
                jsonUtils.jsonBack(res,true,null,'班主任不同意通过申请！');
            }else{
                jsonUtils.jsonBack(res,false,null,'内部出现了一点问题！');
            }
        },studentId)
    }
})

/**
 *author:qxx
 *description:根据jobId查看本班学生住宿情况
 *time:2018/12/9
 */
router.get("/classDormitoryList/:jobId", function(req, res) {
  //原理与获取班级学生基本信息相同
  let jobId = req.params.jobId;
  classTeacherDao.getClassAccommodation(function(result) {
    if (result !== "error") {
      jsonUtils.jsonBack(res, true, result, "本班学生住宿情况拉取成功！");
    } else {
      jsonUtils.jsonBack(res, false, null, "内部出现了一点问题！");
    }
  }, jobId);
});

/**
 *author:qxx
 *description:填写本学期班主任工作计划
 *time:2018/12/10
 */
router.post("/fillClassTeacherScheme", function(req, res) {
    //该功能主要是是在请求体中获取前端填写的班主任工作计划信息，
    // 在班主任工作计划信息中包含一个参数为update，因为前端有一个班主任更新工作计划的功能
    // 所以对于班主任工作计划的存储需要根据update来执行对应的函数
    let schemeInfo = req.body.schemeInfo;

   let update=schemeInfo.update;
   if(update){
       //如果update为true则表示当前传来的工作计划是更新过后的，只需要调用dao层的更新班主任工作计划函数，
       // 参数为schemeInfo
       classTeacherDao.updateWorkPlan(function (result) {
           if (result) {
               jsonUtils.jsonBack(res, true, null, "班主任本学期工作计划更新成功！");
           } else {
               jsonUtils.jsonBack(res, false, null, "内部出现了一点问题！");
           }
       },schemeInfo)
   }else{
       //如果update为false则表示当前传来的工作计划是第一次录入的，只需要调用dao层的插入班主任工作计划函数
       //参数为schemeInfo
       classTeacherDao.fillWorkPlan(function(result) {
           if (result) {
               jsonUtils.jsonBack(res, true, null, "班主任本学期工作计划填写成功！");
           } else {
               jsonUtils.jsonBack(res, false, null, "内部出现了一点问题！");
           }
       }, schemeInfo);
   }
});

/**
 *author:qxx
 *description:填写召开班会记录
 *time:2018/12/10
 */
router.post("/fillClassMeetingRecord", function(req, res) {
    //根据jobId插入班会信息，参数为meetingInfo，meetingInfo中包含jobId
  let meetingInfo = req.body.meetingInfo;
  classTeacherDao.fillMeetingRecord(function(result) {
    if (result) {
      jsonUtils.jsonBack(res, true, null, "班会记录填写成功！");
    } else {
      jsonUtils.jsonBack(res, false, null, "内部出现了一点问题！");
    }
  }, meetingInfo);
});

/**
 *author:qxx
 *description:填写下寝室记录
 *time:2018/12/10
 */
router.post("/fillClassDormitoryRecord", function(req, res) {
  //原理与填写班会记录相同
  let {
    jobId,
    time,
    semester,
    week,
    dormitoryNames,
    mainContent
  } = req.body.dormitoryRecord;
  classTeacherDao.fillDormitoryRecord(
    function(result) {
      if (result) {
        jsonUtils.jsonBack(res, true, null, "寝室记录表已填写成功！");
      } else {
        jsonUtils.jsonBack(res, false, null, "内部出现了一点问题！");
      }
    },
    jobId,
    time,
    semester,
    week,
    dormitoryNames,
    mainContent
  );
});

/**
 *author:qxx
 *description:填写寝室卫生情况
 *time:2019/1/24
 */
router.post("/fillBedroomHygiene", function(req, res) {
   //原理与填写班会记录相同
  let bedRoomHygiene = req.body.bedRoomHygiene;
  classTeacherDao.fillBedRoomHygieneInfo(function(result) {
    if (result) {
      jsonUtils.jsonBack(res, true, null, "寝室卫生表已填写成功！");
    } else {
      jsonUtils.jsonBack(res, false, null, "内部出现了一点问题！");
    }
  }, bedRoomHygiene);
});

/**
 *author:qxx
 *description:填写学生谈话记录表
 *time:2018/12/10
 */
router.post("/fillStudentTalkRecord", function(req, res) {
  //与填写班会记录相同
  let {
    jobId,
    studentName,
    talkTime,
    times,
    mainProblem,
    kpOfCounseling,
    types
  } = req.body.talkRecord;
  classTeacherDao.fillTalkRecord(
    function(result) {
      if (result) {
          jsonUtils.jsonBack(res, true, null, "学生谈话记录表已填写成功！");
      } else {
          jsonUtils.jsonBack(res, false, null, "内部出现了一点问题！");
      }
    },
    jobId,
    studentName,
    talkTime,
    times,
    mainProblem,
    kpOfCounseling,
    types
  );
});

/**
 *author:qxx
 *description:对突发事件进行记录
 *time:2018/12/10
 */
router.post("/fillEmergencyInfo", function(req, res) {
    //与填写班会记录相同
  let emergencyInfo = req.body.emergencyInfo;
  classTeacherDao.fillEmergenciesRecord(function(result) {
    if (result) {
      jsonUtils.jsonBack(res, true, null, "突发事件记录成功！");
    } else {
      jsonUtils.jsonBack(res, false, null, "内部出现了一点问题！");
    }
  }, emergencyInfo);
});

/**
 *author:qxx
 *description:查看本班学生获奖情况
 *time:2018/12/10
 */
router.get("/classAwardList/:jobId", function(req, res) {
   //与查看本班学生信息相同
  let jobId = req.params.jobId;
  classTeacherDao.getClassAwardInfo(function(result) {
    if (result) {
      jsonUtils.jsonBack(res, true, result, "学生获奖列表已返回！");
    } else {
      jsonUtils.jsonBack(res, false, null, "内部出现了一点问题！");
    }
  }, jobId);
});
/**
 *author:qxx
 *description:查看本班学生违纪情况
 *time:2018/12/10
 */
router.get("/classViolationList/:jobId", function(req, res) {
    //与查看本班学生信息相同
  let jobId = req.params.jobId;
  classTeacherDao.getClassViolationInfo(function(result) {
    if (result) {
      jsonUtils.jsonBack(res, true, null, "本班学生违纪列表已返回！");
    } else {
      jsonUtils.jsonBack(res, false, null, "内部出现了一点问题！");
    }
  }, jobId);
});

/**
 *author:qxx
 *description:填写班级活动记录
 *time:2019/1/24
 */

router.post("/fillClassActivity", function(req, res) {
  //与填写班委信息原理相同
  let classActivity = req.body.classActivity;
  classTeacherDao.fillClassActivityInfo(function(result) {
    if (result) {
      jsonUtils.jsonBack(res, true, null, "班级活动记录已成功插入！");
    } else {
      jsonUtils.jsonBack(res, false, null, "内部出现了一点问题！");
    }
  }, classActivity);
});

/**
 *author:qxx
 *description:返回班会记录表
 *time:2019/2/18
 */
router.get('/classMeetingRecordList/:jobId',function (req,res) {
    //与查看本班学生信息相同
 let jobId=req.params.jobId;
 classTeacherDao.getMeetingRecord(function (result) {
     if(result!=='error'){
         jsonUtils.jsonBack(res, true, result, "班会记录表返回成功!");
     }else{
         jsonUtils.jsonBack(res, false, null, "内部出现错误!");
     }
 },jobId)
})

/**
 *author:qxx
 *description:返回谈话记录表
 *time:2019/2/18
 */
router.get('/stuTalkRecordList/:jobId',function (req,res) {
    //与查看班级学生信息相同
    let jobId=req.params.jobId;
    classTeacherDao.getStuTalkRecord(function (result) {
        if(result!=='error'){
            jsonUtils.jsonBack(res, true, result, "谈话记录表返回成功!");
        }else{
            jsonUtils.jsonBack(res, false, null, "内部出现错误!");
        }
    },jobId)
})
/**
 *author:qxx
 *description:返回紧急情况记录表
 *time:2019/2/18
 */
router.get('/emergencyRecordList/:jobId',function (req,res) {
    //与查看班级学生信息相同
    let jobId=req.params.jobId;
    classTeacherDao.getEmergencyRecord(function (result) {
        if(result!=='error'){
            jsonUtils.jsonBack(res, true, result, "紧急情况记录表返回成功!");
        }else{
            jsonUtils.jsonBack(res, false, null, "内部出现错误!");
        }
    },jobId)
})
/**
 *author:qxx
 *description:返回查寝室记录表
 *time:2019/2/18
 */

router.get('/dormitoryRecordList/:jobId',function (req,res) {
    //与查看班级学生信息相同
    let jobId=req.params.jobId;
    classTeacherDao.getDomitoryRecord(function (result) {
        if(result!=='error'){
            jsonUtils.jsonBack(res, true, result, "下寝室记录表返回成功!");
        }else{
            jsonUtils.jsonBack(res, false, null, "内部出现错误!");
        }
    },jobId)
})

/**
 *author:qxx
 *description:填写违纪记录表
 *time:2019/2/19
 */
router.post('/fillViolationRecord',function (req,res) {
    //与填写班会记录相同
    let {studentId,violationDegree,violationContent,violationTime,classId}=req.body.violationRecord;
    classTeacherDao.fillVioInfo(function (result) {
        if(result){
            jsonUtils.jsonBack(res, true, null, "填写违纪记录表成功!");
        }else{
            jsonUtils.jsonBack(res, false, null, "内部发生错误!");
        }
    },studentId,violationDegree,violationContent,violationTime,classId)
})

/**
 *author:qxx
 *description:返回违纪记录表
 *time:2019/2/19
 */
router.get('/getViolationRecordList/:jobId',function (req,res) {
    //与查看班级学生信息相同
    let jobId=req.params.jobId;
    classTeacherDao.getClassViolationInfo(function (result) {
        if(result!=='error'){
            jsonUtils.jsonBack(res, true, result, "违纪记录表返回成功!");
        }else{
            jsonUtils.jsonBack(res, false, null, "内部发生错误!");
        }
    },jobId)
})

/**
 *author:qxx
 *description:生成班主任手册
 *time:2018/12/10
 */

module.exports = router;
