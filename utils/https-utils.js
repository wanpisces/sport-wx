const URL = require('../utils/URL.js');
const network = require('../utils/network.js');
const my_configure = require('../utils/my-configure.js');
module.exports = {
  loginByCode: loginByCode, //登录
  getCommentDetail: getCommentDetail, //评论详情
  getCommentList: getCommentList, //评论列表
  putComment: putComment, //评论
  putFavorite: putFavorite, //收藏
  putStar: putStar, //点赞
  putFollow: putFollow, //关注
  decrypt: decrypt, //数据解码
  material: material, //素材库
  materialDetails: materialDetails, //素材库详情
  shareBtn: shareBtn, //分享


  index: index, //首页接口
  myGroup: myGroup, //我加入的队伍(只包括我加入的队伍)
  myFeed: myFeed, //我的队伍动态 (我关注的和我加入的队伍)
  createGroup: createGroup, //创建队伍
  groupIndex: groupIndex, //队伍首页
  createFeed: createFeed, //发布动态
  deleteFeed: deleteFeed, //删除动态
  feedDetails: feedDetails, //动态详情
  feedList: feedList, //动态列表
  groupDetail: groupDetail, // 队伍详情
  exitGroup: exitGroup, //解散队伍 （只有创建者is_admin=1可以执行该操作）
  quitGroup: quitGroup, //退出队伍 （非创建者is_admin=2 && is_leader=2可以执行该操作）
  // assignGroup: assignGroup, //转让队伍 
  outGroup: outGroup, //移出队伍 （只有管理员is_leader=1可以执行该操作）
  groupMemberIndex: groupMemberIndex, //队员首页
  visitor: visitor, //访客列表(当前用户的访客列表)
  groupPic: groupPic, //修改队伍背景图
  checkGroupNameUnique: checkGroupNameUnique, //检测队伍是否重名
  editBackground: editBackground, //修改个人中心背景图

  discover: discover, //发现首页-找
  movement: movement, //发现-运动圈
  newsList: newsList, //发现-资讯
  newsDetails: newsDetails, //发现-资讯详情
  findTeam: findTeam, //找队伍
  followTeam: followTeam, //关注队伍
  cancelFollow: cancelFollow, //取消关注队伍
  joinTeam: joinTeam, //申请加入队伍
  findMovement: findMovement, //找约战
  movementMessage: movementMessage, //约战留言
  assignGroup: assignGroup, //转让队伍


  myFollow: myFollow, //我的关注
  myCollect: myCollect, //我的收藏
  uHack: uHack, //我的消息-入队申请列表
  systemMessage: systemMessage, //我的消息-系统消息列表
  getUserInfo: getUserInfo, //我的个人资料  
  putUserInfo: putUserInfo, //修改个人资料
  myGroup2: myGroup2, //我创建的队伍列表
  myJoinGroup: myJoinGroup, //我加入的队伍列表
  myCommunityFeed: myCommunityFeed, //我的动态列表
  myMovement: myMovement, //我的约战列表
  myOrganization: myOrganization, //我的组织者约战
  feedback: feedback, //意见反馈
  updateTel: updateTel, //更新手机号
  getVersion: getVersion, //版本说明

  editGroup: editGroup, //编辑队伍资料
  groupMember: groupMember, //成员列表
  setManager: setManager, //设为管理员
  eliminateMember: eliminateMember, //淘汰成员
  examine: examine, //审核成员
  allowMember: allowMember, //允许参与
  announcement: announcement, //发布公告
  groupMemberAudit: groupMemberAudit, //成员审核列表
  createGroupQr: createGroupQr, //生成队伍二维码
  cancelManager: cancelManager, // 撤销管理员
  recommendGroup: recommendGroup, //热搜推荐
  activeList: activeList, //活跃榜
  groupJoinedActivity: groupJoinedActivity, //队伍参与活动
  hotActivity: hotActivity, //队伍热门活动
  assignGroupList: assignGroupList, //队伍可转让成员列表

  soccerRank: soccerRank, //排行榜
  publishMovement: publishMovement, //发布约战
  movementDetail: movementDetail, //约战详情
  editMovement: editMovement, //编辑约战
  deleteMovement: deleteMovement, //删除约战
  acceptMovement: acceptMovement, //应战
  cancelMovement: cancelMovement, //取消约战
  addMovementScore: addMovementScore, //添加计分
  editMovementScore: editMovementScore, // 修改计分
  breakMovement: breakMovement, //违约取消
  movementList: movementList, // 约战列表
  refuseMovement: refuseMovement, // 拒绝约战

  //赛事相关接口
  competitionGroup: competitionGroup, //报名参赛队伍详情
  competitionMaterial: competitionMaterial, //更多素材
  competitionMaterialInfo: competitionMaterialInfo, //素材详情
  competitionIndex: competitionIndex, //赛事首页
  competitionEnlist: competitionEnlist, // 赛事报名
  competitionTeamList: competitionTeamList, //赛事报名管理
  competitionDetalis: competitionDetalis, //赛事详情
  competitionSummary: competitionSummary, //赛事总结
  putTeam: putTeam, //修改队伍---获取当前队伍信息
  updateTeam: updateTeam, //修改队伍---修改当前队伍信息
  competitionList: competitionList, //赛事列表
  competitionMatch: competitionMatch, //赛程列表
  getRankings: getRankings, //赛事排行
  leagueTable: leagueTable, //积分榜
  shooterList: shooterList, //射手榜
  assists: assists, //助攻榜 
  bookings: bookings, //红黄牌榜
  promotionRoad: promotionRoad, //淘汰赛-晋级之路
  matchLineup: matchLineup, //赛程阵容
  matchStatistics: matchStatistics, //赛程统计 
  matchOuts: matchOuts, //赛程赛况
  matchData: matchData, //赛事队伍数据对比
  groupNoList: groupNoList, //当前赛事小组赛组号列表
  matchTurnList: matchTurnList, //当前赛事小组赛组号列表
  competitionPersonal: competitionPersonal, //赛事个人报名信息
  competitionPersonalEnlist: competitionPersonalEnlist, //赛事个人报名（信息完整）
  competitionPersonalInfo: competitionPersonalInfo, //赛事个人报名（信息不完整）
  competitonEducation: competitonEducation, //赛事学校
  //赛事联赛
  leagueMatch: leagueMatch, //联赛赛程列表
  getLeagueRankings: getLeagueRankings, // 联赛赛事排行榜
  leagueRanking: leagueRanking, //联赛积分榜
  leagueScorer: leagueScorer, //联赛射手榜
  leagueAssist: leagueAssist, //联赛助攻榜
  leagueCards: leagueCards, //联赛红黄牌



  uploadImgs: uploadImgs, //上传图片
  attr: attr, //获取类目
  areaAll: areaAll, //获取全部区域

  //7.19优化新增接口
  getBanner: getBanner, //获取约战页的banner
  submitUserAudit: submitUserAudit, //实名认证提交审核信息 
  checkUserAudit: checkUserAudit, //用户审核详情
  userAuditCertPic: userAuditCertPic, //实名认证上传证件照

  //常用位置
  getUserLocation: getUserLocation, //常选位置列表
  putUserLocation: putUserLocation, //常选位置管理

  // 组织者约战
  organization: organization, //组织者约战详情
  organizationTeam: organizationTeam, //组织者约战队伍成员
  createOrganization: createOrganization, //创建组织者约战
  deleteOrganization: deleteOrganization, //组织者约战取消
  deleteOrganizationMerber: deleteOrganizationMerber, //移除队员

  editOrganization: editOrganization, //编辑组织者约战
  openOrganization: openOrganization, //组织者开启约战
  joinOrganization: joinOrganization, //加入组织者约战队伍
  cancelOrganization: cancelOrganization, //取消报名
  //  川大羽毛球比赛
  subgroupName: subgroupName, //报名人员列表
  subgroupList: subgroupList, //获取分组列表
  knockoutList: knockoutList, //淘汰赛列表
  matchList: matchList, //小组赛列表
  isBind: isBind, //羽毛球赛用户是否绑定
  getCollegeList: getCollegeList, //获取学院列表
  getGroupPlayerPosition: getGroupPlayerPosition, //•成员审核列表
  getAllGroupMember: getAllGroupMember, //添加计分人员列表
  completeMovement: completeMovement, //完成约战（跳过）
  scrollBar: scrollBar, //约战滚动栏

  /**
   * 通用赛事
   */
  commanMatch: commanMatch, //通用赛事赛程
  commonMatchRank: commonMatchRank, //通用赛事排行
  commonMatchRace: commonMatchRace,  //计时赛排行
  commonLeagueRanking: commonLeagueRanking, //通用赛事联赛积分榜
  commonLeagueMatch: commonLeagueMatch, //通用赛事联赛赛程
}
//常选位置列表
function getUserLocation(params, _success, _fail) {
  getApp().getToken(function (token) {
    var url = URL.userLocation
    params.token = token
    network.requestGetLoading(url, params, "", _success, _fail, true)
  })
}
//常选位置管理、
function putUserLocation(params, _success, _fail) {
  getApp().getToken(function (token) {
    var url = URL.userLocation
    params.token = token
    network.requestPostLoading(url, params, "加载中...", _success, _fail, true)
  })
}
//登录
function loginByCode(params, _success, _fail) {
  var url = URL.loginByCodeURL
  // var params = {
  //   code: code
  // }
  network.requestPostLoading(url, params, "", _success, _fail, true)
}
//评论详情
function getCommentDetail(commentID, params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.commentURL + '/' + commentID
    network.requestGetLoading(url, params, "", _success, _fail, true)
  })
}
//评论列表
function getCommentList(params, _success, _fail, isRestart) {
  getApp().getToken(function (token) {
    var url = URL.commentURL
    params.token = token
    network.requestGetLoading(url, params, "", _success, _fail, isRestart)
  })
}

