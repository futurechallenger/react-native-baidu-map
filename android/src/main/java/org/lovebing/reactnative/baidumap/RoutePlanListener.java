package org.lovebing.reactnative.baidumap;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.util.Log;
import android.widget.Toast;
import com.baidu.mapapi.map.BaiduMap;
import com.baidu.mapapi.overlayutil.WalkingRouteOverlay;
import com.baidu.mapapi.search.core.RouteLine;
import com.baidu.mapapi.search.core.SearchResult;
import com.baidu.mapapi.search.route.BikingRouteResult;
import com.baidu.mapapi.search.route.DrivingRouteResult;
import com.baidu.mapapi.search.route.IndoorRouteResult;
import com.baidu.mapapi.search.route.MassTransitRouteResult;
import com.baidu.mapapi.search.route.OnGetRoutePlanResultListener;
import com.baidu.mapapi.search.route.TransitRouteResult;
import com.baidu.mapapi.search.route.WalkingRouteResult;

public class RoutePlanListener implements OnGetRoutePlanResultListener {

  private static final String TAG = RoutePlanListener.class.getSimpleName();
  private BaiduMap mBaiduMap;
  private Context mContext;

  private RouteLine mRouteLine;

  public RoutePlanListener(Context context, BaiduMap baiduMap) {
    mBaiduMap = baiduMap;
    mContext = context;
  }

  @Override
  public void onGetWalkingRouteResult(WalkingRouteResult result) {
    Log.d(TAG, result.toString());
    if (result == null || result.error != SearchResult.ERRORNO.NO_ERROR) {
      Toast.makeText(mContext, "抱歉，未找到结果", Toast.LENGTH_SHORT).show();
    } else if (result.error == SearchResult.ERRORNO.AMBIGUOUS_ROURE_ADDR) {
      // 起终点或途经点地址有岐义，通过以下接口获取建议查询信息
      // result.getSuggestAddrInfo()
      AlertDialog.Builder builder = new AlertDialog.Builder(mContext);
      builder.setTitle("提示");
      builder.setMessage("检索地址有歧义，请重新设置。\n可通过getSuggestAddrInfo()接口获得建议查询信息");
      builder.setPositiveButton("确认", new DialogInterface.OnClickListener() {
        @Override
        public void onClick(DialogInterface dialog, int which) {
          dialog.dismiss();
        }
      });
      builder.create().show();
    } else if (result.error == SearchResult.ERRORNO.NO_ERROR) {
      Log.d(TAG, ">>>>route size " + String.valueOf(result.getRouteLines().size()));
      if (result.getRouteLines().size() > 0) {
        mRouteLine = result.getRouteLines().get(0);
        WalkingRouteOverlay overlay
            = new WalkingRouteOverlay(mBaiduMap);
        mBaiduMap.setOnMarkerClickListener(overlay);
        overlay.setData(result.getRouteLines().get(0));
        overlay.addToMap();
        overlay.zoomToSpan();
      } else {
        Log.d("route result", "结果数<0");
        return;
      }
    }
  }

  @Override
  public void onGetTransitRouteResult(TransitRouteResult transitRouteResult) {

  }

  @Override
  public void onGetMassTransitRouteResult(MassTransitRouteResult massTransitRouteResult) {

  }

  @Override
  public void onGetDrivingRouteResult(DrivingRouteResult drivingRouteResult) {

  }

  @Override
  public void onGetIndoorRouteResult(IndoorRouteResult indoorRouteResult) {

  }

  @Override
  public void onGetBikingRouteResult(BikingRouteResult bikingRouteResult) {

  }
}
