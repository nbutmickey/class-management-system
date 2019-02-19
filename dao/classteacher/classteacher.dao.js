let db = require("../../DB/db");

/**
 *author:qxx
 *description:检验jobId是否重复的持久层操作
 *time:2019/1/27
 */
exports.getCountsByClassTeacherId = function(send, jobId) {
  let sql = `SELECT COUNT(*) AS count FROM classteacher WHERE jobId=${jobId}`;
  db.query(sql, [], function(results) {
    try {
      if (results[0].count >= 1) {
        send(false);
      } else {
        send(true);
      }
    } catch (err) {
      console.log(err);
      send(false);
    }
  });
};
/**
 *author:qxx
 *description:
 *time:2019/1/27
 */
exports.getclassteacherByAccount = function(jobId, send) {
  let sql = `SELECT name FROM classteacher WHERE jobId=${jobId}`;
  db.query(sql, [], function(results, fields) {
    try {
      send(results[0]);
    } catch (err) {
      console.log(err);
      results = "error";
      send(results);
    }
  });
};
/**
 *author:qxx
 *description:录入班主任信息持久层操作
 *time:2018/12/3
 */
exports.insertclassteacherInfo = function(send, info) {
  let sql = `INSERT INTO classteacher(jobId,name,collegeId,classId) VALUES (${
    info.jobId
  },'${info.name}',${info.collegeId},${info.classId})`;
  db.query(sql, [], function(results, fields) {
    try {
      send(true);
    } catch (err) {
      console.log(err);
      send(false);
    }
  });
};

/**
 *author:qxx
 *description:更新指定班主任信息持久层操作
 *time:2018/12/3
 */
exports.updateclasstecacherInfo = function(send, info) {
  let sql = `UPDATE counselor SET jobId=${info.jobId},name='${
    info.name
  }',collegeId=${info.collegeId},classId=${info.classId} WHERE jobId=${
    info.jobId
  }`;
  db.query(sql, [], function(results, fields) {
    try {
      send(true);
    } catch (err) {
      console.log(err);
      send(false);
    }
  });
};

/**
 *author:qxx
 *description:删除指定班主任信息持久层操作
 *time:2018/12/3
 */
exports.deleteclassteacherInfo = function(send, jobId) {
  let sql = `DELETE FROM classteacher WHERE jobId=${jobId}`;
  db.query(sql, [], function(results, fields) {
    try {
      send(true);
    } catch (err) {
      console.log(err);
      send(false);
    }
  });
};

/**
 *author:qxx
 *description:获取指定班主任信息持久化操作
 *time:2018/12/3
 */
exports.getSingleclassteacherInfo = function(send, jobId) {
  let sql = `SELECT classteacher.*,class.* FROM classteacher,class WHERE classteacher.classId=class.classId AND classteacher.jobId=${jobId}`;
  db.query(sql, [], function(results, fields) {
    try {
      send(results);
    } catch (err) {
      console.log(err);
      results = "error";
      send(results);
    }
  });
};
/**
 *author:qxx
 *description:获取所有班主任信息持久层操作
 *time:2018/12/3
 */
exports.getAllclassteacherInfo = function(send, currentPage, pageSize) {
  let sql = `SELECT classteacher.*,class.* FROM classteacher,class LIMIT ${pageSize} OFFSET (${currentPage}-1)*${pageSize} WHERE classteacher.classId=class.classId`;
  db.query(sql, [], function(results, fields) {
    try {
      send(results);
    } catch (err) {
      console.log(err);
      results = "error";
      send(results);
    }
  });
};


/**
 *author:qxx
 *description:获取需要审批的贫困生信息持久层操作
 *time:2019/2/19
 */
exports.getClassPoorCheck=function(send,jobId){
    let sql=`SELECT
            poorstudentapply.studentId,
            student.name,
            poorstudentapply.agree,
            poorstudentapply.degree,
            poorstudentapply.reason
        FROM
            poorstudentapply,
            student
        WHERE
            poorstudentapply.studentId = student.studentId
        AND poorstudentapply.agree = 1
        AND poorstudentapply.classId = (
            SELECT
                classteacher.classId
            FROM
                classteacher
            WHERE
                classteacher.jobId = ${jobId}
        )`;
    db.query(sql,[],function (result) {
        try {
            send(result);
        }catch (e) {
            console.log(e);
            result='error';
            send(result);
        }
    })
}

