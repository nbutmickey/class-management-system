import { jsonBack } from "../../utils/jsonBack";
const express = require('express');
const router = express.Router();
const bcrypt =require('bcryptjs');
let classteacherDao = require('../../dao/classteacher/classteacher.dao');
let counselorDao = require('../../dao/counselor/counselor.dao');
let studentDao = require('../../dao/student');
let adminDao = require('../../dao/admin/admin.dao');
let jsobBack =require('../../utils/jsonBack');
/**
 *author:qxx
 *description:批量录入班主任信息
 *time:2018/12/3
 */
router.post('/uploadClassteacherInfo',function (req,res) {
    let classteacherInfo=req.body.mulitipleTeacherInfo;
    for(let i=0;i<classteacherInfo.length;i++){
           const salt=bcrypt.genSaltSync(10);
           const hash=bcrypt.hashSync(classteacherInfo[i].pwd,salt);
           classteacherInfo.pwd=hash;
    }
    let save=true;
    for(let j=0;j<classteacherInfo.length;j++){
     classteacherDao.insertclassteacherInfo(function (result) {
         if(result)
             save=true;
             save=false;
     },classteacherInfo[j])
    }
    if(save)
        jsonBack(res,true,null,'班主任信息批量上传成功！');
        jsonBack(res,false,null,'班主任信息批量上传失败！');
})

/**
 *author:qxx
 *description:批量录入辅导员信息
 *time:2018/12/3
 */
router.post('/uploadCounselorInfo',function (req,res) {
    let counselorInfo=req.body.mutileCounselorInfo;
    for (let i=0;i<counselorInfo.length;i++){
        const salt=bcrypt.genSaltSync(counselorInfo[i].pwd,salt);
        const hash=bcrypt.hashSync(counselorInfo[i].pwd,salt);
        counselorInfo[i].pwd=hash;
    }
    let save=true;
    for(let j=0;j<counselorInfo.length;j++){
        counselorDao.insertcounselorInfo(function (result) {
            if(result)
            {
                save=true;
                for(let k=0;k<counselorInfo[j].classList.length;k++){
                    counselorDao.insertContact(function (results){
                           if(results)
                               save=true;
                               save=false;
                    },counselorInfo[j].jobId,counselorInfo[j].classList[k]);
                }
            }else {
                save=false;
            }
        },counselorInfo[j])
    }
    if(save)
        jsonBack(res,true,null,'批量上传辅导员信息成功！');
        jsonBack(res,false,null,'批量上传辅导员信息失败！');
})

/**
 *author:qxx
 *description:批量录入学生信息
 *time:2018/12/3
 */
router.post('/uploadStudentInfo',function (req,res) {
    let stuInfo=req.body.multipleStuInfo.multipleInfo;
    //密码进行加密
    for(let i=0;i<stuInfo.length;i++){
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(stuInfo[i].pwd,salt);
        stuInfo[i].pwd=hash;
    }
    let save=true;
    for(let i=0;i<stuInfo.length;i++){
        studentDao.insertstudentInfo(function (result) {
            if(result)
                save=true;
                save=false;
        },stuInfo[i])
    };
    if(save)
        jsonBack(res,true,null,'学生信息批量上传成功！');
        jsonBack(res,false,null,'学生信息批量上传失败！');
})

/**
 *author:qxx
 *description:根据studentId、attitude寝室长申请处理
 *time:2018/12/3
 */
router.post('/approvedBedRoomChief',function (req,res) {
    let {studentId,attitude}=req.body.adminAttitude;
    if(attitude){
        adminDao.approvedBedRoomChief(function (result) {
            if(result)
                jsonBack(res,true,null,'已将其设置成为寝室长！');
                jsonBack(res,false,null,'内部出现了一点小问题！');
        },studentId)
    }else {
        adminDao.notApprovedBedRoomChief(function (result) {
            if(result)
                jsonBack(res,true,null,'不同意设置其为寝室长成功！');
                jsonBack(res,false,null,'内部出现了一点小问题！');
        },studentId);
    }
})

/**
 *author:qxx
 *description:校验前端输入的学生ID是否存在重复
 *time:2018/12/21
 */
router.get('/checkStudentRepeat',function (req,res) {
    let studentId=req.query.studentId;
    studentDao.getCountsByStudentId(function (result) {
        if(result)
            jsonBack(res,true,null,'此学号不存在重复！');
            jsonBack(res,false,null,'此学号存在重复！');
    },studentId)
})

/**
 *author:qxx
 *description:录入班主任信息
 *time:2018/12/2
 */
router.post('/inputClassteacherInfo',function (req,res) {
    let {jobId,name,password,collegeId,classId } = req.body.classTeacherInfo;
    //密码加盐处理进行存储
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password,salt);
    let info = {
        jobId:jobId,
        name:name,
        pwd:hash,
        collegeId:collegeId,
        classId:classId
    }
    classteacherDao.insertclassteacherInfo(function (result) {
        if(result)
            jsonBack(res,true,null,'录入班主任信息成功！');
            jsonBack(res,false,null,'录入班主任信息失败！');
    },info);
})

