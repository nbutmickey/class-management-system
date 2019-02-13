const express = require('express');
const router = express.Router();
const bcrypt =require('bcryptjs');
let classteacherDao = require('../../dao/classteacher/classteacher.dao');
let counselorDao = require('../../dao/counselor/counselor.dao');
let studentDao = require('../../dao/student/student.dao');
let adminDao = require('../../dao/admin/admin.dao')
let  jsonUtils =require('../../utils/jsonBack') ;

/**
 *author:qxx
 *description:批量录入信息
 *time:2018/12/3
 */
router.post('/mutileInfoUpload',function (req,res) {
    let Info=req.body.multipleInfo;
    let type=req.body.type;

    //默认密码进行加密
    const defaultPwd='12345';
    const salt = bcrypt.genSaltSync(10);
    const hashPwd =  bcrypt.hashSync(defaultPwd,salt);

    if(type==='student'){
        let save=true;
        for(let i=0;i<Info.length;i++){
            adminDao.insertPermission(function (result) {
                if(result){
                    studentDao.insertstudentInfo(function (result) {
                        if(result){
                            save=true;
                        }else{
                            save=false;
                        }
                    },Info[i])
                }else{
                        save=false;
                }
            },Info[i].studentId,hashPwd,type)
        };
        if(save){
            jsonUtils.jsonBack(res,true,null,'学生信息批量上传成功！');
        }else{
            jsonUtils.jsonBack(res,false,null,'学生信息批量上传失败！');
        }

    }else if(type==='counselor') {
        let save = true;
        for (let j = 0; j < Info.length; j++) {
            adminDao.insertPermission(function (result) {
                if(result){
                    counselorDao.insertcounselorInfo(function (result) {
                        if (result) {
                            save = true;
                            for (let k = 0; k < Info[j].classList.length; k++) {
                                counselorDao.insertContact(function (result) {
                                    if(result){
                                        save=true;
                                    }else{
                                        save=false;
                                    }
                                }, Info[j].jobId, parseInt(Info[j].classList[k]));
                            }
                        } else {
                            save = false;
                        }
                    }, Info[j])
                }else{
                            save=false;
                }
            },Info[j].jobId,hashPwd,type)
        }
        if (save) {
            jsonUtils.jsonBack(res, true, null, '批量上传辅导员信息成功！');
        } else {
            jsonUtils.jsonBack(res, false, null, '批量上传辅导员信息失败！');
        }

    }else if(type==='classteacher'){
        let save=true;
        for(let j=0;j<Info.length;j++){
            adminDao.insertPermission(function (result) {
               if(result){
                   classteacherDao.insertclassteacherInfo(function (result) {
                       if(result){
                           save=true;
                       }else{
                           save=false;
                       }
                   },Info[j])
               }else{
                            save=false;
               }
            },Info[j].jobId,hashPwd,type);
        }
        if(save){
            jsonUtils.jsonBack(res,true,null,'班主任信息批量上传成功！');
        }else{
            jsonUtils.jsonBack(res,false,null,'班主任信息批量上传失败！');
        }
    }
})

/**
 *author:qxx
 *description:根据studentId、attitude寝室长申请处理
 *time:2018/12/3
 */
router.post('/checkBedRoomChief',function (req,res) {
    let {studentId,attitude}=req.body.adminAttitude;
    if(attitude){
        adminDao.approvedBedRoomChief(function (result) {
            if(result){
                jsonUtils.jsonBack(res,true,null,'已将其设置成为寝室长！');
            }else{
                jsonUtils.jsonBack(res,false,null,'内部出现了一点小问题！');
            }
        },studentId)
    }else {
        adminDao.notApprovedBedRoomChief(function (result) {
            if(result){
                jsonUtils.jsonBack(res,true,null,'不同意设置其为寝室长成功！');
            }else{
                jsonUtils.jsonBack(res,false,null,'内部出现了一点小问题！');
            }
        },studentId);
    }
})

/**
 *author:qxx
 *description:校验前端输入的学生ID是否存在重复
 *time:2018/12/21
 */
