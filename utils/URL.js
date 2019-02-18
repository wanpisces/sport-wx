var configure = require('../utils/my-configure.js'); //请求地址
module.exports = {

  loginByCodeURL: configure.BASE_URL + configure.ADDRESS + '/loginByCode', //登录
  commentURL: configure.BASE_URL + configure.ADDRESS + '/comment', //评论接口,评论详情,评论列表
  starURL: configure.BASE_URL + configure.ADDRESS + '/star', //点赞接口
  followURL: configure.BASE_URL + configure.ADDRESS + '/atten', //关注接口
  favoritesURL: configure.BASE_URL + configure.ADDRESS + '/favorites', //收藏接口
  decryptURL: configure.BASE_URL + configure.ADDRESS + '/decrypt', //数据解码
  materialURL: configure.BASE_URL + configure.ADDRESS + '/material', //素材库
  share: configure.BASE_URL + configure.ADDRESS + '/share', // 分享

  indexURL: configure.BASE_URL + configure.ADDRESS + '/index', //首页接口
  myGroupURL: configure.BASE_URL + configure.ADDRESS + '/myGroup', //我加入的队伍(只包括我加入的队伍)
  feedURL: configure.BASE_URL + configure.ADDRESS + '/feed', //我的队伍动态 (我关注的和我加入的队伍)
  createGroupURL: configure.BASE_URL + configure.ADDRESS + '/createGroup', //创建队伍
  groupIndexURL: configure.BASE_URL + configure.ADDRESS + '/groupIndex', //队伍首页
  createFeedURL: configure.BASE_URL + configure.ADDRESS + '/createFeed', //发布动态
  groupDetailURL: configure.BASE_URL + configure.ADDRESS + '/group/', // 队伍详情
  exitGroupURL: configure.BASE_URL + configure.ADDRESS + '/exitGroup', //解散队伍 （只有创建者is_admin=1可以执行该操作）
  quitGroupURL: configure.BASE_URL + configure.ADDRESS + '/quitGroup', //退出队伍 （非创建者is_admin=2 && is_leader=2可以执行该操作）
  // assignGroupURL: configure.BASE_URL + configure.ADDRESS + '/assignGroup', //转让队伍 
  outGroupURL: configure.BASE_URL + configure.ADDRESS + '/outGroup', //移出队伍 （只有管理员is_leader=1可以执行该操作）
  groupMemberIndexURL: configure.BASE_URL + configure.ADDRESS + '/groupMemberIndex', //队员首页
  visitorURL: configure.BASE_URL + configure.ADDRESS + '/visitor', //访客列表(当前用户的访客列表)
  groupPicURL: configure.BASE_URL + configure.ADDRESS + '/groupPic', //修改队伍背景图
  checkGroupNameUniqueURL: configure.BASE_URL + configure.ADDRESS + '/checkGroupNameUnique', //检测队伍是否重名
  editBackgroundURL: configure.BASE_URL + configure.ADDRESS + '/editBackground', //修改个人中心背景图


  discoverURL: configure.BASE_URL + configure.ADDRESS + '/discover', //发现首页-找
  movementCommunityURL: configure.BASE_URL + configure.ADDRESS + '/movementCommunity', //发现-运动圈
  newsURL: configure.BASE_URL + configure.ADDRESS + '/news', //发现-资讯
  findTeamURL: configure.BASE_URL + configure.ADDRESS + '/findTeam', //找队伍
  followTeamURL: configure.BASE_URL + configure.ADDRESS + '/followTeam', //关注队伍
  cancelFollowTeamURL: configure.BASE_URL + configure.ADDRESS + '/cancelFollow', //取消关注队伍
  joinTeamURL: configure.BASE_URL + configure.ADDRESS + '/joinTeam', //申请加入队伍
  findMovementURL: configure.BASE_URL + configure.ADDRESS + '/findMovement', //找约战
  refuseMovementURL: configure.BASE_URL + configure.ADDRESS + '/refuseMovement', //拒绝约战
  movementMessageURL: configure.BASE_URL + configure.ADDRESS + '/movementMessage', //约战留言
  recommendGroupURL: configure.BASE_URL + configure.ADDRESS + '/recommendGroup', //热搜推荐
  activeListURL: configure.BASE_URL + configure.ADDRESS + '/activeList', //活跃榜
  groupJoinedActivityURL: configure.BASE_URL + configure.ADDRESS + '/groupJoinedActivity', //队伍参与活动
  hotActivityURL: configure.BASE_URL + configure.ADDRESS + '/hotActivity', //队伍热门活动
  assignGroupURL: configure.BASE_URL + configure.ADDRESS + '/assignGroup', //队伍转让



  myFollowURL: configure.BASE_URL + configure.ADDRESS + '/myFollow', //我的关注
  myCollectURL: configure.BASE_URL + configure.ADDRESS + '/myCollect', //我的收藏
  uHackURL: configure.BASE_URL + configure.ADDRESS + '/uHack', //我的消息-入队申请列表
  systemMessageURL: configure.BASE_URL + configure.ADDRESS + '/systemMessage', //我的消息-系统消息列表
  userInfoURL: configure.BASE_URL + configure.ADDRESS + '/userInfo', //我的个人资料  修改个人资料
  myGroupURL2: configure.BASE_URL + configure.ADDRESS + '/myCreateGroup', //我创建的队伍列表
  myJoinGroupURL: configure.BASE_URL + configure.ADDRESS + '/myJoinGroup', //我加入的队伍列表
  myCommunityFeedURL: configure.BASE_URL + configure.ADDRESS + '/myCommunityFeed', //我的动态列表
  myMovementURL: configure.BASE_URL + configure.ADDRESS + '/myMovement', //我的约战列表
  myOrganizationURL: configure.BASE_URL + configure.ADDRESS + '/myOrganization',//我的组织者约战
  feedbackURL: configure.BASE_URL + configure.ADDRESS + '/feedback', //意见反馈
  updateTelURL: configure.BASE_URL + configure.ADDRESS + '/updateTel', //更新手机号
  versionURL: configure.BASE_URL + 'public/version', //版本列表

  editGroupURL: configure.BASE_URL + configure.ADDRESS + '/editGroup', //编辑队伍资料
  groupMemberURL: configure.BASE_URL + configure.ADDRESS + '/groupMember', //成员列表
  setManagerURL: configure.BASE_URL + configure.ADDRESS + '/setManager', //设为管理员
  eliminateMemberURL: configure.BASE_URL + configure.ADDRESS + '/eliminateMember', //淘汰成员
  examineURL: configure.BASE_URL + configure.ADDRESS + '/examine', //审核成员
  allowMemberURL: configure.BASE_URL + configure.ADDRESS + '/allowMember', //允许参与
  announcementURL: configure.BASE_URL + configure.ADDRESS + '/announcement', //发布公告
  groupMemberAuditURL: configure.BASE_URL + configure.ADDRESS + '/groupMemberAudit', // 审核
  cancelManagerURL: configure.BASE_URL + configure.ADDRESS + '/cancelManager', // 取消成员管理员
  createGroupQrURL: configure.BASE_URL + configure.ADDRESS + '/createGroupQr', //生成队伍二维码

  soccerRankURL: configure.BASE_URL + configure.ADDRESS + '/soccerRank', //排行榜
  movementURL: configure.BASE_URL + configure.ADDRESS + '/movement', //发布约战
  acceptMovementURL: configure.BASE_URL + configure.ADDRESS + '/acceptMovement', //应战
  cancelMovementURL: configure.BASE_URL + configure.ADDRESS + '/cancelMovement', //取消约战
  addMovementScoreURL: configure.BASE_URL + configure.ADDRESS + '/addMovementScore', //添加计分
  editMovementScoreURL: configure.BASE_URL + configure.ADDRESS + '/editMovementScore', //修改计分
  breakMovementURL: configure.BASE_URL + configure.ADDRESS + '/breakMovement', //违约取消
  movementListURL: configure.BASE_URL + configure.ADDRESS + '/movement', //违约取消


  uploadsURL: configure.BASE_File_URL + 'public/uploads', //上传文件
  attrURL: configure.BASE_URL + 'public/attr', //获取类目
  areaAllURL: configure.BASE_URL + 'public/areaAll', //获取全部区域
  // 7.19优化新增接口
  bannerURL: configure.BASE_URL + configure.ADDRESS + '/banner', //首页接口
  submitUserAuditURL: configure.BASE_URL + configure.ADDRESS + '/userAudit', //实名认证提交审核信息 
  checkUserAuditURL: configure.BASE_URL + configure.ADDRESS + '/userAudit', //用户审核详情 
  userAuditCertPicURL: configure.BASE_URL + configure.ADDRESS + '/userAuditCertPic', //用户审核提交证件照

  //赛事接口
  competitionURL: configure.BASE_URL + configure.ADDRESS + '/competition', //赛事列表、详情
  competitionEnlistURL: configure.BASE_URL + configure.ADDRESS + '/competitionEnlist', //赛事报名
  competitionIndexURL: configure.BASE_URL + configure.ADDRESS + '/competitionIndex', //赛事首页
  competitionSummaryURL: configure.BASE_URL + configure.ADDRESS + '/competitionSummary', //赛事总结
  competitionMaterialURL: configure.BASE_URL + configure.ADDRESS + '/competitionMaterial', //更多素材 
  competitionMaterialInfoURL: configure.BASE_URL + configure.ADDRESS + '/competitionMaterialInfo', //素材详情
  competitionGroupURL: configure.BASE_URL + configure.ADDRESS + '/competitionGroup', //参赛队伍详情
  updateTeamURL: configure.BASE_URL + configure.ADDRESS + '/updateTeam', //修改队伍---修改当前队伍信息
  putTeamURL: configure.BASE_URL + configure.ADDRESS + '/putTeam', //修改队伍---获取当前队伍信息
  competitionTeamListURL: configure.BASE_URL + configure.ADDRESS + '/competitionTeamList', //赛事报名管理（banber跳转）
  competitionPersonalURL: configure.BASE_URL + configure.ADDRESS + '/competitionPersonal', //赛事个人报名信息
  competitionPersonalEnlistURL: configure.BASE_URL + configure.ADDRESS + '/competitionPersonalEnlist',//赛事个人报名（信息完整的情况）
  competitonEducationURL: configure.BASE_URL + configure.ADDRESS + '/competitonEducation',// 赛事学校

  competitionMatchURL: configure.BASE_URL + configure.ADDRESS + '/competitionMatch', //赛程列表
  leagueTableURL: configure.BASE_URL + configure.ADDRESS + '/leagueTable', //积分榜
  shooterListURL: configure.BASE_URL + configure.ADDRESS + '/shooterList', //射手榜
  assistsURL: configure.BASE_URL + configure.ADDRESS + '/assists', //助攻榜 
  bookingsURL: configure.BASE_URL + configure.ADDRESS + '/bookings', //红黄牌榜
  promotionRoadURL: configure.BASE_URL + configure.ADDRESS + '/promotionRoad', //淘汰赛-晋级之路
  matchLineupURL: configure.BASE_URL + configure.ADDRESS + '/matchLineup', //赛程阵容
  matchStatisticsURL: configure.BASE_URL + configure.ADDRESS + '/matchStatistics', //赛程统计 
  matchOutsURL: configure.BASE_URL + configure.ADDRESS + '/matchOuts', //赛程赛况
  matchDataURL: configure.BASE_URL + configure.ADDRESS + '/matchData', //赛事队伍数据对比
  groupNoListURL: configure.BASE_URL + configure.ADDRESS + '/groupNoList', //当前赛事小组赛组号列表
  matchTurnListURL: configure.BASE_URL + configure.ADDRESS + '/matchTurnList', //当前赛事小组赛组号列表
  // 赛事联赛
  leagueMatchURL: configure.BASE_URL + configure.ADDRESS + '/leagueMatch', //联赛赛程列表
  leagueRankingURL: configure.BASE_URL + configure.ADDRESS + '/leagueRanking',//联赛积分榜
  leagueScorerURL: configure.BASE_URL + configure.ADDRESS + '/leagueScorer',//联赛射手榜
  leagueAssistURL: configure.BASE_URL + configure.ADDRESS + '/leagueAssist',//联赛助攻榜
  leagueCardsURL: configure.BASE_URL + configure.ADDRESS + '/leagueCards',//联赛红黄牌



  userLocation: configure.BASE_URL + configure.ADDRESS + '/userLocation', //常选位置管理、常选位置列表


  // 组织者约战
  organizationURL: configure.BASE_URL + configure.ADDRESS + '/organization', //组织者约战详情
  organizationTeamURL: configure.BASE_URL + configure.ADDRESS + '/organizationTeam',  //组织者约战队伍成员
  organizationStartURL: configure.BASE_URL + configure.ADDRESS + '/organizationStart',  //组织者开启约战

  // 川大羽毛球比赛
  subgroupNameURL: configure.BASE_URL + configure.ADDRESS + '/subgroupName',  //报名人员列表
  subgroupListURL: configure.BASE_URL + configure.ADDRESS + '/subgroupList',  //获取分组列表
  knockoutListURL: configure.BASE_URL + configure.ADDRESS + '/knockoutList',//淘汰赛列表
  matchListURL: configure.BASE_URL + configure.ADDRESS + '/matchList',//小组赛列表
  isBindURL: configure.BASE_URL + configure.ADDRESS + '/isBind',//羽毛球赛用户是否绑定
  getCollegeListURL: configure.BASE_URL + configure.ADDRESS + '/getCollegeList',//获取学院列表
  //2018/11/26优化
  groupPlayerPosition: configure.BASE_URL + configure.ADDRESS + '/groupPlayerPosition',//修改成员
  getAllGroupMemberURL: configure.BASE_URL + configure.ADDRESS + '/getAllGroupMember',//添加计分人员列表
  completeMovementURL: configure.BASE_URL + configure.ADDRESS + '/completeMovement',//完成约战(跳过)
  scrollBarURL: configure.BASE_URL + configure.ADDRESS + '/scrollBar',//约战滚动栏(跳过)

  /**
   * 通用赛事
   */
  commanMatchURL: configure.BASE_URL + configure.ADDRESS + '/commonMatch',//通用赛事赛程
  commonMatchRankURL: configure.BASE_URL + configure.ADDRESS + '/commonMatchRank',//通用赛事排行
  commonMatchRaceURL: configure.BASE_URL + configure.ADDRESS + '/commonMatchRace',//计时赛排行
  commonLeagueMatchURL: configure.BASE_URL + configure.ADDRESS + '/commonLeagueMatch',//通用赛事联赛赛程
  commonLeagueRankingURL: configure.BASE_URL + configure.ADDRESS + '/commonLeagueRanking',//通用赛事联赛积分榜
}