/**
 *author:qxx
 *description:录入辅导员信息
 *time:2018/12/2
 */
router.post('/inputCounselorInfo',function (req,res) {
    let {jobId,name,password,collegeId,classId} = req.body.counselorInfo;
    //密码加盐处理进行存储
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password,salt);
    const info = {
        jobId:jobId,
        name:name,
        pwd:hash,
        collegeId:collegeId,
    }
    counselorDao.insertcounselorInfo(function (result) {
        if(result){
            let flag=false;
            for(let i=0;i<classId.length;i++){
                //插入辅导员和班级的联系
                flag=counselorDao.insertContact(info.jobId,classId[i]);
            }
            if(flag)
                jsonBack(res,true,null,'录入辅导员信息成功！');
                jsonBack(res,false,null,'录入辅导员信息失败，插入联系失败！');
        }else{
                jsonBack(res,false,null,'录入辅导员信息失败，插入基本信息失败！');
        }
    },info);
})

/**
 *author:qxx
 *description:录入学生信息
 *time:2018/12/2
 */
router.post('/inputStudentInfo',function (req,res) {
    let {
        studentId,
        name,
        sex,
        pwd,
        collegeId,
        classId,
        birthplace,
        birthday,
        partySituation,
        contact,
        position,
        other,
        role } = req.body.studentInfo;
    //密码加盐处理进行存储
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(pwd,salt);
    const info = {
        studentId:studentId,
        name:name,
        pwd:hash,
        birthday:birthday,
        sex:sex,
        birthplace:birthplace,
        partySituation:partySituation,
        contact:contact,
        position:position,
        other:other,
        role:role,
        collegeId:collegeId,
        classId:classId,
    }
    studentDao.insertstudentInfo(function (result) {
        if(result)
            jsonBack(res,true,null,'录入学生信息成功！');
            jsonBack(res,false,null,'录入学生信息失败！');
    },info);
})

/**
 *author:qxx
 *description:获取所有学院列表
 *time:2019/1/21
 */
router.get('/allCollegeList',function (req,res) {
    adminDao.getAllCollege(function (result) {
        if(result!='error')
            jsonBack(res,true,result,'获取学院列表成功！');
            jsonBack(res,false,null,'内部出现一点错误！');
    });
})

/**
 *author:qxx
 *description:根据collegeId获取所有班级列表
 *time:2019/1/21
 */
router.get('/allClassList',function (req,res) {
    let collegeId=req.query.collegeId;
    adminDao.getAllClassById(function (result) {
        if(result!='error')
            jsonBack(res,true,result,'获取班级列表成功！');
            jsonBack(res,false,null,'内部出现一点错误！');
    },collegeId);
})


/**
 *author:qxx
 *description:获取所有班主任列表
 *time:2019/1/21
 */
router.get('/allClassteacherList',function (req,res) {
    classteacherDao.getAllclassteacherInfo(function (result) {
        if(result!='error')
            jsonBack(res,true,result,'获取班主任列表成功！');
            jsonBack(res,false,null,'内部出现一点错误！');
    });
})

/**
 *author:qxx
 *description:获取所有辅导员列表
 *time:2019/1/21
 */
router.get('/allCounselorList',function (req,res) {
    counselorDao.getAllcounselorInfo(function (result) {
        if(result!='error')
            jsonBack(res,true,result,'获取班主任列表成功！');
            jsonBack(res,false,null,'内部出现一点错误！');
    });
})

/**
 *author:qxx
 *description:获取所有学生列表
 *time:2019/1/21
 */
router.get('/allStudentList',function (req,res) {
    studentDao.getAllstudentInfo(function (result) {
        if(result!='error')
            jsonBack(res,true,result,'获取班主任列表成功！');
            jsonBack(res,false,null,'内部出现一点错误！');
    });
})

/**
 *author:qxx
 *description:根据jobId获取班主任信息
 *time:2019/1/21
 */
router.get('/singleClassteacherInfo',function (req,res) {
    let jobId=req.query.jobId;
    classteacherDao.getSingleclassteacherInfo(function (result) {
        if(result!='error')
            jsonBack(res,true,result,'获取班主任列表成功！');
            jsonBack(res,false,null,'内部出现一点错误！');
    },jobId);
})

/**
 *author:qxx
 *description:根据jobId获取辅导员信息
 *time:2019/1/21
 */
router.get('/singleCounselorInfo',function (req,res) {
    let jobId=req.query.jobId;
    counselorDao.getSinglecounselorInfo(function (result) {
        if(result!='error')
            jsonBack(res,true,result,'获取辅导员详细成功！');
            jsonBack(res,false,null,'内部出现一点错误！');
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
        if(result!='error')
            jsonBack(res,true,result,'获取学生详细信息成功！');
            jsonBack(res,false,null,'内部出现一点错误！');
    },studentId);
})



/**
 *author:qxx
 *description:获取全部寝室（基本）信息
 *time:2019/1/17
 */
