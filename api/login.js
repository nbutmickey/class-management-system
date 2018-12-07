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
let adminDao = require('../dao/adminDao');
let studentDao = require('../dao/studentDao');
let counselorDao = require('../dao/counselorDao');
let classteacherDao = require('../dao/counselorDao');

router.get('/login',function (req,res) {
    let loginInfo=req.params.loginInfo;
    let type = loginInfo.role;
    if(type==='admin'){
        if(adminDao.getAdminPassword(loginInfo.username)===loginInfo.password){
            res.json({
                success:true,
                message:'登录成功，请继续后续操作。'
            })
        }else {
            res.json({
                success:false,
                message:'登录失败，账号或密码错误，请检查后再次登录!'
            })
        }

    }else if(type==='student') {
        let password=studentDao.getStudentPassword(loginInfo.username)
            if(!password){
                if(bcrypt.compareSync(password,loginInfo.password)){
                    const userToken = {
                        name:loginInfo.username,
                        password:loginInfo.password
                    }
                    //产生一个密钥
                    const secret = 'mickey';
                    //生成token
                    const token = jwt.sign(userToken,secret);
                    res.json({
                        success:true,
                        message:'密码正确，您已成功登录。',
                        AccessToken:token
                    })
                }else{
                    res.json({
                        success:false,
                        message:'密码错误，请检查后重试！'
                    })
                }
            }else {
                res.json({
                    success:false,
                    message:'登录名错误，请检查后重试！'
                })
            }
    }else if(type==='classteacher'){
        let password=classteacherDao.getcounselorPassword(loginInfo.username)
        if(!password){
            if(bcrypt.compareSync(password,loginInfo.password)){
                const userToken = {
                    name:loginInfo.username,
                    password:loginInfo.password
                }
                //产生一个密钥
                const secret = 'mickey';
                //生成token
                const token = jwt.sign(userToken,secret);
                res.json({
                    success:true,
                    message:'密码正确，您已成功登录。',
                    accessToken:token
                })
            }else{
                res.json({
                    success:false,
                    message:'密码错误，请检查后重试！'
                })
            }
        }else {
            res.json({
                success:false,
                message:'登录名错误，请检查后重试！'
            })
        }
    }else if(type==='counselor'){
        let password=counselorDao.getcounselorPassword(loginInfo.username)
        if(!password){
            if(bcrypt.compareSync(password,loginInfo.password)){
                const userToken = {
                    name:loginInfo.username,
                    password:loginInfo.password
                }
                //产生一个密钥
                const secret = 'mickey';
                //生成token
                const token = jwt.sign(userToken,secret);
                res.json({
                    success:true,
                    message:'密码正确，您已成功登录。',
                    accessToken:token
                })
            }else{
                res.json({
                    success:false,
                    message:'密码错误，请检查后重试！'
                })
            }
        }else {
            res.json({
                success:false,
                message:'登录名错误，请检查后重试！'
            })
        }
    }

})
module.exports = router;