router.get('/checkIdRepeat',function (req,res) {
    let id=req.query.id;
    let type=req.query.type;
    if(type==='student'){
        studentDao.getCountsByStudentId(function (result) {
            if(result){
                jsonUtils.jsonBack(res,true,null,'此学号不存在重复！');
            }else{
                jsonUtils.jsonBack(res,false,null,'此学号存在重复！');
            }
        },id)
    }else if(type==='counselor'){
         counselorDao.getCountsByCounselorId(function (result) {
             if(result){
                 jsonUtils.jsonBack(res,true,null,'此工号不存在重复！');
             }else{
                 jsonUtils.jsonBack(res,false,null,'此工号存在重复！');
             }
         },id)
    }else if(type==='classteacher'){
         classteacherDao.getCountsByClassTeacherId(function (result) {
             if(result){
                 jsonUtils.jsonBack(res,true,null,'此工号不存在重复！');
             }else{
                 jsonUtils.jsonBack(res,false,null,'此工号存在重复！');
             }
         },id)
    }
})


/**
 *author:qxx
 *description:录入信息（学生、班主任、辅导员）
 *time:2018/12/2
 */
router.post('/inputInfo',function (req,res) {

    let Info = req.body.Info;
    let type=req.body.type;
    //默认密码进行加密
    const defaultPwd='12345';
    const salt = bcrypt.genSaltSync(10);
    const hashPwd =  bcrypt.hashSync(defaultPwd,salt);

    if(type==='student'){
        adminDao.insertPermission(function (success) {
            if(success){
                studentDao.insertstudentInfo(function (result) {
                    if(result){
                        jsonUtils.jsonBack(res,true,null,'录入学生信息成功！');
                    }else{
                        jsonUtils.jsonBack(res,false,null,'录入学生信息失败！');
                    }
                },Info);
            }else {
                jsonUtils.jsonBack(res,false,null,'身份信息录入失败！');
            }
        },Info.studentId,hashPwd,type);
    }else if(type==='classteacher'){
        adminDao.insertPermission(function (success) {
            if(success){
                classteacherDao.insertclassteacherInfo(function (result) {
                    if(result){
                        jsonUtils.jsonBack(res,true,null,'录入班主任信息成功！');
                    }else{
                        jsonUtils.jsonBack(res,false,null,'录入班主任信息失败！');
                    }
                },Info);
            }else{
                jsonUtils.jsonBack(res,false,null,'身份信息插入失败！');
            }
        },Info.jobId,hashPwd,type);
    }else if(type==='counselor'){
        adminDao.insertPermission(function (success) {
            if(success){
                counselorDao.insertcounselorInfo(function (result) {
                    if(result){
                        let flag=true;
                        for(let i=0;i<Info.classId.length;i++){
                            //插入辅导员和班级的联系
                            counselorDao.insertContact(function (result){
                                if(result)
                                    flag=true;
                                    flag=false;
                            },Info.jobId,Info.classId[i]);
                        }
                        if(flag){
                            jsonUtils.jsonBack(res,true,null,'录入辅导员信息成功！');
                        }else{
                            jsonUtils.jsonBack(res,false,null,'录入辅导员信息失败，插入联系失败！');
                        }

                    }else{
                        jsonUtils.jsonBack(res,false,null,'录入辅导员信息失败，插入基本信息失败！');
                    }
                },Info);
            }else{
                jsonUtils.jsonBack(res,false,null,'身份信息插入失败！');
            }
        },Info.jobId,hashPwd,type)
    }
})

/**
 *author:qxx
 *description:获取所有学院列表
 *time:2019/1/21
 */
router.get('/allCollegeList',function (req,res) {
    adminDao.getAllCollege(function (result) {
         if(result!=='error'){
             jsonUtils.jsonBack(res,true,result,'获取学院列表成功！');
         }else{
             jsonUtils.jsonBack(res,false,null,'内部出现一点错误！');
         }
    });
})

/**
 *author:qxx
 *description:根据collegeId获取所有班级列表
 *time:2019/1/21
 */
router.get('/allClassList/:collegeId',function (req,res) {
    let collegeId=req.params.collegeId;
    adminDao.getAllClassById(function (result) {
        if(result!=='error'){
            jsonUtils.jsonBack(res,true,result,'获取班级列表成功！');
        }else{
            jsonUtils.jsonBack(res,false,null,'内部出现一点错误！');
        }
    },collegeId);
})


/**
 *author:qxx
 *description:获取所有班主任列表
 *time:2019/1/21
 */