//评论
function putComment(params, _success, _fail) {
  getApp().getToken(function (token) {
    var url = URL.commentURL
    params.token = token
    network.requestPostLoading(url, params, "加载中...", _success, _fail, true)
  })
}

//收藏
function putFavorite(params, _success, _fail) {
  getApp().getToken(function (token) {
    var url = URL.favoritesURL
    params.token = token
    network.requestPostLoading(url, params, "加载中...", _success, _fail, true)
  })
}
//点赞
function putStar(params, _success, _fail) {
  getApp().getToken(function (token) {
    var url = URL.starURL
    params.token = token
    network.requestPostLoading(url, params, "加载中...", _success, _fail, true)
  })
}
//关注
function putFollow(params, _success, _fail) {
  getApp().getToken(function (token) {
    var url = URL.followURL
    params.token = token
    network.requestPostLoading(url, params, "加载中...", _success, _fail, true)
  })
}

//分享
function shareBtn(params, _success, _fail) {
  getApp().getToken(function (token) {
    var url = URL.share
    params.token = token
    network.requestPostLoading(url, params, "加载中...", _success, _fail, true)
  })
}
//热搜推荐
function recommendGroup(params, _success, _fail) {
  getApp().getToken(function (token) {
    var url = URL.recommendGroupURL
    params.token = token
    network.requestGetLoading(url, params, "加载中...", _success, _fail, true)
  })
}
//队伍参与活动
function groupJoinedActivity(params, _success, _fail) {
  getApp().getToken(function (token) {
    var url = URL.groupJoinedActivityURL
    params.token = token
    network.requestGetLoading(url, params, "加载中...", _success, _fail, true)
  })
}
//队伍热门活动
function hotActivity(params, _success, _fail) {
  getApp().getToken(function (token) {
    var url = URL.hotActivityURL
    params.token = token
    network.requestGetLoading(url, params, "加载中...", _success, _fail, true)
  })
}

