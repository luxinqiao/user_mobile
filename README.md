#user_mobile
澜渟用户-移动端

#develop启动
cnpm run serve

#test打包
cnpm run build-test

#prod打包
cnpm run build

#组件应用
#md-toast
<md-toast :show.sync='toastShow' content='发布成功，并加入圈子'>
</md-toast>

#md-alert
<md-alert :show.sync='alertShow' title='领取成功' content='优惠券已放入您的账户，打开澜渟APP立即使用吧！' @bindConfirm='confirm()'>
</md-alert>

#md-confirm
<md-confirm :show.sync='confirmShow' content='仅限新用户领取，<br/>是否前往澜渟App？' @bindLeft='cancel()' @bindRight='confirm()'>
</md-confirm>

#md-popup
<md-popup :show.sync='popupShow'>
    <myIncomeInfo></myIncomeInfo>
</md-popup>

#md-custom
<md-custom :show.sync='customShow' ref='custom'>
    <div style='position:absolute;top:20rem;left:8.75rem;width:20rem;height:15rem;background-color:#fff;'
        @click='$refs.custom.close()'>
        这里放入自定义内容
        <br/>
        点我关闭
    </div>
</md-custom>

#md-picker
<md-picker :show.sync='pickerShow' :datas='pickerDatas' default='总收入' @confirm='pickerConfirm'>
</md-picker>

#md-datetime
<md-datetime :show.sync='datetimeShow' type='year-month' @confirm='datetimeConfirm'
              start='2020-11' end='2030-2' default='2022-6'>
</md-datetime>

#md-share
<md-share :path='sharePath' :img='shareImg' style='position: fixed; bottom: 0;'>
</md-share>
