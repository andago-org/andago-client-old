package com.andago.client;

import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // Enable WebViews debugging
    WebView.setWebContentsDebuggingEnabled(true);
  }
}