//活跃榜
function activeList(params, _success, _fail) {
  getApp().getToken(function (token) {
    var url = URL.activeListURL
    params.token = token
    network.requestGetLoading(url, params, "加载中...", _success, _fail, true)
  })
}
//转让队伍
function assignGroup(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.assignGroupURL
    network.requestPutLoading(url, params, "", _success, _fail, true)
  })
}
//队伍可转让成员列表
function assignGroupList(params, _success, _fail) {
  getApp().getToken(function (token) {
    var url = URL.assignGroupURL
    params.token = token
    network.requestGetLoading(url, params, "加载中...", _success, _fail, true)
  })
}



//数据解码
function decrypt(params, _success, _fail) {
  var url = URL.decryptURL
  network.requestPostLoading(url, params, "加载中...", _success, _fail, true)
}
//素材库
function material(params, _success, _fail) {
  getApp().getToken(function (token) {
    var url = URL.materialURL
    params.token = token
    network.requestGetLoading(url, params, "加载中...", _success, _fail, true)
  })
}
//素材库详情
function materialDetails(id, params, _success, _fail) {
  getApp().getToken(function (token) {
    var url = URL.materialURL + '/' + id
    params.token = token
    network.requestGetLoading(url, params, "加载中...", _success, _fail, true)
  })
}
/**
 * 首页接口
 */
function index(params, _success, _fail) {
  getApp().getToken(function (token) {
    var url = URL.indexURL
    params.token = token
    network.requestGetLoading(url, params, "", _success, _fail, true)
  })
}
/**
 * 我加入的队伍(只包括我加入的队伍)
 */
function myGroup(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.myGroupURL
    network.requestGet(url, params, _success, _fail, true)
  })
}
/**
 * 我的队伍动态 (我关注的和我加入的队伍)
 */
function myFeed(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.feedURL
    network.requestGetLoading(url, params, "加载中...", _success, _fail, true)
  })
}
// 我的组织者约战
function myOrganization(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.myOrganizationURL
    network.requestGetLoading(url, params, "加载中...", _success, _fail, true)
  })
}
/**
 * 创建队伍
 */
function createGroup(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.createGroupURL
    network.requestPostLoading(url, params, "创建中...", _success, _fail, true)
  })
}
/**
 * 队伍首页
 */
function groupIndex(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.groupIndexURL
    network.requestGetLoading(url, params, "", _success, _fail, true)
  })
}
/**
 * 发布动态
 */
function createFeed(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.createFeedURL
    network.requestPostLoading(url, params, "发布中...", _success, _fail, true)
  })
}
/**
 * 删除动态
 */
function deleteFeed(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.feedURL
    network.requestDeleteLoading(url, params, "删除中...", _success, _fail, true)
  })
}
/**
 * 动态详情
 */
