const express = require('express');
const router = express.Router();
const bcrypt =require('bcryptjs');
let classteacherDao = require('../../dao/classteacherDao');
let counselorDao = require('../../dao/counselorDao');
let studentDao = require('../../dao/studentDao');
let adminDao = require('../../dao/adminDao');
/**
 *author:qxx
 *description:批量录入班主任信息
 *time:2018/12/3
 */
router.post('/uploadClassteacherInfo',function (req,res) {

})


/**
 *author:qxx
 *description:批量录入辅导员信息
 *time:2018/12/3
 */
router.post('/uploadCounselorInfo',function (req,res) {
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
            if(result){
                save=true;
            }else{
                save=false;
            }
        },stuInfo[i])
    };
    if(save){
        res.json({
            success:true,
            message:'批量学生信息上传成功！'
        })
    }else{
        res.json({
            success:false,
            message:'批量学生信息上传失败！'
        })
    }
})

/**
 *author:qxx
 *description:寝室长申请处理（同意）
 *time:2018/12/3
 */
router.post('/approvedBedRoomChief',function (req,res) {
    let studentId=req.params.studentId;
    adminDao.approvedBedRoomChief(function (result) {
        if(result){
            res.json({
                success:true,
                message:'已成功将其设置为寝室长！'
            })
        }else{
            res.json({
                success:false,
                message:'出现了一点错误，请重新操作！'
            })
        }
    },studentId)
})

/**
 *author:qxx
 *description:寝室长申请处理（不同意）
 *time:2018/12/3
 */
router.post('/notApprovedBedRoomChief',function (req,res) {
    let studentId=req.params.studentId;
    adminDao.notApprovedBedRoomChief(function (result) {
        if(result){
            res.json({
                success:true,
                message:'管理员不同意'
            })
        }else{
            res.json({
                success:false,
                message:'出现了一点错误，请重新操作！'
            })
        }
    },studentId)
})

/**
 *author:qxx
 *description:校验前端输入的学生ID是否存在重复
 *time:2018/12/21
 */
router.get('/checkStudentRepeat',function (req,res) {
    let studentId=req.query.studentId;
    studentDao.getCountsByStudentId(function (result) {
        if(result){
            res.json({
                success:true,
                message:'此学号可以录入！'
            })
        }else{
            res.json({
                success:false,
                message:'此学号已经存在！'
            })
        }
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
        if(result){
            res.json({
                success:true,
                message:'录入班主任信息成功',
                data:null,
            })
        }else {
            res.json({
                success:false,
                message:'录入班主任信息失败',
                data:null,
            })
        }
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
                flag=counselorDao.insertContact(info.jobId,classId[i]);
            }
            if(flag){
                res.json(
                    {
                        success:true,
                        message:'录入辅导员信息成功',
                        data:null,
                    }
                );
            }else{
                res.json({
                    success:false,
                    message:'录入辅导员信息失败，插入联系失败！',
                    data:null,
                })
            }
        }else{
            res.json(
                {
                    success:false,
                    message:'录入辅导员信息失败，插入基本信息失败！',
                    data:null,
                }
            )
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
        if(result){
            res.json({
                success:true,
                message:'录入学生信息成功',
                data:null,
            })
        }else {
            res.json({
                success:false,
                message:'录入学生信息失败',
                data:null,
            })
        }
    },info);
})



router.get('/getAllCollege',function (req,res) {
    adminDao.getAllCollege(function (result) {
        res.send(result);
    });
})

router.get('/getAllClass',function (req,res) {
    console.log(req.query.collegeId);
    adminDao.getAllClass(function (result) {
        res.send(result);
    },req.query.collegeId);
})

router.get('/getClassteacherAllInfo',function (req,res) {
    classteacherDao.getAllclassteacherInfo(function (result) {
        res.send(result);
    });
})
router.get('/getCounselorAllInfo',function (req,res) {
    counselorDao.getAllcounselorInfo(function (result) {
        res.send(result);
    });
})
router.get('/getStudentAllInfo',function (req,res) {
    studentDao.getAllstudentInfo(function (result) {
        res.send(result);
    });
})
router.get('/getSingleteacherInfo',function (req,res) {
    let jobId=req.query.jobId;
    classteacherDao.getSingleclassteacherInfo(function (result) {
        res.send(result);
    },jobId);
})
router.get('/getSingleCounselorInfo',function (req,res) {
    let jobId=req.query.jobId;
    counselorDao.getSinglecounselorInfo(function (result) {
        res.send(result);
    },jobId);
})
router.get('/getSingleStudentInfo',function (req,res) {
    let studentId=req.query.studentId;
    studentDao.getSinglestudentInfo(function (result) {
        res.send(result);
    },studentId);
})

/**
 *author:qxx
 *description:寝室长申请信息展示
 *time:2018/12/4
 */
router.get('/getApplyChiefAllInfo',function (req,res) {
    adminDao.getAllApplyForBedRoomChief(res.send);
})



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
        if(result){
            res.json({
                success:true,
                message:'更新班主任信息成功',
                data:null,
            })
        }else{
            res.json({
                success:false,
                message:'更新班主任信息失败',
                data:null,
            })
        }
    },info)
})

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
        if(result){
            res.json({
                success:true,
                message:'更新辅导员信息成功',
                data:null,
            })
        }else{
            res.json(
                {
                    success:false,
                    message:'更新辅导员信息失败',
                    data:null,
                }
            )
        }
    },info)
})
router.post('/updateSingleStudentInfo',function (req,res) {
    let { studentId,name,password,collegeId,classId } = req.body.studentInfo;
    //密码加盐处理进行存储
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password,salt);
    let results;
    const info = {
        studentId:studentId,
        name:name,
        pwd:hash,
        collegeId:collegeId,
        classId:classId
    }
    studentDao.updatestudentInfo(function (result) {
        if(result){
            res.json({
                success:true,
                message:'更新学生信息成功',
                data:null,
            })
        }else{
            res.json({
                success:true,
                message:'更新学生信息失败',
                data:null,
            })
        }
    },info)
})


router.post('/deleteSingleClassteacherInfo',function (req,res) {
    let jobId = req.params.jobId;
    classteacherDao.deleteclassteacherInfo(function (result) {
        if(result){
            res.json({
                success:true,
                message:'删除班主任信息成功',
                data:null,
            })
        }else {
            res.json({
                success:false,
                message:'删除班主任信息失败',
                data:null,
            })
        }
    },jobId)
})

router.post('/deleteSingleCounselorInfo',function (req,res) {
    let jobId = req.params.jobId;
    counselorDao.deletecounselorInfo(function (result) {
        if(result){
            res.json({
                success:true,
                message:'删除辅导员信息成功',
                data:null,
            })
        }else {
            res.json({
                success:false,
                message:'删除辅导员信息失败',
                data:null,
            })
        }
    },jobId)
})

router.post('/deleteSingleStudentInfo',function (req,res) {
    let studentId = req.params.studentId;
    studentDao.deletestudentInfo(function (result) {
        if(result){
            res.json({
                success:true,
                message:'删除辅导员信息成功',
                data:null,
            })
        }else {
            res.json({
                success:false,
                message:'删除辅导员信息失败',
                data:null,
            })
        }
    },studentId)
})

module.exports =router;