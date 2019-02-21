let db = require('../../DB/db');

exports.insertPermission=function(send,user,pwd,role){
    let sql=`INSERT INTO permission(user,pwd,role) VALUES(${user},'${pwd}','${role}')`;
    db.query(sql,[],function (result) {
        try{
            send(true);
        }catch (e) {
            console.log(e);
            send(false);
        }
    })
}

exports.getPassword = function (user,send) {
    let sql=`SELECT pwd FROM permission WHERE user=${user}`;
    db.query(sql,[],function (results,fields) {
        try {
            send(results[0].pwd);
        }catch(err){
            console.log(err);
            send(false);
        }
    })
}

exports.approvedBedRoomChief = function (send,studentId) {
    let sql=`UPDATE bedroomchiefapply SET agree = 2 WHERE studentId=${studentId};UPDATE bedroomsituation SET bedRoomChief=1 WHERE studentId=${studentId}; `;
    db.query(sql,[],function (results,fields) {
        try {
            send(true);
        }catch (err) {
            console.log(err);
            send(false);
        }
    })
}


exports.notApprovedBedRoomChief = function(send,studentId){
    let sql=`UPDATE bedroomchiefapply SET agree = 3 WHERE studentId=${studentId};`;
    db.query(sql,[],function (results,fields) {
        try {
            send(true);
        }catch (err) {
            console.log(err);
            send(false);
        }
    })
}

exports.getAllApplyForBedRoomChief = function(send){
    let sql=`SELECT
            bedroomchiefapply.studentId,
            student.name,
            bedroomchiefapply.buildId,
            bedroomchiefapply.bedRoomId
        FROM
            bedroomchiefapply,
            student
        WHERE
            agree = 1
        AND student.studentId = bedroomchiefapply.studentId
        ORDER BY buildId`;
    db.query(sql,[],function (results,fields) {
        try {
            send(results);
        }catch(err){
            console.log(err);
            results='error'
            send(results);
        }
    })
}

exports.getAllCollege = function (send) {
    let sql=`SELECT * FROM college`;
    db.query(sql,[],function (results,fields) {
        try {
            send(results);
        }catch(err){
            console.log(err);
            // results='error'
            // send(results);
        }
    })
}


exports.getAllClassById = function (send,collegeId) {
    let sql=`SELECT classId,className FROM class WHERE collegeId=${collegeId}`;
    db.query(sql,[],function (results,fields) {
        try {
            send(results);
        }catch(err){
            console.log(err);
            results='error'
            send(results);
        }
    })
}

exports.getAllBuildInfo=function (send,currentPage,pageSize) {
    let sql=`SELECT COUNT(*) FROM dormitory;
            SELECT build,bedRoomId,addr,hygieneSituation FROM dormitory LIMIT ${pageSize} OFFSET ${(currentPage-1)*pageSize};`;
    db.query(sql,[],function (results) {
        try {
            var result={};
            result.total= results[0][0]['COUNT(*)'];
            result.data=results[1];
            send(result);
        }catch(err){
            console.log(err);
            results='error'
            send(results);
        }
    })
}

/**
 *author:qxx
 *description:根据楼号、宿舍号获取宿舍信息
 *time:2019/1/17
 */

exports.getBedroomDetailById=function (send,buildId,bedroomId) {
 let sql=`SELECT
        bedroomsituation.buildId,
        dormitory.addr,
        bedroomsituation.bedRoomId,
        bedroomsituation.studentId,
        bedroomsituation.bedRoomChief,
        student.name,
		class.className
    FROM
        student,
        bedroomsituation,
        dormitory,
		class
    WHERE
        bedroomsituation.studentId = student.studentId
    AND bedroomsituation.buildId=dormitory.build
    AND bedroomsituation.bedRoomId=dormitory.bedRoomId
		AND student.classId=class.classId
    AND bedroomsituation.bedRoomId = ${bedroomId}
    AND bedroomsituation.buildId = ${buildId};`;

    db.query(sql,[],function (results) {
         try {
             send(results);
         }catch(err){
             console.log(err);
             results='error'
             send(results);
         }
     })

}

exports.changeBedroomById=function (send,studentId,buildId,bedroomId) {
    let sql=`UPDATE bedroomsituation SET buildId=${buildId},bedRoomId=${bedroomId},bedRoomChief=0 WHERE studentId=${studentId};`;
    db.query(sql,[],function (results,fields) {
        try {
            send(true);
        }catch (err) {
            console.log(err);
            send(false);
        }
    })
}