function feedDetails(id, params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.feedURL + '/' + id
    network.requestGetLoading(url, params, "", _success, _fail, true)
  })
}
/**
 * 动态列表
 */
function feedList(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.feedURL
    network.requestGetLoading(url, params, "加载中...", _success, _fail, true)
  })
}
/**
 * 队伍详情
 */
function groupDetail(id, params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.groupDetailURL + id
    network.requestGetLoading(url, params, "", _success, _fail, true)
  })
}
/**
 * 解散队伍 （只有创建者is_admin=1可以执行该操作）
 */
function exitGroup(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.exitGroupURL
    network.requestDeleteLoading(url, params, "解散中...", _success, _fail, true)
  })
}
/**
 * 退出队伍 （非创建者is_admin=2 && is_leader=2可以执行该操作）
 */
function quitGroup(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.quitGroupURL
    network.requestDeleteLoading(url, params, "退出中...", _success, _fail, true)
  })
}
/**
 * 移出队伍 （只有管理员is_leader=1可以执行该操作）
 */
function outGroup(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.outGroupURL
    network.requestDeleteLoading(url, params, "移除中...", _success, _fail, true)
  })
}
/**
 * 队员首页
 */
function groupMemberIndex(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.groupMemberIndexURL
    network.requestGetLoading(url, params, "", _success, _fail, true)
  })
}
/**
 * 访客列表(当前用户的访客列表)
 */
function visitor(params, _success, _fail) {
  var url = URL.visitorURL
  network.requestGetLoading(url, params, "加载中...", _success, _fail, true)
}
/**
 * 修改队伍背景图
 */
function groupPic(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.groupPicURL
    network.requestPutLoading(url, params, "修改中...", _success, _fail, true)
  })
}

//修改个人中心背景图
function editBackground(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.editBackgroundURL
    network.requestPutLoading(url, params, "修改中...", _success, _fail, true)
  })
}
/**
 * 检测队伍是否重名
 */
function checkGroupNameUnique(params, _success, _fail) {
  var url = URL.checkGroupNameUniqueURL
  network.requestPostLoading(url, params, "检测中...", _success, _fail, true)
}
/**
 * 发现首页-找
 */
function discover(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.discoverURL
    network.requestGetLoading(url, params, "", _success, _fail, true)
  })
}
/**
 * 发现-运动圈
 */
function movement(params, _success, _fail, msg) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.movementCommunityURL
    network.requestGetLoading(url, params, msg || "", _success, _fail, true)
  })
}
/**
 * 发现-资讯
 */
function newsList(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token;
    var url = URL.newsURL;
    network.requestGetLoading(url, params, "", _success, _fail, true)
  })
}
/**
 * 发现-资讯详情
 */
function newsDetails(id, params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.newsURL + '/' + id
    network.requestGetLoading(url, params, "", _success, _fail, true)
  })
}
/**
 * 找队伍
 */
function findTeam(params, _success, _fail, msg) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.findTeamURL
    network.requestGetLoading(url, params, msg || "", _success, _fail, true)
  })
}
/**
 * 关注队伍
 */
function followTeam(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.followTeamURL
    network.requestPost(url, params, _success, _fail, false)
  })
}
/**
 * 取消关注队伍
 */

function cancelFollow(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.cancelFollowTeamURL
    network.requestDeleteLoading(url, params, "加载中...", _success, _fail, true)
  })
}
/**
 * 申请加入队伍
 */
function joinTeam(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.joinTeamURL
    network.requestPostLoading(url, params, "加载中...", _success, _fail, true)
  })
}

function findMovement(params, _success, _fail, msg) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.findMovementURL
    network.requestGetLoading(url, params, msg || "", _success, _fail, true)
  })
}




/**
 * 我的关注
 */
function myFollow(params, _success, _fail, msg) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.myFollowURL
    network.requestGetLoading(url, params, msg || "", _success, _fail, true)
  })
}
/**
 * 我的收藏
 */
function myCollect(params, _success, _fail, msg) {

  getApp().getToken(function (token) {
    params.token = token
    var url = URL.myCollectURL
    network.requestGetLoading(url, params, msg || "", _success, _fail, false)
  })
}
/**
 * 我的消息-入队申请列表
 */
function uHack(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.uHackURL
    network.requestGetLoading(url, params, "加载中...", _success, _fail, true)
  })
}
/**
 * 我的消息-系统消息列表
 */
function systemMessage(params, _success, _fail, msg) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.systemMessageURL
    network.requestGetLoading(url, params, msg || "", _success, _fail, true)
  })
}
/**
 * 我的个人资料
 */
function getUserInfo(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.userInfoURL
    network.requestGetLoading(url, params, "", _success, _fail, false)
  })
}
/**
 * 修改个人资料
 */