/**
 *author:qxx
 *description:审批通过贫困生申请
 *time:2019/2/19
 */
exports.approvedPoor=function(send,studentId){
    let sql=`UPDATE poorstudentapply
            SET agree =-3
            WHERE
	        studentId = ${studentId}`
    db.query(sql,[],function (result) {
        try {
            send(true);
        }catch (e) {
            console.log(e);
            send(false);
        }
    })
}
/**
 *author:qxx
 *description:审批不通过贫困生申请
 *time:2019/2/19
 */
exports.notApprovedPoor=function(send,studentId){
    let sql=`UPDATE poorstudentapply
            SET agree =-2
            WHERE
	        studentId = ${studentId}`
    db.query(sql,[],function (result) {
        try {
            send(true);
        }catch (e) {
            console.log(e);
            send(false);
        }
    })
}

/**
 *author:qxx
 *description:查看本班学生基本信息持久层操作
 *time:2018/12/9
 */
exports.getBasicClassInfo = function(send, jobId) {
  let sql = `SELECT
            student.studentId,
            student.name,
            student.sex,
            student.collegeId,
            student.classId,
            student.position,
						student.partySituation,
						student.contact,
						student.birthday,
            student.birthplace
        FROM
            student  
        WHERE
            student.classId = (
                SELECT
                    classteacher.classId
                FROM
                    classteacher
                WHERE
                    classteacher.jobId = ${jobId}
            )`;
  db.query(sql, [], function(results, fields) {
    try {
      send(results);
    } catch (err) {
      console.log(err);
      results = "error";
      send(results);
    }
  });
};

/**
 *author:qxx
 *description:设置班级团委头衔信息持久层操作
 *time:2018/12/9
 */
exports.setClassPosition = function(send, position, studentId) {
  let sql = `UPDATE student SET position='${position}' WHERE studentId=${studentId}`;
  db.query(sql, [], function(results, fields) {
    try {
      send(true);
    } catch (err) {
      console.log(err);
      send(false);
    }
  });
};
/**
 *author:qxx
 *
 *description:查看本班家庭经济困难学生持久层操作
 *time:2018/12/9
 */
exports.getClassPoor = function(send, jobId) {
  let sql = `SELECT
                poorstudentapply.studentId,
								student.name,
								poorstudentapply.degree,
								poorstudentapply.reason
            FROM
                poorstudentapply,
								student
            WHERE
                poorstudentapply.classId = (
                SELECT
                    classteacher.classId
                FROM
                    classteacher
                WHERE
                    classteacher.jobId = ${jobId}
                AND 
                    poorstudentapply.agree=3    
            )
			AND student.studentId=poorstudentapply.studentId`;
  db.query(sql, [], function(results, fields) {
    try {
      send(results);
    } catch (err) {
      console.log(err);
      results = "error";
      send(results);
    }
  });
};

/**
 *author:qxx
 *description:查看本班学生住宿情况持久层操作
 *time:2018/12/9
 */

exports.getClassAccommodation = function(send, jobId) {
  let sql = `SELECT
						bedroomsituation.studentId,
                        student. name,
						bedroomsituation.bedRoomChief,
						bedroomsituation.bedRoomId,
						bedroomsituation.buildId
        FROM
            student,
            bedroomsituation
        WHERE
            student.classId = (
                SELECT
                    classteacher.classId
                FROM
                    classteacher
                WHERE
                    classteacher.jobId = ${jobId}
            )
        AND student.studentId=bedroomsituation.studentId`;

  db.query(sql, [], function(results, fields) {
    try {
      send(results);
    } catch (err) {
      console.log(err);
      results = "error";
      send(results);
    }
  });
};

/**
 *author:qxx
 *description:填写本学期班主任工作计划持久层操作
 *time:2018/12/10
 */