router.get('/allClassteacherList',function (req,res) {
    classteacherDao.getAllclassteacherInfo(function (result) {
        if(result!=='error'){
            jsonUtils.jsonBack(res,true,result,'获取班主任列表成功！');
        }else{
            jsonUtils.jsonBack(res,false,null,'内部出现一点错误！');
        }
    });
})

/**
 *author:qxx
 *description:获取所有辅导员列表
 *time:2019/1/21
 */
router.get('/allCounselorList',function (req,res) {
    counselorDao.getAllcounselorInfo(function (result) {
        if(result!=='error'){
            jsonUtils.jsonBack(res,true,result,'获取班主任列表成功！');
        }else{
            jsonUtils.jsonBack(res,false,null,'内部出现一点错误！');
        }
    });
})

/**
 *author:qxx
 *description:获取所有学生列表
 *time:2019/1/21
 */
router.get('/allStudentList',function (req,res) {
    studentDao.getAllstudentInfo(function (result) {
        if(result!=='error'){
            jsonUtils.jsonBack(res,true,result,'获取班主任列表成功！');
        }else{
            jsonUtils.jsonBack(res,false,null,'内部出现一点错误！');
        }

    });
})

/**
 *author:qxx
 *description:根据jobId获取班主任信息
 *time:2019/1/21
 */
router.get('/singleClassteacherInfo/:jobId',function (req,res) {
    let jobId=req.params.jobId;
    classteacherDao.getSingleclassteacherInfo(function (result) {
        if(result!=='error'){
            jsonUtils.jsonBack(res,true,result,'获取班主任列表成功！');
        }else{
            jsonUtils.jsonBack(res,false,null,'内部出现一点错误！');
        }
    },jobId);
})

/**
 *author:qxx
 *description:根据jobId获取辅导员信息
 *time:2019/1/21
 */
router.get('/singleCounselorInfo/:jobId',function (req,res) {
    let jobId=req.params.jobId;
    counselorDao.getSinglecounselorInfo(function (result) {
        if(result!=='error'){
            jsonUtils.jsonBack(res,true,result,'获取辅导员详细成功！');
        }else{
            jsonUtils.jsonBack(res,false,null,'内部出现一点错误！');
        }
    },jobId);
})

/**
 *author:qxx
 *description:根据studentId获取学生详细信息
 *time:2019/1/21
 */
router.get('/singleStudentInfo',function (req,res) {
    let studentId=req.query.studentId;
    studentDao.getSinglestudentInfo(function (result) {
        if(result!=='error'){
            jsonUtils.jsonBack(res,true,result,'获取学生详细信息成功！');
        }else{
            jsonUtils.jsonBack(res,false,null,'内部出现一点错误！');
        }
    },studentId);
})



/**
 *author:qxx
 *description:获取全部寝室（基本）信息
 *time:2019/1/17
 */
router.get('/allBedroomList',function (req,res) {
    let pageSize=req.headers.pagesize;
    let currentPage=req.headers.currentpage;
    adminDao.getAllBuildInfo(function (result) {
        if(result!=='error'){
            jsonUtils.jsonBack(res,true,result,'寝室列表信息获取成功！');;
        }else{
            jsonUtils.jsonBack(res,false,null,'内部发生了异常！');
        }
    },currentPage,pageSize);
})

/**
 *author:qxx
 *description:根据buildId、bedroomId查询寝室详细信息。
 *time:2019/1/19
 */
router.get('/bedroomInfoById',function (req,res) {
    let buildId=req.query.buildId;
    let bedroomId=req.query.bedroomId;
    console.log(buildId,bedroomId);
    let data={};
    adminDao.getBedroomDetailById(function (result) {
        if(result!=='error'){
            //封装返回数据
            data.buildId=result[0].buildId;
            data.buildAddr=result[0].addr;
            data.bedRoomId=result[0].bedRoomId;
            let bedRoomChiefName=result.filter(function(item){if(item.bedRoomChief===1) return item});
            data.bedRoomChief=bedRoomChiefName.length===0 ? '暂无寝室长':bedRoomChiefName[0].name;
            data.memberNumber=result.length;
            data.content=result.map(function (item) {
                return {studentId:item.studentId,name:item.name,className:item.className};
            })
            jsonUtils.jsonBack(res,true,data,'寝室详细信息已返回');
        }else{
            jsonUtils.jsonBack(res,false,null,'内部发生了异常！');
        }

    },buildId,bedroomId);
})