router.get('/allBedroomList',function (req,res) {
    adminDao.getAllBuildInfo(function (result) {
        if(result!=='error')
            jsonBack(res,true,result,'寝室列表信息获取成功！');
            jsonBack(res,false,null,'内部发生了异常！');
    });
})

/**
 *author:qxx
 *description:根据buildId、bedroomId查询寝室详细信息。
 *time:2019/1/19
 */
router.get('/bedroomInfoById',function (req,res) {
    let buildId=req.query.buildId;
    let bedroomId=req.query.bedroomId;
    let data={};
    adminDao.getBedroomDetailById(function (result) {
        if(result!=='error'){
            //封装返回数据
            data.buildId=result[0].buildId;
            data.buildAddr=result[0].addr;
            data.bedRoomId=result[0].bedRoomId;
            data.bedRoomChief=result[0].bedRoomChief;
            data.content=result.map(function (item) {
                return {studentId:item.studentId,name:item.name,className:item.className};
            })
            jsobBack(res,true,data,'寝室详细信息已返回');
        }
           jsobBack(res,false,null,'内部发生了异常！');
    },buildId,bedroomId);
})

/**
 *author:qxx
 *description:寝室长申请信息展示
 *time:2018/12/4
 */
router.get('/allApplyChiefList',function (req,res) {
    adminDao.getAllApplyForBedRoomChief(function (result) {
        if(result!=='error')
            jsonBack(res,true,result,'申请寝室长列表拉取成功！');
            jsonBack(res,false,null,'内部发生了异常！');
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
        if(result)
            jsonBack(res,true,null,'异动寝室成功！');
            jsonBack(res,true,null,'异动寝室失败！');
    },studentId,buildId,bedRoomId);
})
/**
 *author:qxx
 *description:更新单个班主任信息
 *time:2019/1/22
 */
router.post('/updateSingleClassteacherInfo',function (req,res) {
    let {jobId,name,password,collegeId,classId } = req.body.classTeacherInfo;
    //密码加盐处理进行存储
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password,salt);
    const info = {
        jobId:jobId,
        name:name,
        pwd:hash,
        collegeId:collegeId,
        classId:classId
    }
    classteacherDao.updateclasstecacherInfo(function (result){
        if(result)
            jsonBack(res,true,null,'更新班主任信息成功！');
            jsonBack(res,false,null,'更新班主任信息失败！');
    },info)
})

/**
 *author:qxx
 *description:更新单个辅导员信息
 *time:2019/1/22
 */
router.post('/updateSingleCounselorInfo',function (req,res) {
    let {jobId,name,password,collegeId } = req.body.counselorInfo;
    //密码加盐处理进行存储
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password,salt);
    const info = {
        jobId:jobId,
        name:name,
        pwd:hash,
        collegeId:collegeId,
    }
    counselorDao.updatecounselorInfo(function (result) {
        if(result)
            jsonBack(res,true,null,'更新辅导员信息成功！');
            jsonBack(res,false,null,'更新辅导员信息失败！');
    },info)
})

/**
 *author:qxx
 *description:更新单个学生信息
 *time:2019/1/22
 */
router.post('/updateSingleStudentInfo',function (req,res) {
    let { studentId,name,password,collegeId,classId } = req.body.studentInfo;
    //密码加盐处理进行存储
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password,salt);
    const info = {
        studentId:studentId,
        name:name,
        pwd:hash,
        collegeId:collegeId,
        classId:classId
    }
    studentDao.updatestudentInfo(function (result) {
        if(result)
            jsonBack(res,true,null,'更新学生信息成功！');
            jsonBack(res,false,null,'更新学生信息失败！');
    },info)
})

/**
 *author:qxx
 *description:删除单个班主任信息
 *time:2019/1/22
 */
router.post('/deleteSingleClassteacherInfo',function (req,res) {
    let jobId = req.params.jobId;
    classteacherDao.deleteclassteacherInfo(function (result) {
        if(result)
            jsonBack(res,true,null,'删除班主任信息成功！');
            jsonBack(res,false,null,'删除班主任信息失败！');
    },jobId)
})

/**
 *author:qxx
 *description:删除单个辅导员信息
 *time:2019/1/22
 */
router.post('/deleteSingleCounselorInfo',function (req,res) {
    let jobId = req.params.jobId;
    counselorDao.deletecounselorInfo(function (result) {
        if(result)
            jsonBack(res,true,null,'删除辅导员信息成功！');
            jsonBack(res,false,null,'删除辅导员信息失败！');
    },jobId)
})
/**
 *author:qxx
 *description:删除单个学生信息
 *time:2019/1/22
 */
router.post('/deleteSingleStudentInfo',function (req,res) {
    let studentId = req.params.studentId;
    studentDao.deletestudentInfo(function (result) {
        if(result)
            jsonBack(res,true,null,'删除学生信息成功！');
            jsonBack(res,false,null,'删除学生信息失败！');
    },studentId)
})



module.exports =router;