function putUserInfo(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.userInfoURL
    network.requestPutLoading(url, params, "", _success, _fail, false)
  })
}
/**
 * 我创建的队伍列表
 */
function myGroup2(params, _success, _fail, msg) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.myGroupURL2
    network.requestGetLoading(url, params, msg || "", _success, _fail, true)
  })
}
/**
 * 我加入的队伍列表
 */
function myJoinGroup(params, _success, _fail, msg) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.myJoinGroupURL
    network.requestGetLoading(url, params, msg || "", _success, _fail, true)
  })
}
/**
 * 我的动态列表
 */
function myCommunityFeed(params, _success, _fail, msg) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.myCommunityFeedURL
    network.requestGetLoading(url, params, msg || "", _success, _fail, true)
  })
}
/**
 * 我的约战列表
 */
function myMovement(params, _success, _fail, msg) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.myMovementURL
    network.requestGetLoading(url, params, msg || "", _success, _fail, true)
  })
}
/**
 * 拒绝约战
 */
function refuseMovement(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.refuseMovementURL
    network.requestPutLoading(url, params, "加载中...", _success, _fail, true)
  })
}
/**
 * 意见反馈
 */
function feedback(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.feedbackURL
    network.requestPostLoading(url, params, "反馈中...", _success, _fail, true)
  })
}
/**
 * 更新手机号
 */
function updateTel(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.updateTelURL
    network.requestPutLoading(url, params, "更新中...", _success, _fail, true)
  })
}
/**
 * 版本列表
 */
function getVersion(params, _success, _fail) {
  var url = URL.versionURL
  network.requestGetLoading(url, params, "加载中...", _success, _fail, true)
}
/**
 * 编辑队伍资料
 */
function editGroup(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.editGroupURL
    network.requestPutLoading(url, params, "更新中...", _success, _fail, true)
  })
}
/**
 * 成员列表
 */
function groupMember(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.groupMemberURL
    network.requestGetLoading(url, params, "", _success, _fail, true)
  })
}
/**
 * 设为管理员
 */
function setManager(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.setManagerURL
    network.requestPutLoading(url, params, "更新中...", _success, _fail, true)
  })
}
/**
 * 撤销管理员
 */
function cancelManager(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.cancelManagerURL
    network.requestDeleteLoading(url, params, "更新中...", _success, _fail, true)
  })
}
/**
 * 淘汰成员
 */
function eliminateMember(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.eliminateMemberURL
    network.requestDeleteLoading(url, params, "删除中...", _success, _fail, true)
  })
}
/**
 * 审核成员
 */
function examine(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.examineURL
    network.requestPutLoading(url, params, "更新中...", _success, _fail, true)
  })
}
/**
 * 允许参与
 */
function allowMember(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.allowMemberURL
    network.requestPutLoading(url, params, "更新中...", _success, _fail, true)
  })
}
/**
 * 发布公告
 */
function announcement(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.announcementURL
    network.requestPostLoading(url, params, "发布中...", _success, _fail, true)
  })
}


/**
 * 成员审核列表
 */
function groupMemberAudit(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.groupMemberAuditURL
    network.requestGetLoading(url, params, "", _success, _fail, true)
  })
}
/**
 * 生成队伍二维码
 */
function createGroupQr(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.createGroupQrURL
    network.requestPostLoading(url, params, "生成中...", _success, _fail, true)
  })
}
/**
 * 排行榜
 */
function soccerRank(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.soccerRankURL
    network.requestGetLoading(url, params, "加载中...", _success, _fail, true)
  })
}
/**
 * 发布约战
 */
function publishMovement(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.movementURL
    network.requestPostLoading(url, params, "发布中...", _success, _fail, true)
  })
}
/**
 * 约战详情
 */
function movementDetail(id, params, _success, _fail, msg) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.movementURL + '/' + id
    network.requestGetLoading(url, params, msg, _success, _fail, true)
  })
}
/**
 * 编辑约战
 */
function editMovement(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.movementURL
    network.requestPutLoading(url, params, "请求中...", _success, _fail, true)
  })
}
/**
 * 删除约战
 */
function deleteMovement(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.movementURL;
    network.requestDeleteLoading(url, params, "请求中...", _success, _fail, true)
  })
}
/**
 * 应战
 */
function acceptMovement(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.acceptMovementURL
    network.requestPutLoading(url, params, "加载中...", _success, _fail, true)
  })
}
/**
 * 取消约战
 */
function cancelMovement(params, _success, _fail) {
  console.log('params', params)
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.cancelMovementURL;
    network.requestPutLoading(url, params, "请稍后...", _success, _fail, true)
  })
}
/**
 * 约战留言
 */
function movementMessage(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.movementMessageURL;
    network.requestPostLoading(url, params, "加载中...", _success, _fail, true)
  })
}

/**
 * 添加计分
 */
function addMovementScore(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.addMovementScoreURL;
    network.requestPostLoading(url, params, "请稍后...", _success, _fail, true)
  })
}