/**
 *author:qxx
 *description:寝室长申请信息展示
 *time:2018/12/4
 */
router.get('/allApplyChiefList',function (req,res) {
    adminDao.getAllApplyForBedRoomChief(function (result) {
        if(result!=='error'){
            jsonUtils.jsonBack(res,true,result,'申请寝室长列表拉取成功！');
        }else{
            jsonUtils.jsonBack(res,false,null,'内部发生了异常！');
        }
    });
})

/**
 *author:qxx
 *description:根据studentId,buildId,bedRoomId异动寝室
 *time:2019/1/22
 */

router.post('/changeBedroom',function (req,res) {
    let {studentId,buildId,bedRoomId}=req.body.changebedroomInfo;
    adminDao.changeBedroomById(function (result) {
        if(result){
            jsonUtils.jsonBack(res,true,null,'异动寝室成功！');
        }else{
            jsonUtils.jsonBack(res,true,null,'异动寝室失败！');
        }
    },studentId,buildId,bedRoomId);
})
/**
 *author:qxx
 *description:更新单个班主任信息
 *time:2019/1/22
 */
router.post('/updateSingleClassteacherInfo',function (req,res) {
    let {jobId,name,collegeId,classId } = req.body.classTeacherInfo;
    const info = {
        jobId:jobId,
        name:name,
        collegeId:collegeId,
        classId:classId
    }
    classteacherDao.updateclasstecacherInfo(function (result){
        if(result){
            jsonUtils.jsonBack(res,true,null,'更新班主任信息成功！');
        }else{
            jsonUtils.jsonBack(res,false,null,'更新班主任信息失败！');
        }
    },info)
})

/**
 *author:qxx
 *description:更新单个辅导员信息
 *time:2019/1/22
 */
router.post('/updateSingleCounselorInfo',function (req,res) {
    let {jobId,name,collegeId } = req.body.counselorInfo;
    const info = {
        jobId:jobId,
        name:name,
        collegeId:collegeId,
    }
    counselorDao.updatecounselorInfo(function (result) {
        if(result){
            jsonUtils.jsonBack(res,true,null,'更新辅导员信息成功！');
        }else{
            jsonUtils.jsonBack(res,false,null,'更新辅导员信息失败！');
        }
    },info)
})

/**
 *author:qxx
 *description:更新单个学生信息
 *time:2019/1/22
 */
router.post('/updateSingleStudentInfo',function (req,res) {
    let { studentId,name,collegeId,classId } = req.body.studentInfo;
    const info = {
        studentId:studentId,
        name:name,
        collegeId:collegeId,
        classId:classId
    }
    studentDao.updatestudentInfo(function (result) {
        if(result){
            jsonUtils.jsonBack(res,true,null,'更新学生信息成功！');
        }else{
            jsonUtils.jsonBack(res,false,null,'更新学生信息失败！');
        }
    },info)
})

/**
 *author:qxx
 *description:删除单个班主任信息
 *time:2019/1/22
 */
router.post('/deleteSingleClassteacherInfo/:jobId',function (req,res) {
    let jobId = req.params.jobId;
    classteacherDao.deleteclassteacherInfo(function (result) {
        if(result){
            jsonUtils.jsonBack(res,true,null,'删除班主任信息成功！');
        }else{
            jsonUtils.jsonBack(res,false,null,'删除班主任信息失败！');
        }
    },jobId)
})

/**
 *author:qxx
 *description:删除单个辅导员信息
 *time:2019/1/22
 */
router.post('/deleteSingleCounselorInfo/:jobId',function (req,res) {
    let jobId = req.params.jobId;
    counselorDao.deletecounselorInfo(function (result) {
        if(result){
            jsonUtils.jsonBack(res,true,null,'删除辅导员信息成功！');
        }else{
            jsonUtils.jsonBack(res,false,null,'删除辅导员信息失败！');
        }
    },jobId)
})
/**
 *author:qxx
 *description:删除单个学生信息
 *time:2019/1/22
 */
router.post('/deleteSingleStudentInfo/studentId',function (req,res) {
    let studentId = req.params.studentId;
    studentDao.deletestudentInfo(function (result) {
        if(result){
            jsonUtils.jsonBack(res,true,null,'删除学生信息成功！');
        }else{
            jsonUtils.jsonBack(res,false,null,'删除学生信息失败！');
        }
    },studentId)
})



module.exports =router;