exports.fillWorkPlan = function(send, info) {
  let sql = `INSERT INTO classteacherscheme (jobId, semester, content)
            VALUES
	            (
		             ${info.jobId}, 
		            '${info.semester}',
		            '${info.content}'
	        )`;
  db.query(sql, [], function(results, fields) {
    try {
      send(true);
    } catch (err) {
      console.log(err);
      send(false);
    }
  });
};
/**
 *author:qxx
 *description:填写召开班会记录持久层操作
 *time:2018/12/10
 */
exports.fillMeetingRecord = function(send, info) {
  let sql = `INSERT INTO classmeetingrecord (
                jobId,
                time,
                addr,
                participateNumber,
                theme,
                mainContent
            )
            VALUES
                (
                    ${info.jobId}, 
                    '${info.time}',
                    '${info.addr}',
                    ${parseInt(info.participateNumber)},
                    '${info.theme}',
                    '${info.mainContent}'
                )`;
  db.query(sql, [], function(results, fields) {
    try {
      send(true);
    } catch (err) {
      console.log(err);
      send(false);
    }
  });
};

/**
 *author:qxx
 *description:班会记录持久层操作
 *time:2019/2/18
 */

exports.getMeetingRecord = function(send, jobId) {
  let sql = `SELECT
	cmr.theme,
	cmr.mainContent,
	cmr.addr,
	cmr.participateNumber,
	cmr.time
FROM
	classmeetingrecord AS cmr
WHERE
	cmr.jobId = ${jobId}`;
  db.query(sql, [], function(result, field) {
    try {
      send(result);
    } catch (err) {
      console.log(err);
      result = "error";
      send(result);
    }
  });
};


/**
 *author:qxx
 *description:填写下寝室记录持久层操作
 *time:2018/12/10
 */
exports.fillDormitoryRecord = function(
  send,
  jobId,
  time,
  semester,
  week,
  dormitoryNames,
  mainContent
) {
  let sql = `INSERT INTO dormitoryrecord(jobId,time,semester,week,dormitoryNames,mainContent) 
              VALUES(${jobId},'${time}','${semester}',${week},'${dormitoryNames}','${mainContent}')`;
  db.query(sql, [], function(results, fields) {
    try {
      send(true);
    } catch (err) {
      console.log(err);
      send(false);
    }
  });
};

/**
 *author:qxx
 *description:寝室记录
 *time:2019/2/18
 */
exports.getDomitoryRecord = function(send, jobId) {
  let sql = `SELECT
	dr.semester,
	dr.week,
	dr.dormitoryNames,
	dr.time,
	dr.mainContent
FROM
	dormitoryrecord AS dr
WHERE
	dr.jobId=${jobId}`;
  db.query(sql, [], function(result, field) {
    try {
      send(result);
    } catch (err) {
      console.log(err);
      result = "error";
      send(result);
    }
  });
};
/**
 *author:qxx
 *description:填写学生谈话记录表持久层操作
 *time:2018/12/10
 */
exports.fillTalkRecord = function(
  send,
  jobId,
  studentName,
  talkTime,
  times,
  mainProblem,
  kpOfCounseling,
  types
) {
  let sql = `INSERT INTO studenttalkrecord(jobId,studentName,talkTime,times,mainProblem,kpOfCounseling,types) 
            VALUES(${jobId},'${studentName}','${talkTime}',${times},'${mainProblem}','${kpOfCounseling}','${types}')`;
  db.query(sql, [], function(results, fields) {
    try {
      send(true);
    } catch (err) {
      console.log(err);
      send(false);
    }
  });
};

/**
 *author:qxx
 *description:学生谈话记录表信息获取
 *time:2019/2/18
 */
exports.getStuTalkRecord = function(send, jobId) {
  let sql = `SELECT
	stk.mainProblem,
	stk.studentName,
	stk.types,
	stk.talkTime,
	stk.times,
	stk.kpOfCounseling
FROM
	studenttalkrecord stk
WHERE
	stk.jobId = ${jobId}`;
  db.query(sql, [], function(result, field) {
    try {
      send(result);
    } catch (err) {
      console.log(err);
      result = "error";
      send(result);
    }
  });
};