/**
 * 修改计分
 */
function editMovementScore(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.editMovementScoreURL
    network.requestPutLoading(url, params, "更新中...", _success, _fail, true)
  })
}
// 
/**
 * 违约取消
 */
function breakMovement(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.breakMovementURL;
    network.requestPutLoading(url, params, "请稍后...", _success, _fail, true)
  })
}
/**
 * 约战列表
 */
function movementList(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.movementListURL;
    network.requestGetLoading(url, params, "加载中...", _success, _fail, true)
  })
}



//上传图片
function uploadImgs(imgs, success) {
  var url = URL.uploadsURL
  network.uploadFiles(url, '图片上传中...', imgs, function (res) {
    success(res)
  })
}
/**
 * attr_group_id 1=足球赛制 2=球衣颜色 3=足球角色 4=足球违约原因-主场 5=足球违约原因-客场 6=队伍类型 7=资讯类型
 * pid 类目项父级 默认0 （多级）
 * 获取类目
 */
function attr(attr_group_id, _success, _fail, msg) {
  var url = URL.attrURL + '/' + attr_group_id
  network.requestGetLoading(url, {}, msg || "", _success, _fail, true)
}
/**
 * 获取全部区域
 */
function areaAll(_success, _fail, msg) {
  var url = URL.areaAllURL
  network.requestGetLoading(url, {}, msg || "", _success, _fail, true)
}

// 7.19新增优化接口

/**
 * 约战列表
 */
function getBanner(_success, _fail) {
  getApp().getToken(function (token) {
    var params = {
      "token": token
    }
    var url = URL.bannerURL;
    network.requestGetLoading(url, params, "加载中...", _success, _fail, true)
  })
}
//实名认证提交审核信息
function submitUserAudit(params, _success, _fail) {
  getApp().getToken(function (token) {
    var url = URL.submitUserAuditURL
    params.token = token
    network.requestPost(url, params, _success, _fail, true)
  })
}
//用户审核详情
function checkUserAudit(_success, _fail) {
  getApp().getToken(function (token) {
    var url = URL.checkUserAuditURL
    var params = {
      "token": token
    }
    network.requestGet(url, params, _success, _fail, true)
  })
}
//实名认证提交证件照
function userAuditCertPic(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.userAuditCertPicURL
    network.requestPutLoading(url, params, "上传中...", _success, _fail, true)
  })
}

// //素材库
// function material(params, _success, _fail) {
//   getApp().getToken(function (token) {
//     var url = URL.materialURL
//     params.token = token
//     network.requestGetLoading(url, params, "加载中...", _success, _fail, true)
//   })
// }
//赛事列表
function competitionList(params, _success, _fail) {
  getApp().getToken(function (token) {
    var url = URL.competitionURL
    params.token = token
    network.requestGetLoading(url, params, "加载中...", _success, _fail, true)
  })
}
//赛事详情
function competitionDetalis(id, params, _success, _fail) {
  getApp().getToken(function (token) {
    var url = URL.competitionURL + '/' + id
    params.token = token
    network.requestGetLoading(url, params, "加载中...", _success, _fail, true)
  })
}
//赛事报名
function competitionEnlist(params, _success, _fail) {
  getApp().getToken(function (token) {
    var url = URL.competitionEnlistURL
    params.token = token
    network.requestPostLoading(url, params, "加载中...", _success, _fail, true)
  })
}
// 赛事个人报名信息
function competitionPersonal(params, _success, _fail) {
  getApp().getToken(function (token) {
    var url = URL.competitionPersonalURL
    params.token = token
    network.requestGetLoading(url, params, "加载中...", _success, _fail, true)
  })
}
// 赛事个人报名信息(信息不完整)
function competitionPersonalInfo(params, _success, _fail) {
  getApp().getToken(function (token) {
    var url = URL.competitionPersonalURL
    params.token = token
    network.requestPostLoading(url, params, "加载中...", _success, _fail, true)
  })
}

//赛事个人报名（信息完整）
function competitionPersonalEnlist(params, _success, _fail) {
  getApp().getToken(function (token) {
    var url = URL.competitionPersonalEnlistURL
    params.token = token
    network.requestPostLoading(url, params, "加载中...", _success, _fail, true)
  })
}

//赛事学校
function competitonEducation(params, _success, _fail) {
  getApp().getToken(function (token) {
    var url = URL.competitonEducationURL
    params.token = token
    network.requestGetLoading(url, params, "加载中...", _success, _fail, true)
  })
}

