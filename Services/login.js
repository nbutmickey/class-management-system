/**
 *author:qxx
 *description:处理各种角色登录模块
 *time:2018/12/2
 */
const express = require('express');
const router = express.Router();
// const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
let adminDao = require('../dao/admin/admin.dao');
let studentDao = require('../dao/student/student.dao');
let classteacherDao = require('../dao/classteacher/classteacher.dao');
let counselorDao = require('../dao/counselor/counselor.dao');

router.post('/getUserInfo',function (req,res) {
    let token=req.body.token;
    if(token){
        jwt.verify(token,'mickey',(err,decoded)=>{
            if(err){
                res.json(
                    {
                        success:false,
                        message:'内部出现了错误！'
                    }
                )
            }else{
                let loginType=[];
                let role=decoded.role;
                let account=decoded.name;
                loginType.push(role);
                if(role==='admin'){
                     res.json({
                         success:true,
                         username:'Mickey',
                         roles:loginType,
                         account:account
                     })
                }else if(role==='student'){
                    studentDao.getStudentByAccount(account,function (result) {
                        if(result!=='error'){
                            res.json({
                                success:true,
                                username:result.name,
                                roles:loginType,
                                account:account
                            })
                        }
                    })
                }else if(role==='counselor'){
                     counselorDao.getcounselorByAccount(account,function (result) {
                         if(result!=='error'){
                             res.json({
                                 success:true,
                                 username:result.name,
                                 roles:loginType,
                                 account:account
                             })
                         }
                     })
                }else{
                       classteacherDao.getclassteacherByAccount(account,function (result) {
                           if(result!=='error'){
                               res.json({
                                   success:true,
                                   username:result.name,
                                   roles:loginType,
                                   account:account
                               })
                           }
                       })
                }
            }
        })
    }else{
        res.json({
            success:false,
            message:'No Token Provided!'
        })
    }
})


router.post('/login',function (req,res) {
    let {username,password,role}=req.body.loginInfo;
    if(role==='admin'){
        adminDao.getPassword(username,function (result) {
            if(result==password){
                const userToken = {
                    name:username,
                    pwd:password,
                    role:role
                }
                //产生一个密钥
                const secret = 'mickey';
                //生成token
                const token = jwt.sign(userToken,secret);
                res.json({
                    success:true,
                    message:'登录成功，请继续后续操作。',
                    AccessToken:token,
                })
            }else{
                res.json({
                    success:false,
                    message:'登录失败，账号或密码错误，请检查后再次登录!',
                    AccessToken:null,
                })
            }
        })
    }else if(role==='student') {
        adminDao.getPassword(username,function (result) {
            if(bcrypt.compareSync(password,result)){
                const userToken = {
                    name:username,
                    pwd:password,
                    role:role
                }
                //产生一个密钥
                const secret = 'mickey';
                //生成token
                const token = jwt.sign(userToken,secret);
                res.json({
                    success:true,
                    message:'登录成功，请继续后续操作。',
                    AccessToken:token,
                })
            }else{
                res.json({
                    success:false,
                    message:'登录失败，账号或密码错误，请检查后再次登录!',
                    AccessToken:null,
                })
            }
        })
    }else if(role==='counselor'){
            adminDao.getPassword(username,function (result) {
                if(bcrypt.compareSync(password,result)){
                    const userToken = {
                        name:username,
                        pwd:password,
                        role:role
                    }
                    //产生一个密钥
                    const secret = 'mickey';
                    //生成token
                    const token = jwt.sign(userToken,secret);
                    res.json({
                        success:true,
                        message:'登录成功，请继续后续操作。',
                        AccessToken:token,
                    })
                }else{
                    res.json({
                        success:false,
                        message:'登录失败，账号或密码错误，请检查后再次登录!',
                        AccessToken:null,
                    })
                }
            })
    }else if(role==='classteacher'){
            adminDao.getPassword(username,function (result) {
                if(bcrypt.compareSync(password,result)){
                    const userToken = {
                        name:username,
                        pwd:password,
                        role:role
                    }
                    //产生一个密钥
                    const secret = 'mickey';
                    //生成token
                    const token = jwt.sign(userToken,secret);
                    res.json({
                        success:true,
                        message:'登录成功，请继续后续操作。',
                        AccessToken:token,
                    })
                }else{
                    res.json({
                        success:false,
                        message:'登录失败，账号或密码错误，请检查后再次登录!',
                        AccessToken:null,
                    })
                }
            })
    }

})
module.exports = router;
