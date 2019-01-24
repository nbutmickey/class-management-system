export function jsonBack(res,status,content,note) {
    res.json({
        status:status,
        content:content,
        note:note
    })
}