//报名管理
function competitionTeamList(params, _success, _fail) {
  getApp().getToken(function (token) {
    var url = URL.competitionTeamListURL
    params.token = token
    network.requestGetLoading(url, params, "加载中...", _success, _fail, true)
  })
}
//赛事首页
function competitionIndex(id, params, _success, _fail) {
  getApp().getToken(function (token) {
    var url = URL.competitionIndexURL + '/' + id
    params.token = token
    network.requestGetLoading(url, params, "加载中...", _success, _fail, true)
  })
}
//更多素材
function competitionMaterial(id, params, _success, _fail) {
  getApp().getToken(function (token) {
    var url = URL.competitionMaterialURL + '/' + id
    params.token = token
    network.requestGetLoading(url, params, "加载中...", _success, _fail, true)
  })
}
//素材详情
function competitionMaterialInfo(id, params, _success, _fail) {
  getApp().getToken(function (token) {
    var url = URL.competitionMaterialInfoURL + '/' + id
    params.token = token
    network.requestGetLoading(url, params, "加载中...", _success, _fail, true)
  })
}
//报名参赛队伍详情
function competitionGroup(id, params, _success, _fail) {
  getApp().getToken(function (token) {
    var url = URL.competitionGroupURL + '/' + id
    params.token = token
    network.requestGetLoading(url, params, "加载中...", _success, _fail, true)
  })
}

//赛事总结
function competitionSummary(id, params, _success, _fail) {
  getApp().getToken(function (token) {
    var url = URL.competitionSummaryURL + '/' + id
    params.token = token
    network.requestGetLoading(url, params, "加载中...", _success, _fail, true)
  })
}
//修改队伍---获取当前队伍信息
function putTeam(params, _success, _fail) {
  getApp().getToken(function (token) {
    var url = URL.putTeamURL
    params.token = token
    network.requestGetLoading(url, params, "加载中...", _success, _fail, true)
  })
}
//修改队伍---修改当前队伍信息
function updateTeam(params, _success, _fail) {
  getApp().getToken(function (token) {
    var url = URL.updateTeamURL
    params.token = token
    network.requestPostLoading(url, params, "加载中...", _success, _fail, true)
  })
}

//赛程列表
function competitionMatch(params, _success, _fail) {
  var url = URL.competitionMatchURL
  network.requestGetLoading(url, params, "加载中...", _success, _fail, true)
}
//赛事排行榜
function getRankings(tag, params, _success, _fail) {
  if (tag == 0) { //积分榜
    leagueTable(params, _success, _fail)
  } else if (tag == 1) { //射手榜
    shooterList(params, _success, _fail)
  } else if (tag == 2) { //助攻榜
    assists(params, _success, _fail)
  } else if (tag == 3) { //红黄牌榜
    bookings(params, _success, _fail)
  }
}
//联赛赛事排行榜
function getLeagueRankings(tag, params, _success, _fail) {
  if (tag == 0) { //积分榜
    leagueRanking(params, _success, _fail)
  } else if (tag == 1) { //射手榜
    leagueScorer(params, _success, _fail)
  } else if (tag == 2) { //助攻榜
    leagueAssist(params, _success, _fail)
  } else if (tag == 3) { //红黄牌榜
    leagueCards(params, _success, _fail)
  }
}
//积分榜
function leagueTable(params, _success, _fail) {
  var url = URL.leagueTableURL
  network.requestGetLoading(url, params, "加载中...", _success, _fail, true)
}
//射手榜
function shooterList(params, _success, _fail) {
  var url = URL.shooterListURL
  network.requestGetLoading(url, params, "加载中...", _success, _fail, true)
}
//助攻榜
function assists(params, _success, _fail) {
  var url = URL.assistsURL
  network.requestGetLoading(url, params, "加载中...", _success, _fail, true)
}
//红黄牌榜
function bookings(params, _success, _fail) {
  var url = URL.bookingsURL
  network.requestGetLoading(url, params, "加载中...", _success, _fail, true)
}
//淘汰赛-晋级之路
function promotionRoad(params, _success, _fail) {
  var url = URL.promotionRoadURL
  network.requestGetLoading(url, params, "加载中...", _success, _fail, true)
}
//赛程阵容
function matchLineup(params, _success, _fail) {
  var url = URL.matchLineupURL
  network.requestGetLoading(url, params, "加载中...", _success, _fail, true)
}
//赛程统计
function matchStatistics(params, _success, _fail) {
  var url = URL.matchStatisticsURL
  network.requestGetLoading(url, params, "加载中...", _success, _fail, true)
}
//赛程赛况
function matchOuts(params, _success, _fail) {
  var url = URL.matchOutsURL
  network.requestGetLoading(url, params, "加载中...", _success, _fail, true)
}
//赛事队伍数据对比
function matchData(params, _success, _fail) {
  var url = URL.matchDataURL
  network.requestGetLoading(url, params, "加载中...", _success, _fail, true)
}
//当前赛事小组赛组号列表
function groupNoList(params, _success, _fail) {
  var url = URL.groupNoListURL
  network.requestGetLoading(url, params, "加载中...", _success, _fail, true)
}
//当前赛事小组赛组号列表
function matchTurnList(params, _success, _fail) {
  var url = URL.matchTurnListURL
  network.requestGetLoading(url, params, "加载中...", _success, _fail, true)
}
//联赛赛程列表
function leagueMatch(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.leagueMatchURL
    network.requestGetLoading(url, params, "加载中...", _success, _fail, true)
  })
}

