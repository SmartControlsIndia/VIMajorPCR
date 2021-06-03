<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Home.aspx.cs" Inherits="VIMajorPCR.Home" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">

    <head runat="server">
        <title>VI Major PCR</title>
        <link href="Assets/Bootstrap/bootstrap.min.css" rel="stylesheet" />
        <link href="Assets/CSS/Style.css?ver=1.1" rel="stylesheet" />
    </head>
    <body class="bgcolorBlue">

        <div class="row header">
            <div class="col-sm-12">
                <div class="logo col-sm-2 col-xs-4">
                    <img alt="Smart Logo" src=".//Assets/Img/smartLogo.png" />
                </div>
                <div class="col-sm-7 col-xs-4" style="padding:0;">
                    <ul class="nav navbar-nav hide" id="userSettingBox">
                        <li class="dropdown">
                            <a onclick="openLogoutPopup();" href="javascript:;" class="dropdown-toggle" data-toggle="dropdown">
                                <div class="logout-panel">
                                    <img alt="Profile Pic" src=".//Assets/Img/default-user-img.jpg" id="picLogo" />

                                    <span class="cut-text text-capitalize usernameLabel"></span>
                                </div>
                            </a>
                        </li>
                    </ul>

                    <button id="pwdBtn" class="btn pull-right hide" style="background-color: #0EBFE9;color:#fff;margin-top: 2.5%;height: 40px;font-size:13px" type="button" onclick="openChangePasswordModal();"><span class="glyphicon glyphicon-cog"></span> Change Password</button>

                    <a class="badgeLink hide" href="javascript:;">Scan Count: <span id="scanCount" class="badge">0</span></a>
                </div>
                <div class="jklogo col-sm-3 col-xs-4">
                    <img alt="JK Logo" src=".//Assets/Img/jkLogo.png" />
                </div>
            </div>
        </div>

        <div class="row" id="container-wrapper"> 

        </div>

        <form id="form1" runat="server">
            <asp:HiddenField ID="wcIDInput" runat="server"  />  
            <asp:HiddenField ID="wcNameInput" runat="server"  />  
        </form>

        <!-- Logout Modal -->
        <div id="logoutModal" class="modal fade" role="dialog">
            <div class="modal-dialog">

                <!-- Modal content-->
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                        <h4 class="modal-title" style="padding-top: 10px;"><span class="glyphicon glyphicon-lock"></span>Logout to your Account</h4>
                    </div>
                    <div class="modal-body">
                        <div id="Login-Form" role="form">
                            <div class="form-group">
                                <div class="input-group">
                                    <label style="font-size:19px;" class="text-capitalize usernameLabel"></label>
                                </div>
                            </div>
                            <button type="button" onclick="logout();" class="btn btn-info btn-block btn-lg">Logout</button>
                            <div class="text-center text-danger marginTop5px" id="loginPwdMsg"></div>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <!-- Defect Modal -->
        <div id="defectModal" class="modal fade" role="dialog">
            <div class="modal-dialog">
               <!-- Modal content-->
               <div class="modal-content">
                  <div class="modal-header">
                      <div class="col-sm-5">
                          <ul class="nav nav-tabs col-sm-8" style="font-size: 23px;border-bottom:none;">
                            <li class="defectAreaLink"><a class="btn-blue" data-toggle="tab" href="#defectAreaScreen">SS Code</a></li>
                            <li class="defectAreaLink"><a class="btn-purple" data-toggle="tab" href="#defectAreaScreen">NSS Code</a></li>
                          </ul>
                      </div>
                      <div class="col-sm-7 text-right breadCrumLink">
                          <span id="defectLink"></span>
                          <span id="defectAreaLink"></span>
                          <span id="subdefectAreaLink"></span>
                      </div>
                  </div>
                  <div class="modal-body" id="modalBody" style="height:300px;overflow:auto;">
                     <div class="row">
                         <div class="tab-content">
                             <div id="defectAreaScreen" class="tab-pane fade">
                                 <ul class="nav nav-tabs col-sm-12" style="font-size: 23px;border-bottom:none;">
                                    <li><a class="defectAreaTab" href="javascript:;">TREAD</a></li>
                                    <li><a class="defectAreaTab" href="javascript:;">SIDEWALL</a></li>
                                    <li><a class="defectAreaTab" href="javascript:;">BEAD</a></li>
                                    <li><a class="defectAreaTab" href="javascript:;">CARCASS</a></li>
                                    <li><a class="defectAreaTab" href="javascript:;">OTHERS</a></li>
                                </ul>
                                <div class="col-sm-12" style="padding-right: 0;padding-left: 1px;">
                                    <div id="defectScreenList"></div>
                                    <input type="hidden" id="statusType" />
                                </div>
                             </div>
                         </div>
                     </div>
                  </div>
                  <div class="modal-footer">
                      <div class="col-sm-7">
                          <div class="col-sm-12 text-center text-danger" style="font-size:20px" id="errMsgDiv"></div>
                      </div>
                      <div class="col-sm-5">
                        <button type="button" class="btn btn-success btn-lg" style="color:#fff;" onclick="clickSaveBtn();">Save Changes</button>&nbsp;&nbsp;&nbsp;&nbsp;
                        <button type="button" class="btn btn-lg btn-default" onclick="closeDefectModal();">Cancel</button>
                      </div>
                  </div>
               </div>
            </div>
         </div>

        <!-- Remark Modal -->
        <div id="remarkModal" class="modal fade" role="dialog">
            <div class="modal-dialog">
               <!-- Modal content-->
               <div class="modal-content">
                  <div class="modal-header"><h3 style="margin-top:0;margin-bottom:0;">Remark Screen</h3></div>
                  <div class="modal-body" style="height:100px;overflow:auto;">
                     <div class="row">
                        <div class="col-sm-12">
                             <textarea class="form-control" id="remarkInput"></textarea>
                        </div>
                     </div>
                  </div>
                  <div class="modal-footer">
                      <div class="col-sm-5">
                      </div>
                      <div class="col-sm-7">
                        <button type="button" class="btn btn-success btn-lg" style="color:#fff;" onclick="saveBarcodeDetails('57','0','0','0');">Save Changes</button>&nbsp;&nbsp;&nbsp;&nbsp;
                        <button type="button" class="btn btn-lg btn-default" onclick="closeRemarkModal();">Cancel</button>
                      </div>
                  </div>
               </div>
            </div>
         </div>

        <!-- Change Password Modal -->
        <div id="changePasswordModal" class="modal fade" role="dialog">
            <div class="modal-dialog">
                <!-- Modal content-->
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" onclick="emptyChangeMsg();" class="close" data-dismiss="modal">&times;</button>
                        <h4 class="modal-title"  style="padding-top:10px;"><span class="glyphicon glyphicon-lock"></span> Change Password to your Account</h4>
                    </div>
                    <div class="modal-body">
                        <div id="Password-Form" role="form">
                            <div class="form-group">
                                <div class="input-group">
                                    <label class="text-capitalize usernameLabel"></label>
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="input-group"> 
                                    <input id="CurrentPassword" type="password" class="form-control input-lg" style="margin-bottom:2px" placeholder="Enter Current Password" required=""/>

                                    <input id="NewPassword" type="password" maxlength="10" class="form-control input-lg" style="margin-bottom:2px" placeholder="Enter New Password" required="" />

                                    <input id="ConfirmPassword" type="password" maxlength="10"  class="form-control input-lg" placeholder="Enter New Confirm Password" required=""/>
                                </div>
                            </div>
                            <button  type="button" onclick="ChangePasswordSave()" class="btn btn-info btn-block btn-lg">Save Changes</button>
                        </div>
                        <div class="form-group text-center" style="margin-top:20px;" id="passwordMessageDiv"></div>
                    </div>
                </div>
            </div>
        </div>

        <script src="Assets/JS/jquery.min.js"></script>
        <script src="Assets/Bootstrap/bootstrap.min.js"></script>
         <script src="Assets/JS/highcharts.js"></script>
        <script src="config.js?ver=1.0"></script>
        <script src="VIMajor.js?ver=0.8"></script>
    </body>

</html>