/**
 *author:qxx
 *description:对突发事件进行记录持久层操作
 *time:2018/12/10
 */
exports.fillEmergenciesRecord = function(send, info) {
  let sql = `INSERT INTO emergencyrecord(jobId,eventName,time,addr,mainContent,solve,result,studentNames) 
            VALUES(${info.jobId},'${info.eventName}','${info.time}','${
    info.addr
  }','${info.mainContent}','${info.solve}','${info.result}','${
    info.studentNames
  }')`;
  db.query(sql, [], function(results, fields) {
    try {
      send(true);
    } catch (err) {
      console.log(err);
      send(false);
    }
  });
};
/**
 *author:qxx
 *description:突发事件情况
 *time:2019/2/18
 */
exports.getEmergencyRecord = function(send, jobId) {
  let sql = `SELECT
	er.addr,
	er.eventName,
	er.mainContent,
	er.result,
	er.solve,
	er.studentNames,
	er.time
FROM
	emergencyrecord er
WHERE
	er.jobId = ${jobId}`;
  db.query(sql, [], function(result, field) {
    try {
      send(result);
    } catch (err) {
      console.log(err);
      result = "error";
      send(result);
    }
  });
};
/**
 *author:qxx
 *description:查看本班学生获奖情况持久层操作
 *time:2018/12/10
 */
exports.getClassAwardInfo = function(send, jobId) {
  let sql = `SELECT
            student.name,
            awar.studentId,
            awar.awardTime,
            awar.awardName,
            awar.awardAgency
        FROM
            student,
            awardinformation AS awar
 
        WHERE
            awar.studentId = student.studentId
        AND awar.classId = (
            SELECT
                classteacher.classId
            FROM
                classteacher
            WHERE
                classteacher.jobId = $ { jobId }
        )`;
  db.query(sql, [], function(results, fields) {
    try {
      send(results);
    } catch (err) {
      console.log(err);
      results = "error";
      send(results);
    }
  });
};
/**
 *author:qxx
 *description:查看本班学生违纪情况持久层操作
 *time:2018/12/10
 */
exports.getClassViolationInfo = function(send, jobId) {
  let sql = `SELECT
            vio.studentId,
            student.name,
            vio.violationTime,
            vio.violationDegree,
            vio.violationContent
        FROM
            student,
            violation AS vio
       
        WHERE
            vio.studentId = student.studentId
        AND vio.classId = (
            SELECT
                classteacher.classId
            FROM
                classteacher
            WHERE
                classteacher.jobId = ${jobId}
        )`;
  db.query(sql, [], function(results, fields) {
    try {
      send(results);
    } catch (err) {
      console.log(err);
      results = "error";
      send(results);
    }
  });
};

/**
 *author:qxx
 *description:填写寝室卫生情况持久层操作
 *time:2018/12/10
 */
exports.fillBedRoomHygieneInfo = function(send, info) {
  let sql = `INSERT INTO bedroomhygiene(jobId,semester,week,state,buildId,bedRoomId) 
            VALUES(${info.jobId},'${info.semester}',${info.week},'${
    info.state
  }',${buildId},${bedRoomId})`;
  db.query(sql, [], function(results, fields) {
    try {
      send(true);
    } catch (err) {
      console.log(err);
      send(false);
    }
  });
};

/**
 *author:qxx
 *description:填写班级活动记录表的持久层操作
 *time:2019/1/24
 */
exports.fillClassActivityInfo = function(send, info) {
  let sql = `
        INSERT INTO classactivities (
        jobId,
        activityTime,
        activityAddr,
        participateNumber,
        isJoin,
        mainContent
    )
    VALUES
        (${info.jobId},'${info.activityTime}','${info.activityAddr}',${
    info.participateNumber
  },${info.isJoin},'${info.mainContent}')`;
  db.query(sql, [], function(result) {
    try {
      send(true);
    } catch (err) {
      console.log(err);
      send(false);
    }
  });
};

/**
 *author:qxx
 *description:生成班主任手册持久层操作
 *time:2018/12/10
 */
