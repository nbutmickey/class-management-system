let jsonBack = require("../../utils/jsonBack");
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
  try {
      let result=await classTeacherDao.getBasicClassInfo(jobId);
      jsonUtils.jsonBack(res, true, result, "本班学生信息拉取成功！")
  }catch (e) {
      jsonUtils.jsonBack(res, false, null,'参数错误');
  }
});

/**
 *author:qxx
 *description:设置班级团委头衔信息
 *time:2018/12/9
 */
router.post("/setClassPosition", function(req, res) {
  console.log(req.body.classPosition);
  let { position, studentId } = req.body.classPosition;
  classTeacherDao.setClassPosition(
    function(result) {
      if (result) {
        jsonUtils.jsonBack(res, true, null, "班委信息设置成功！");
      } else {
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
  classTeacherDao.getClassPoor(function(result) {
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
    let { studentId,attitude }=req.body.poorAttitude;
    if(attitude){
        classTeacherDao.approvedPoor(function (result) {
            if(result){
                jsonUtils.jsonBack(res,true,null,'班主任已经审批通过申请！');
            }else{
                jsonUtils.jsonBack(res,false,null,'内部出现了一点问题！');
            }
        },studentId)
    }else{
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
  let schemeInfo = req.body.schemeInfo;
  //console.log(schemeInfo);
   let update=schemeInfo.update;
   if(update){
       classTeacherDao.updateWorkPlan(function (result) {
           if (result) {
               jsonUtils.jsonBack(res, true, null, "班主任本学期工作计划更新成功！");
           } else {
               jsonUtils.jsonBack(res, false, null, "内部出现了一点问题！");
           }
       },schemeInfo)
   }else{
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
  //console.log(req.body.dormitoryRecord);
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
  let {
    jobId,
    studentName,
    talkTime,
    times,
    mainProblem,
    kpOfCounseling,
    types
  } = req.body.talkRecord;
  //let flag = false;
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