//联赛积分榜
function leagueRanking(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.leagueRankingURL
    network.requestGetLoading(url, params, "加载中...", _success, _fail, true)
  })
}
//联赛射手榜
function leagueScorer(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.leagueScorerURL
    network.requestGetLoading(url, params, "加载中...", _success, _fail, true)
  })

}
//联赛助攻榜
function leagueAssist(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.leagueAssistURL
    network.requestGetLoading(url, params, "加载中...", _success, _fail, true)
  })
}
//联赛红黄牌
function leagueCards(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.leagueCardsURL
    network.requestGetLoading(url, params, "加载中...", _success, _fail, true)
  })
}



//组织者约战详情
function organization(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.organizationURL
    network.requestGetLoading(url, params, "加载中...", _success, _fail, true)
  })
}

//组织者约战队伍成员
function organizationTeam(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.organizationTeamURL
    network.requestGetLoading(url, params, "加载中...", _success, _fail, true)
  })
}
//组织者约战取消
function deleteOrganization(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.organizationURL
    network.requestDeleteLoading(url, params, "取消中...", _success, _fail, true)
  })
}
//移除队员
function deleteOrganizationMerber(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.organizationTeamURL
    network.requestDeleteLoading(url, params, "删除中...", _success, _fail, true)
  })
}
//创建组织者约战
function createOrganization(params, _success, _fail) {
  var url = URL.organizationURL
  network.requestPostLoading(url, params, "提交中...", _success, _fail, true)
}
//创建组织者约战
function editOrganization(params, _success, _fail) {
  var url = URL.organizationURL
  network.requestPutLoading(url, params, "提交中...", _success, _fail, true)
}


//组织者开启约战
function openOrganization(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.organizationStartURL
    network.requestPostLoading(url, params, "提交中...", _success, _fail, true)
  })
}

//加入组织者约战队伍
function joinOrganization(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.organizationTeamURL;
    console.log(params, url)
    network.requestPostLoading(url, params, "加入中...", _success, _fail, true)
  })
}
//取消报名
function cancelOrganization(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.organizationTeamURL
    network.requestPutLoading(url, params, "取消中...", _success, _fail, true)
  })
}

//报名人员列表
function subgroupName(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.subgroupNameURL
    network.requestGetLoading(url, params, "加载中...", _success, _fail, true)
  })
}

//获取分组列表
function subgroupList(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.subgroupListURL
    network.requestGetLoading(url, params, "加载中...", _success, _fail, true)
  })
}
//淘汰赛列表
function knockoutList(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.knockoutListURL
    network.requestGetLoading(url, params, "加载中...", _success, _fail, true)
  })
}
//小组赛列表
function matchList(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.matchListURL;
    network.requestGet(url, params, _success, _fail, true)
  })
}

//羽毛球赛用户是否绑定
function isBind(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.isBindURL;
    network.requestGet(url, params, _success, _fail, true)
  })
}

//获取学院列表
function getCollegeList(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.getCollegeListURL;
    network.requestGet(url, params, _success, _fail, true)
  })
}

// 2018/11/26---------优化
function getGroupPlayerPosition(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.groupPlayerPosition;
    network.requestPost(url, params, _success, _fail, true)
  })
}
//添加计分人员列表
function getAllGroupMember(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.getAllGroupMemberURL;
    network.requestGet(url, params, _success, _fail, true)
  })
}
//完成约战（跳过）
function completeMovement(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.completeMovementURL;
    network.requestPost(url, params, _success, _fail, true)
  })
}

//约战滚动栏
function scrollBar(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.scrollBarURL;
    network.requestGet(url, params, _success, _fail, true)
  })
}

//通用赛事赛程列表
function commanMatch(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.commanMatchURL
    network.requestGetLoading(url, params, "加载中...", _success, _fail, true)
  })
}
//通用赛事排行
function commonMatchRank(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.commonMatchRankURL
    network.requestGetLoading(url, params, "加载中...", _success, _fail, true)
  })
}
//计时赛排行
function commonMatchRace(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.commonMatchRaceURL
    network.requestGetLoading(url, params, "加载中...", _success, _fail, true)
  })
}
//通用赛事联赛积分榜
function commonLeagueRanking(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.commonLeagueRankingURL
    network.requestGetLoading(url, params, "加载中...", _success, _fail, true)
  })
}
//通用赛事联赛赛程
function commonLeagueMatch(params, _success, _fail) {
  getApp().getToken(function (token) {
    params.token = token
    var url = URL.commonLeagueMatchURL
    network.requestGetLoading(url, params, "加载中...", _success, _fail, true)
  })
}
